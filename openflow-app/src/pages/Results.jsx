import { useState, useEffect } from 'react';
import { databases, AppwriteConfig, Query } from '../services/appwrite';
import { marked } from 'marked';

export default function Results() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedResult, setSelectedResult] = useState(null);

    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: false,
        mangle: false
    });

    const fetchResults = async () => {
        try {
            const response = await databases.listDocuments(
                AppwriteConfig.databaseId,
                AppwriteConfig.resultsCollectionId,
                [Query.orderDesc('$createdAt')]
            );
            setResults(response.documents);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    // Filter logic
    const filteredResults = results.filter(res => {
        const matchesTab = activeTab === 'all' || res.agentId === activeTab || (activeTab === 'hamad' && res.agentName === 'حمد');
        const searchString = `${res.title} ${res.content} ${res.agentId} ${res.agentName}`.toLowerCase();
        const matchesSearch = searchString.includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const stats = {
        total: results.length,
        code: results.filter(r => r.type === 'code').length,
        file: results.filter(r => r.type === 'file').length,
        text: results.filter(r => r.type === 'text').length,
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'code': return { icon: 'code', bg: 'bg-blue-500/20', color: 'text-blue-400' };
            case 'file': return { icon: 'description', bg: 'bg-purple-500/20', color: 'text-purple-400' };
            case 'image': return { icon: 'image', bg: 'bg-pink-500/20', color: 'text-pink-400' };
            case 'report': return { icon: 'analytics', bg: 'bg-green-500/20', color: 'text-green-400' };
            default: return { icon: 'text_snippet', bg: 'bg-gray-500/20', color: 'text-gray-400' };
        }
    };

    return (
        <>
            <div className="page-header animate-fade-in flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="page-title">النتائج</h1>
                    <p className="page-subtitle">استعرض مخرجات الوكلاء الفردية والجماعية</p>
                </div>

                <div className="flex gap-4">
                    <div className="bg-bg-card rounded-xl border border-border-light p-3 flex gap-6 shadow-sm">
                        <div className="text-center">
                            <div className="text-xl font-bold text-primary">{stats.total}</div>
                            <div className="text-xs text-muted">الإجمالي</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-blue-400">{stats.code}</div>
                            <div className="text-xs text-muted">برمجيات</div>
                        </div>
                        <div className="text-center">
                            <div className="text-xl font-bold text-purple-400">{stats.file}</div>
                            <div className="text-xs text-muted">ملفات</div>
                        </div>
                    </div>
                    <button className="btn btn-primary h-auto" onClick={() => fetchResults()}>
                        <span className="material-icons-round">refresh</span>
                        تحديث
                    </button>
                </div>
            </div>

            <div className="glass-card animate-fade-in mb-6 p-4" style={{ animationDelay: '0.1s' }}>
                <div className="flex flex-wrap gap-2">
                    <button className={`btn ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'} rounded-full px-6`} onClick={() => setActiveTab('all')}>
                        <span className="material-icons-round text-sm">dashboard</span> جميع النتائج
                    </button>
                    <button className={`btn ${activeTab === 'hamad' ? 'btn-primary' : 'btn-secondary'} rounded-full px-6 flex items-center gap-2`} onClick={() => setActiveTab('hamad')}>
                        <img src="https://ui-avatars.com/api/?name=Hamad&background=3b82f6&color=fff" className="w-5 h-5 rounded-full" alt="Hamad" />
                        عرض حمد الشامل
                    </button>
                    <div className="w-px h-8 bg-border-light mx-2 align-middle my-auto"></div>
                    <button className={`btn ${activeTab === 'shannon-main' ? 'btn-primary' : 'btn-secondary'} rounded-full px-6`} onClick={() => setActiveTab('shannon-main')}>Shannon Main</button>
                    <button className={`btn ${activeTab === 'shannon-worker' ? 'btn-primary' : 'btn-secondary'} rounded-full px-6`} onClick={() => setActiveTab('shannon-worker')}>Shannon Worker</button>
                    <button className={`btn ${activeTab === 'turing-docs' ? 'btn-primary' : 'btn-secondary'} rounded-full px-6`} onClick={() => setActiveTab('turing-docs')}>Turing Docs</button>

                    <div className="relative mr-auto">
                        <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-muted text-sm">search</span>
                        <input
                            type="text"
                            placeholder="ابحث في النتائج..."
                            className="bg-bg-app border border-border-light rounded-full py-2 pr-10 pl-4 text-sm text-text-primary focus:outline-none focus:border-primary"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20"><span className="material-icons-round animate-spin text-4xl text-primary">autorenew</span></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {filteredResults.length > 0 ? filteredResults.map(result => {
                        const style = getIconForType(result.type);
                        return (
                            <div key={result.$id} className="bg-bg-card border border-border-light rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col h-64" onClick={() => setSelectedResult(result)}>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.bg} ${style.color}`}>
                                        <span className="material-icons-round">{style.icon}</span>
                                    </div>
                                    <div className="text-left">
                                        <span className="text-xs text-muted block">{new Date(result.$createdAt).toLocaleDateString('ar-SA')}</span>
                                        <span className={`tag mt-1 ${result.status === 'final' ? 'tag-green' : 'tag-orange'}`}>{result.status === 'final' ? 'نهائي' : 'مسودة'}</span>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg mb-2 truncate" title={result.title}>{result.title}</h3>

                                <div className="text-sm text-muted mb-4 line-clamp-3 flex-1">
                                    {result.type === 'code' ? 'Code Snippet available inside.' : result.content.substring(0, 150) + '...'}
                                </div>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-subtle">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-bg-app flex items-center justify-center text-[10px] uppercase font-bold text-primary">
                                            {result.agentName ? result.agentName.substring(0, 2) : 'A'}
                                        </div>
                                        <span className="text-xs font-semibold">{result.agentName || result.agentId}</span>
                                    </div>
                                    {result.fileUrl && <span className="material-icons-round text-muted group-hover:text-primary transition-colors text-sm">attachment</span>}
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-full text-center py-20 text-muted">لا توجد نتائج مطابقة للبحث أو الفلتر الحالي.</div>
                    )}
                </div>
            )}

            {/* Result View Modal */}
            {selectedResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedResult(null)}>
                    <div className="glass-card w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6 pb-4 border-b border-border-subtle">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconForType(selectedResult.type).bg} ${getIconForType(selectedResult.type).color}`}>
                                    <span className="material-icons-round text-2xl">{getIconForType(selectedResult.type).icon}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{selectedResult.title}</h2>
                                    <div className="text-sm text-muted">مُنجز بواسطة: {selectedResult.agentName || selectedResult.agentId} | مهمة: {selectedResult.taskId || 'غير محدد'}</div>
                                </div>
                            </div>
                            <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10" onClick={() => setSelectedResult(null)}>
                                <span className="material-icons-round text-sm">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto prose prose-invert max-w-none pr-4">
                            <div dangerouslySetInnerHTML={{ __html: marked.parse(selectedResult.content || '') }}></div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border-subtle flex justify-between items-center">
                            {selectedResult.fileUrl ? (
                                <a href={selectedResult.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                                    <span className="material-icons-round">download</span> تحميل الملف المرفق
                                </a>
                            ) : <div></div>}
                            <button className="btn btn-secondary">
                                <span className="material-icons-round">content_copy</span> نسخ المحتوى
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
