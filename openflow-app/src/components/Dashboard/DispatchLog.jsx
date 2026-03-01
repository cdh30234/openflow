import { useState, useEffect } from 'react';

export default function DispatchLog() {
    const [logs, setLogs] = useState([]);
    const [bridgeStatus, setBridgeStatus] = useState('offline');

    useEffect(() => {
        const fetchDispatchStatus = async () => {
            try {
                const response = await fetch('http://157.230.23.117:3030/status');
                if (response.ok) {
                    const data = await response.json();
                    setBridgeStatus('online');

                    if (data.activeFiles) {
                        const formattedLogs = data.activeFiles.map(file => ({
                            id: file.name,
                            taskId: file.taskId || 'غير معروف',
                            agentId: file.agentId,
                            status: file.stage,
                            time: file.mtime
                        }));
                        // Sort by time descending
                        formattedLogs.sort((a, b) => new Date(b.time) - new Date(a.time));
                        setLogs(formattedLogs);
                    }
                } else {
                    setBridgeStatus('offline');
                }
            } catch (error) {
                setBridgeStatus('offline');
                console.error('Bridge API error:', error);
            }
        };

        fetchDispatchStatus();
        const interval = setInterval(fetchDispatchStatus, 5000);
        return () => clearInterval(interval);
    }, []);

    const getStageDisplay = (stage) => {
        switch (stage) {
            case 'dispatched': return { icon: 'schedule', text: 'تم الإرسال', color: 'text-orange-400' };
            case 'delivered': return { icon: 'outbox', text: 'في الصندوق', color: 'text-blue-400' };
            case 'picked_up': return { icon: 'engineering', text: 'قيد التنفيذ', color: 'text-purple-400' };
            case 'done': return { icon: 'check_circle', text: 'مكتمل', color: 'text-green-400' };
            default: return { icon: 'help_outline', text: 'مجهول', color: 'text-gray-400' };
        }
    };

    return (
        <div className="glass-card mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                    <span className="material-icons-round text-primary">dynamic_feed</span>
                    سجل الإرسال المباشر (Dispatch)
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">Bridge API:</span>
                    <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 text-xs">
                        {bridgeStatus === 'online' ? (
                            <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span><span className="text-green-400">متصل (Online)</span></>
                        ) : (
                            <><span className="w-2 h-2 rounded-full bg-red-500"></span><span className="text-red-400">غير متصل (Offline)</span></>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-h-60 overflow-y-auto pr-2">
                {logs.length === 0 ? (
                    <div className="text-center text-muted p-4 text-sm">لا توجد عمليات إرسال نشطة حالياً</div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {logs.map(log => {
                            const stage = getStageDisplay(log.status);
                            return (
                                <div key={log.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition">
                                    <div className="flex items-center gap-3">
                                        <span className={`material-icons-round ${stage.color}`}>{stage.icon}</span>
                                        <div>
                                            <div className="font-semibold text-sm">مهمة إلى {log.agentId}</div>
                                            <div className="text-xs text-muted">معرف المهمة: {log.taskId}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm ${stage.color}`}>{stage.text}</div>
                                        <div className="text-xs text-muted">{new Date(log.time).toLocaleTimeString('ar-SA')}</div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
