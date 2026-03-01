import { useState, useEffect } from 'react';
import { databases, AppwriteConfig, Query, ID } from '../services/appwrite';

export default function Calendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            const res = await databases.listDocuments(
                AppwriteConfig.databaseId,
                'calendar_events'
            );
            setEvents(res.documents.map(e => ({
                id: e.$id,
                title: e.title,
                start: e.start_datetime,
                end: e.end_datetime,
                color: e.type === 'cron' ? '#8b5cf6' : (e.type === 'meeting' ? '#3b82f6' : '#f59e0b')
            })));
        } catch (error) {
            console.error('Failed to load events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <>
            <div className="page-header animate-fade-in flex justify-between items-end">
                <div>
                    <h1 className="page-title text-gradient"><i className="fas fa-calendar-alt ml-2"></i>جدول المواعيد والمهام</h1>
                    <p className="page-subtitle">قم بجدولة المهام، الاجتماعات، وأتمتة الجداول الزمنية الخاصة بك.</p>
                </div>
                <button className="btn btn-primary" onClick={() => alert('إضافة حدث - قريباً')}>
                    <span className="material-icons-round text-sm">add</span> اضافة حدث
                </button>
            </div>

            <div className="glass-card flex-1 min-h-[500px] animate-fade-in flex items-center justify-center p-8" style={{ animationDelay: '0.1s' }}>
                <div className="text-center">
                    <span className="material-icons-round text-6xl text-muted mb-4 block">event_note</span>
                    <h2 className="text-xl font-bold mb-2">نافذة التقويم (جاري النقل)</h2>
                    <p className="text-muted">تم بناء هيكل صفحة التقويم. سيتم دمج مكتبة FullCalendar في تحديث قادم للحفاظ على خفة الحزمة الأولية للواجهة المبنية على React.</p>
                </div>
            </div>
        </>
    );
}
