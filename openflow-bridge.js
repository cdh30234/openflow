/**
 * OpenFlow Bridge API
 * Bridges the OpenFlow website UI to OpenClaw's file-based agent system.
 * Dispatches tasks to agents by writing to their inbox/ folder and updating TASKS.md.
 *
 * Usage: node openflow-bridge.js
 * Runs on port 3030
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3030;
const WORKSPACE = '/home/openclaw/.openclaw/workspace';
const WORKSPACE_H2 = '/home/openclaw/.openclaw/workspace-h2';
const INBOX_DIR = path.join(WORKSPACE, 'inbox');
const TASKS_MD = path.join(WORKSPACE, 'TASKS.md');

// Agent workspace mapping
const AGENT_WORKSPACES = {
    'hamad': WORKSPACE,
    'h2': WORKSPACE_H2,
    'h3': WORKSPACE, // sub-agents share main workspace inbox
    'devin': WORKSPACE,
    'scribe': WORKSPACE,
    'pixel': WORKSPACE,
    'scout': WORKSPACE
};

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function corsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function jsonResponse(res, statusCode, data) {
    corsHeaders(res);
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

// Write task to agent's inbox
function dispatchToInbox(agentId, taskData) {
    const workspace = AGENT_WORKSPACES[agentId] || WORKSPACE;
    const inbox = path.join(workspace, 'inbox');
    ensureDir(inbox);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `task-${taskData.taskId || 'unknown'}-${timestamp}.md`;
    const filepath = path.join(inbox, filename);

    const content = `# مهمة جديدة من OpenFlow
**المعرف:** ${taskData.taskId || 'N/A'}
**العنوان:** ${taskData.title}
**الأولوية:** ${taskData.priority}
**الحالة:** ${taskData.status}
**المسند إلى:** ${agentId}
**تاريخ الإرسال:** ${new Date().toLocaleString('ar-SA')}

## الوصف
${taskData.description || 'لا يوجد وصف'}

## التعليمات
يرجى العمل على هذه المهمة وتحديث التقدم. عند الانتهاء، قم بتحديث الحالة إلى "done".
`;

    fs.writeFileSync(filepath, content, 'utf-8');
    return filepath;
}

// Update TASKS.md with the new task entry
function updateTasksMd(taskData, agentId) {
    let content = '';
    if (fs.existsSync(TASKS_MD)) {
        content = fs.readFileSync(TASKS_MD, 'utf-8');
    }

    // Add task to IN PROGRESS section
    const newEntry = `- [ ] **${taskData.title}** (@${agentId}) - *${taskData.description || 'بدون وصف'}*\n`;

    if (content.includes('## 🚨 IN PROGRESS')) {
        content = content.replace(
            /(## 🚨 IN PROGRESS.*?\n> [^\n]*\n)/s,
            `$1${newEntry}`
        );
    } else {
        content += `\n## 🚨 IN PROGRESS (Jari)\n> **Active Focus**\n${newEntry}`;
    }

    fs.writeFileSync(TASKS_MD, content, 'utf-8');
}

// List inbox files for an agent
function listInbox(agentId) {
    const workspace = AGENT_WORKSPACES[agentId] || WORKSPACE;
    const inbox = path.join(workspace, 'inbox');

    if (!fs.existsSync(inbox)) return [];

    return fs.readdirSync(inbox)
        .filter(f => f.endsWith('.md'))
        .map(f => {
            const content = fs.readFileSync(path.join(inbox, f), 'utf-8');
            return { filename: f, content: content.substring(0, 500) };
        });
}

const server = http.createServer((req, res) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        corsHeaders(res);
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);

    // Health check
    if (url.pathname === '/health' && req.method === 'GET') {
        return jsonResponse(res, 200, { status: 'ok', timestamp: new Date().toISOString() });
    }

    // Dispatch task to agent
    if (url.pathname === '/dispatch' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const { agentId, task } = data;

                if (!agentId || !task || !task.title) {
                    return jsonResponse(res, 400, { error: 'agentId and task.title are required' });
                }

                const filepath = dispatchToInbox(agentId, task);
                updateTasksMd(task, agentId);

                jsonResponse(res, 200, {
                    success: true,
                    message: `Task dispatched to ${agentId}`,
                    file: filepath,
                    timestamp: new Date().toISOString()
                });
            } catch (err) {
                jsonResponse(res, 500, { error: err.message });
            }
        });
        return;
    }

    // List agent inbox
    if (url.pathname === '/inbox' && req.method === 'GET') {
        const agentId = url.searchParams.get('agent') || 'hamad';
        const items = listInbox(agentId);
        return jsonResponse(res, 200, { agent: agentId, items });
    }

    // 404
    jsonResponse(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 OpenFlow Bridge API running on port ${PORT}`);
    console.log(`   Workspace: ${WORKSPACE}`);
    console.log(`   Inbox: ${INBOX_DIR}`);
});
