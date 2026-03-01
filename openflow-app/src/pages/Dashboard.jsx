import KanbanBoard from '../components/Dashboard/KanbanBoard';
import DispatchLog from '../components/Dashboard/DispatchLog';

export default function Dashboard() {
    return (
        <>
            <div className="page-header animate-fade-in">
                <div>
                    <h1 className="page-title">لوحة القيادة والمراقبة</h1>
                    <p className="page-subtitle">نظرة عامة على سير العمل وحالة الوكلاء الفوري</p>
                </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '0.1s', height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}>
                <KanbanBoard />
                <DispatchLog />
            </div>
        </>
    );
}
