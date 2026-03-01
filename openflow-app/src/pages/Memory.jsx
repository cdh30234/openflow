import { useState, useEffect } from 'react';
import { databases, AppwriteConfig } from '../services/appwrite';
import { marked } from 'marked';

export default function Memory() {
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="page-header animate-fade-in flex justify-between items-end">
                <div>
                    <h1 className="page-title text-gradient"><i className="fas fa-brain ml-2"></i>بنك الذاكرة والسجلات</h1>
                    <p className="page-subtitle">قاعدة معرفية شاملة، توثيق للمشاريع، وسجلات النظام.</p>
                </div>
                <div className="flex gap-3">
                    <button className="btn btn-primary" onClick={() => alert('إضافة مستند - قريباً')}>
                        <span className="material-icons-round text-sm">post_add</span> مستند جديد
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-6 border-b border-light mb-6 overflow-x-auto pb-2 flex-shrink-0">
                <button className="pb-2 border-b-2 border-primary text-primary font-bold text-sm whitespace-nowrap">الكل</button>
                <button className="pb-2 border-b-2 border-transparent text-secondary hover:text-primary transition-colors font-medium text-sm whitespace-nowrap">السجلات (Logs)</button>
                <button className="pb-2 border-b-2 border-transparent text-secondary hover:text-primary transition-colors font-medium text-sm whitespace-nowrap">المستندات (Docs)</button>
            </div>

            <div className="glass-card flex-1 min-h-[500px] animate-fade-in flex items-center justify-center p-8" style={{ animationDelay: '0.1s' }}>
                <div className="text-center">
                    <span className="material-icons-round text-6xl text-muted mb-4 block">folder_special</span>
                    <h2 className="text-xl font-bold mb-2">بنك الذاكرة قيد النقل</h2>
                    <p className="text-muted max-w-md mx-auto">جارٍ نقل نظام Markdown والمستندات إلى بيئة React. سيتم توفير واجهة قراءة وكتابة محسنة في التحديث القادم.</p>
                </div>
            </div>
        </>
    );
}
