import { useState, useEffect } from 'react';
import { databases, AppwriteConfig, Query } from '../services/appwrite';

export default function Team() {
    const [team, setTeam] = useState([]);
    const [leader, setLeader] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchTeam = async () => {
        try {
            const res = await databases.listDocuments(
                AppwriteConfig.databaseId,
                'agents',
                [Query.limit(20)]
            );

            const agents = res.documents;
            const foundLeader = agents.find(a => a.name === 'Hamad');
            setLeader(foundLeader);

            const otherAgents = agents.filter(a => a.name !== 'Hamad' && !['H2', 'H3'].includes(a.name));
            const order = ['Devin', 'Pixel', 'Scribe', 'Scout'];
            const sortedTeam = otherAgents.sort((a, b) => {
                let idxA = order.indexOf(a.name);
                let idxB = order.indexOf(b.name);
                if (idxA === -1) idxA = 99;
                if (idxB === -1) idxB = 99;
                return idxA - idxB;
            });

            setTeam(sortedTeam);
        } catch (error) {
            console.error('Failed to load team:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
        const interval = setInterval(fetchTeam, 10000);
        return () => clearInterval(interval);
    }, []);

    const getBgClass = (name) => {
        switch (name) {
            case 'Hamad': return 'bg-gradient-to-br from-primary to-secondary';
            case 'Devin': return 'bg-[#0ea5e9]';
            case 'Scribe': return 'bg-[#f59e0b]';
            case 'Pixel': return 'bg-[#ec4899]';
            case 'Scout': return 'bg-[#10b981]';
            default: return 'bg-gradient-to-br from-primary to-secondary';
        }
    };

    const renderAgentCard = (agent, isLeader = false) => {
        if (!agent) return null;
        const skills = agent.skills ? agent.skills.split(',') : [];
        const statusClass = agent.status === 'online' ? 'bg-accent-green shadow-[0_0_10px_var(--accent-green)]' :
            (agent.status === 'busy' ? 'bg-accent-orange' : 'bg-text-muted');

        const cardClasses = isLeader
            ? 'glass-card text-center max-w-md w-full mx-auto border-primary-glow shadow-[0_0_20px_rgba(59,130,246,0.1)] bg-gradient-to-br from-primary/10 to-secondary/10'
            : 'glass-card flex flex-col h-full';

        return (
            <div key={agent.$id || agent.name} className={cardClasses}>
                <div className={`flex items-start gap-4 mb-4 ${isLeader ? 'flex-col items-center text-center' : ''}`}>
                    <div className={`w-[72px] h-[72px] rounded-xl flex items-center justify-center text-3xl text-white relative shadow-md ${getBgClass(agent.name)}`}>
                        <i className={`fas fa-${agent.icon || 'robot'}`}></i>
                        <div className={`absolute -bottom-1 -right-1 w-[18px] h-[18px] rounded-full border-4 border-bg-card ${statusClass}`}></div>
                    </div>
                    <div className={`${isLeader ? 'mt-2' : ''} text-right`}>
                        <h2 className="text-xl font-bold text-primary mb-1">{agent.name}</h2>
                        <div className="text-sm font-bold text-accent-orange uppercase tracking-wider">{agent.role}</div>
                    </div>
                </div>

                <p className={`text-sm text-secondary leading-relaxed text-right flex-1 ${isLeader ? 'mb-4' : ''}`}>
                    {agent.description || 'لا يوجد وصف.'}
                </p>

                <div className={`flex flex-wrap gap-2 mt-6 ${isLeader ? 'justify-center' : ''}`}>
                    {skills.map((s, i) => (
                        <span key={i} className="tag tag-blue">{s.trim()}</span>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="page-header animate-fade-in">
                <div>
                    <h1 className="page-title text-gradient"><i className="fas fa-sitemap ml-2"></i>هيكلة الفريق</h1>
                    <p className="page-subtitle">نظرة عامة على وكلاء الذكاء الاصطناعي وتخصصاتهم وحالتهم الحالية.</p>
                </div>
            </div>

            <div className="flex flex-col gap-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>

                {loading ? (
                    <div className="text-center py-10"><span className="material-icons-round animate-spin text-4xl text-primary">autorenew</span></div>
                ) : (
                    <>
                        {leader && renderAgentCard(leader, true)}

                        <div className="flex items-center gap-4 my-4 opacity-70">
                            <div className="h-px bg-border-subtle flex-1"></div>
                            <span className="text-sm font-bold text-muted uppercase tracking-wider">النظام البيئي للوكلاء</span>
                            <div className="h-px bg-border-subtle flex-1"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {team.map(agent => renderAgentCard(agent, false))}
                        </div>
                    </>
                )}

            </div>
        </>
    );
}
