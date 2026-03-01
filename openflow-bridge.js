/**
 * OpenFlow Bridge API v2
 * Bridges the OpenFlow website to OpenClaw's file-based agent system.
 * - Dispatches tasks by writing to inbox/
 * - Tracks dispatch status (pending/picked-up/done)
 * - Provides status endpoint for the website to poll
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3030;
const WORKSPACE = '/home/openclaw/.openclaw/workspace';
const WORKSPACE_H2 = '/home/openclaw/.openclaw/workspace-h2';
const INBOX_DIR = path.join(WORKSPACE, 'inbox');
const DONE_DIR = path.join(WORKSPACE, 'inbox', 'done');
const TASKS_MD = path.join(WORKSPACE, 'TASKS.md');
const STATUS_FILE = path.join(WORKSPACE, 'inbox', 'dispatch-status.json');

const AGENT_WORKSPACES = {
    'hamad': WORKSPACE,
    'h2': WORKSPACE_H2,
    'h3': WORKSPACE,
    'devin': WORKSPACE,
    'scribe': WORKSPACE,
    'pixel': WORKSPACE,
    'scout': WORKSPACE
};

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
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

// ===== Status Tracking =====
function loadStatuses() {
    try {
        if (fs.existsSync(STATUS_FILE)) {
            return JSON.parse(fs.readFileSync(STATUS_FILE, 'utf-8'));
        }
    } catch (e) { }
    return {};
}

function saveStatuses(statuses) {
    fs.writeFileSync(STATUS_FILE, JSON.stringify(statuses, null, 2), 'utf-8');
}

function setDispatchStatus(taskId, agentId, status, details = '') {
    const statuses = loadStatuses();
    statuses[taskId] = {
        agentId,
        status, // 'dispatched' | 'delivered' | 'picked_up' | 'working' | 'done' | 'error'
        details,
        updatedAt: new Date().toISOString()
    };
    saveStatuses(statuses);
}

// Check if task files were picked up (deleted/moved from inbox)
function refreshStatuses() {
    const statuses = loadStatuses();
    Object.entries(statuses).forEach(([taskId, info]) => {
        if (info.status === 'delivered') {
            // Check if the file still exists in inbox
            const files = fs.existsSync(INBOX_DIR) ? fs.readdirSync(INBOX_DIR) : [];
            const taskFile = files.find(f => f.includes(taskId));
            if (!taskFile) {
                // File was removed from inbox = agent picked it up
                info.status = 'picked_up';
                info.details = 'الوكيل استلم المهمة وبدأ العمل عليها';
                info.updatedAt = new Date().toISOString();
            }
        }
    });

    // Check done directory
    ensureDir(DONE_DIR);
    const doneFiles = fs.readdirSync(DONE_DIR);
    Object.entries(statuses).forEach(([taskId, info]) => {
        if (info.status !== 'done') {
            const doneFile = doneFiles.find(f => f.includes(taskId));
            if (doneFile) {
                info.status = 'done';
                info.details = 'المهمة مكتملة';
                info.updatedAt = new Date().toISOString();
            }
        }
    });

    saveStatuses(statuses);
    return statuses;
}

// ===== Task Dispatch =====
function dispatchToInbox(agentId, taskData) {
    const workspace = AGENT_WORKSPACES[agentId] || WORKSPACE;
    const inbox = path.join(workspace, 'inbox');
    ensureDir(inbox);

    const taskId = taskData.taskId || 'unknown';
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `task-${taskId}-${timestamp}.md`;
    const filepath = path.join(inbox, filename);

    const content = `# مهمة جديدة من OpenFlow
**المعرف:** ${taskId}
**العنوان:** ${taskData.title}
**الأولوية:** ${taskData.priority}
**الحالة:** ${taskData.status}
**المسند إلى:** ${agentId}
**تاريخ الإرسال:** ${new Date().toLocaleString('ar-SA')}

## الوصف
${taskData.description || 'لا يوجد وصف'}

## التعليمات
يرجى العمل على هذه المهمة وتحديث التقدم.
عند الانتهاء، انقل هذا الملف إلى inbox/done/ وحدّث TASKS.md.
`;

    fs.writeFileSync(filepath, content, 'utf-8');
    setDispatchStatus(taskId, agentId, 'delivered', 'تم إيصال المهمة لصندوق الوكيل');
    return filepath;
}

function updateTasksMd(taskData, agentId) {
    let content = '';
    if (fs.existsSync(TASKS_MD)) content = fs.readFileSync(TASKS_MD, 'utf-8');
    const newEntry = `- [ ] **${taskData.title}** (@${agentId}) - *${taskData.description || 'مهمة من OpenFlow'}*\n`;
    if (content.includes('## 🚨 IN PROGRESS')) {
        content = content.replace(/(## 🚨 IN PROGRESS.*?\n> [^\n]*\n)/s, `$1${newEntry}`);
    } else {
        content += `\n## 🚨 IN PROGRESS (Jari)\n> **Active Focus**\n${newEntry}`;
    }
    fs.writeFileSync(TASKS_MD, content, 'utf-8');
}

// ===== HTTP Server =====
const server = http.createServer((req, res) => {
    if (req.method === 'OPTIONS') {
        corsHeaders(res); res.writeHead(204); res.end(); return;
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);

    // Health check
    if (url.pathname === '/health' && req.method === 'GET') {
        return jsonResponse(res, 200, {
            status: 'ok',
            timestamp: new Date().toISOString(),
            inboxFiles: fs.existsSync(INBOX_DIR) ? fs.readdirSync(INBOX_DIR).filter(f => f.endsWith('.md')).length : 0
        });
    }

    // Dispatch status for all tasks
    if (url.pathname === '/status' && req.method === 'GET') {
        const statuses = refreshStatuses();
        return jsonResponse(res, 200, { statuses });
    }

    // Dispatch status for specific task
    if (url.pathname === '/status/task' && req.method === 'GET') {
        const taskId = url.searchParams.get('id');
        const statuses = refreshStatuses();
        return jsonResponse(res, 200, { taskId, status: statuses[taskId] || null });
    }

    // Dispatch task
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
                setDispatchStatus(task.taskId || 'unknown', agentId, 'dispatched', 'جاري إيصال المهمة...');
                const filepath = dispatchToInbox(agentId, task);
                updateTasksMd(task, agentId);
                jsonResponse(res, 200, { success: true, message: `Task dispatched to ${agentId}`, file: filepath });
            } catch (err) {
                jsonResponse(res, 500, { error: err.message });
            }
        });
        return;
    }

    // List inbox
    if (url.pathname === '/inbox' && req.method === 'GET') {
        const agentId = url.searchParams.get('agent') || 'hamad';
        const workspace = AGENT_WORKSPACES[agentId] || WORKSPACE;
        const inbox = path.join(workspace, 'inbox');
        let items = [];
        if (fs.existsSync(inbox)) {
            items = fs.readdirSync(inbox).filter(f => f.endsWith('.md')).map(f => ({
                filename: f,
                preview: fs.readFileSync(path.join(inbox, f), 'utf-8').substring(0, 300)
            }));
        }
        return jsonResponse(res, 200, { agent: agentId, items });
    }

    jsonResponse(res, 404, { error: 'Not found' });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 OpenFlow Bridge API v2 running on port ${PORT}`);
    ensureDir(INBOX_DIR);
    ensureDir(DONE_DIR);
    // Set initial statuses for existing inbox files
    const files = fs.readdirSync(INBOX_DIR).filter(f => f.endsWith('.md'));
    files.forEach(f => {
        const match = f.match(/task-(T-\d+)/);
        if (match) {
            const statuses = loadStatuses();
            if (!statuses[match[1]]) {
                setDispatchStatus(match[1], 'unknown', 'delivered', 'موجود في صندوق الوارد');
            }
        }
    });
});
