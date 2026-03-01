import { useState, useEffect } from 'react';
import { databases, AppwriteConfig } from '../services/appwrite';

export default function ContentPipeline() {
    const [loading, setLoading] = useState(false);

    // Structural component for Content Pipeline.

    return (
        <>
            <div className="page-header px-6 pt-6 pb-2 border-b border-light flex justify-between items-center animate-fade-in flex-shrink-0">
                <div>
                    <h1 className="page-title text-gradient"><i className="fas fa-video ml-2"></i>دورة المحتوى (Content Pipeline)</h1>
                    <p className="page-subtitle">إدارة سير عمل المحتوى من الفكرة حتى النشر.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="btn btn-primary" onClick={() => alert('إضافة محتوى - قريباً')}>
                        <span className="material-icons-round text-sm">add</span> إضافة محتوى
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden px-6 py-4 pipeline-scroll animate-fade-in flex items-center justify-center" style={{ animationDelay: '0.1s' }}>
                <div className="text-center">
                    <span className="material-icons-round text-6xl text-muted mb-4 block">campaign</span>
                    <h2 className="text-xl font-bold mb-2">منصة نشر المحتوى قيد التحديث</h2>
                    <p className="text-muted max-w-sm mx-auto">يجري حالياً تنظيم مراحل إنتاج المحتوى لتدعم السحب والإفلات والتكامل مع N8N في تحديث قادم.</p>
                </div>
            </div>
        </>
    );
}
