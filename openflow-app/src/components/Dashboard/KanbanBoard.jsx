import { useState, useEffect } from 'react';
import { databases, AppwriteConfig, Query } from '../../services/appwrite';

export default function KanbanBoard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTasks = async () => {
        try {
            const response = await databases.listDocuments(
                AppwriteConfig.databaseId,
                AppwriteConfig.tasksCollectionId,
                [Query.orderDesc('$createdAt')]
            );
            setTasks(response.documents);
        } catch (error) {
            console.error('Error fetching tasks', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 5000); // Poll every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const getTasksByStatus = (status) => tasks.filter(t => t.status === status);

    const columns = [
        { id: 'todo', title: 'مهام قيد الانتظار', color: 'bg-blue-500' },
        { id: 'in_progress', title: 'جاري التنفيذ', color: 'bg-yellow-500' },
        { id: 'review', title: 'المراجعة والتدقيق', color: 'bg-purple-500' },
        { id: 'done', title: 'مكتملة', color: 'bg-green-500' }
    ];

    if (loading) return <div className="p-8 text-center text-muted">جاري تحميل المهام...</div>;

    return (
        <div className="kanban-board">
            {columns.map(col => (
                <div key={col.id} className="kanban-col">
                    <div className="kanban-col-header">
                        <h3 className="kanban-col-title">
                            {col.title} <span className="text-xs text-muted">({getTasksByStatus(col.id).length})</span>
                        </h3>
                        <div className={`col-indicator ${col.color}`} style={{ backgroundColor: getIndicatorColor(col.id) }}></div>
                    </div>
                    <div className="kanban-cards">
                        {getTasksByStatus(col.id).map(task => (
                            <div key={task.$id} className="task-card">
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`tag ${getPriorityTag(task.priority)}`}>{task.priority}</span>
                                    <span className="text-xs text-muted">{new Date(task.$createdAt).toLocaleDateString()}</span>
                                </div>
                                <h4 className="task-title">{task.title}</h4>
                                <div className="text-xs text-muted mb-3 line-clamp-2">{task.description}</div>
                                {task.assigned_agent && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="material-icons-round text-xs text-primary">smart_toy</span>
                                        <span className="text-xs font-semibold">{task.assigned_agent}</span>
                                    </div>
                                )}
                                {task.progress !== undefined && (
                                    <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden mt-2">
                                        <div
                                            className="bg-primary h-full"
                                            style={{ width: `${task.progress}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

function getIndicatorColor(status) {
    if (status === 'todo') return '#3b82f6';
    if (status === 'in_progress') return '#f59e0b';
    if (status === 'review') return '#8b5cf6';
    if (status === 'done') return '#10b981';
    return '#64748b';
}

function getPriorityTag(priority) {
    if (priority === 'عاجل' || priority === 'high') return 'tag-red';
    if (priority === 'متوسط' || priority === 'medium') return 'tag-orange';
    if (priority === 'عادي' || priority === 'low') return 'tag-blue';
    return 'tag-blue';
}
