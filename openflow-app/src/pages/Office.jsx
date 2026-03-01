import { useState, useEffect } from 'react';
import { databases, AppwriteConfig } from '../services/appwrite';

export default function Office() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Simplified version of the 3D office for React.
    // We'll render a list or grid to preserve the visual logic while keeping it maintainable in React.

    const fetchAgents = async () => {
        try {
            const res = await databases.listDocuments(AppwriteConfig.databaseId, 'agents');
            setAgents(res.documents);
        } catch (error) {
            console.error('Failed to load office agents:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const renderWorkstation = (agent) => {
        const isWorking = agent.status === 'online' || agent.status === 'busy';
        const isLeader = agent.name === 'Hamad';

        return (
            <div key={agent.$id} className={`relative flex flex-col items-center justify-end p-4 transition-all ${isLeader ? 'scale-110' : ''}`}>
                {/* Agent Info Hover */}
                <div className="absolute -top-16 opacity-0 hover:opacity-100 transition-opacity bg-slate-900/90 p-2 rounded-md border border-slate-700 text-center z-20 w-32 backdrop-blur-sm shadow-xl">
                    <span className="font-bold text-white block text-sm">{agent.name}</span>
                    <span className="text-xs text-slate-400">{agent.current_task || agent.role}</span>
                </div>

                {/* Monitor */}
                <div className="relative w-20 h-14 bg-black border-4 border-slate-600 rounded-sm mb-2 z-10 flex items-center justify-center overflow-hidden flex-col">
                    <div className={`w-full h-full ${isWorking ? 'bg-primary/80 animate-pulse' : 'bg-slate-800'}`}></div>
                    <div className="absolute -bottom-2 w-2 h-4 bg-slate-600"></div>
                </div>

                {/* Desk */}
                <div className={`w-36 h-12 rounded-lg border-b-8 shadow-2xl relative z-0 flex justify-center items-end ${isLeader ? 'bg-gradient-to-br from-blue-900 to-slate-900 border-slate-900' : 'bg-slate-800 border-slate-900'}`}>

                    {/* Avatar sitting at desk */}
                    <div className={`absolute -bottom-4 w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center text-white shadow-lg z-30 transition-transform ${isWorking ? '-translate-y-2' : ''} ${isLeader ? 'bg-gradient-to-br from-primary to-secondary' : 'bg-slate-600'}`}>
                        <span className="text-xl">{agent.name.charAt(0)}</span>
                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${isWorking ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="page-header animate-fade-in flex justify-between items-end">
                <div>
                    <h1 className="page-title text-gradient"><i className="fas fa-building ml-2"></i>المكتب الرقمي المتزامن</h1>
                    <p className="page-subtitle">محاكاة مرئية حية لبيئة عمل الوكلاء وحالتهم الراهنة.</p>
                </div>
            </div>

            <div className="glass-card flex-1 min-h-[500px] animate-fade-in flex items-center justify-center overflow-hidden relative" style={{ animationDelay: '0.1s' }}>

                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 1px, transparent 1px)',
                        backgroundSize: '30px 30px'
                    }}>
                </div>

                <div className="w-[90%] min-h-[400px] bg-slate-900/40 border border-slate-700/50 rounded-2xl p-10 shadow-2xl relative flex flex-wrap justify-center items-center gap-12 z-10" style={{ transform: 'rotateX(5deg)', perspective: '1000px' }}>
                    {loading ? (
                        <div className="text-white"><span className="material-icons-round animate-spin">sync</span> جاري تحميل المكتب...</div>
                    ) : (
                        agents.map(a => renderWorkstation(a))
                    )}
                </div>
            </div>
        </>
    );
}
