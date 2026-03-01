import { useState, useEffect, useRef } from 'react';
import { databases, AppwriteConfig, Query, ID } from '../services/appwrite';
import { marked } from 'marked';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    // Configure marked to handle markdown safely
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: false,
        mangle: false
    });

    const fetchMessages = async () => {
        try {
            const response = await databases.listDocuments(
                AppwriteConfig.databaseId,
                AppwriteConfig.messagesCollectionId,
                [Query.orderAsc('$createdAt')]
            );
            setMessages(response.documents);
            scrollToBottom();
        } catch (error) {
            console.error('Error fetching messages', error);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = inputText;
        setInputText('');

        // Optimistic update
        const tempId = Date.now().toString();
        setMessages(prev => [...prev, { $id: tempId, role: 'user', content: userMessage, $createdAt: new Date().toISOString() }]);

        try {
            await databases.createDocument(
                AppwriteConfig.databaseId,
                AppwriteConfig.messagesCollectionId,
                ID.unique(),
                {
                    role: 'user',
                    content: userMessage,
                    timestamp: new Date().toISOString()
                }
            );

            setIsTyping(true);

            // Simulate AI thinking and response
            setTimeout(async () => {
                const aiResponse = `لقد استلمت رسالتك: "${userMessage}". \n\nهذا مجرد **رد تجريبي** من نظام *OpenFlow*. سيتم ربطي قريباً بالنموذج اللغوي الفعلي لمعالجة طلباتك المعقدة وتشغيل الوكلاء.`;

                await databases.createDocument(
                    AppwriteConfig.databaseId,
                    AppwriteConfig.messagesCollectionId,
                    ID.unique(),
                    {
                        role: 'agent',
                        agentId: 'openflow-coordinator',
                        content: aiResponse,
                        timestamp: new Date().toISOString()
                    }
                );
                fetchMessages();
                setIsTyping(false);
            }, 1500);

        } catch (error) {
            console.error('Error sending message:', error);
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-160px)]">
            <div className="page-header animate-fade-in flex-shrink-0">
                <div>
                    <h1 className="page-title">التواصل مع المنسق</h1>
                    <p className="page-subtitle flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        متصل بالشبكة العصبية (OpenFlow Coordinator)
                    </p>
                </div>
            </div>

            <div className="glass-card flex-1 flex flex-col overflow-hidden animate-fade-in" style={{ animationDelay: '0.1s', padding: 0 }}>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {messages.length === 0 && !isTyping ? (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
                            <span className="material-icons-round text-6xl mb-4 text-primary">forum</span>
                            <h2 className="text-xl font-bold mb-2">مرحباً بك في نظام OpenFlow</h2>
                            <p className="max-w-md">أنا المنسق الذكي الخاص بك. يمكنك طلب إنجاز مهام، تحليل بيانات، أو برمجة خدمات جديدة. كيف يمكنني مساعدتك اليوم؟</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.$id} className={`flex max-w-[85%] ${msg.role === 'user' ? 'mr-auto flex-row-reverse' : 'ml-auto flex-row'} items-end gap-3`}>
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md
                  ${msg.role === 'user' ? 'bg-bg-card border border-border-light' : 'bg-gradient-to-br from-primary to-secondary'}`}>
                                    {msg.role === 'user' ? (
                                        <span className="material-icons-round text-text-primary text-sm">person</span>
                                    ) : (
                                        <span className="material-icons-round text-white text-sm">smart_toy</span>
                                    )}
                                </div>

                                <div className={`p-4 rounded-2xl shadow-sm relative group
                  ${msg.role === 'user'
                                        ? 'bg-bg-card border border-border-light rounded-br-none'
                                        : 'bg-primary/10 border border-primary/20 rounded-bl-none text-right'}`}>

                                    {msg.role === 'agent' && (
                                        <div className="text-xs text-primary font-bold mb-1 ml-2">OpenFlow</div> // RTL Fix: ml-2 for left margin, since text is arabic
                                    )}

                                    <div
                                        className="text-sm prose prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: marked.parse(msg.content || '') }}
                                    />

                                    {msg.fileUrl && (
                                        <div className="mt-3 p-3 bg-black/20 rounded-lg flex items-center gap-3 border border-white/5">
                                            <span className="material-icons-round text-primary text-2xl">description</span>
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-sm font-semibold truncate">مرفق</div>
                                                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline truncate block">
                                                    {msg.fileUrl}
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-[0.65rem] text-muted mt-2 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                                        {new Date(msg.$createdAt).toLocaleTimeString('ar-SA')}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {isTyping && (
                        <div className="flex max-w-[85%] ml-auto flex-row items-end gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md bg-gradient-to-br from-primary to-secondary">
                                <span className="material-icons-round text-white text-sm">smart_toy</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 rounded-bl-none shadow-sm flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-primary animate-bounce"></span>
                                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                                <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border-subtle bg-bg-app/50 backdrop-blur-md">
                    <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="اكتب رسالتك للمنسق... (Shift + Enter لسطر جديد)"
                            className="w-full bg-bg-card border border-border-light rounded-xl py-4 pl-14 pr-4 text-text-primary resize-none h-14 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors overflow-hidden leading-relaxed"
                            style={{ direction: 'rtl' }}
                        />

                        <div className="absolute left-2 top-2 flex items-center gap-1"> {/* RTL Fix: Buttons on the left */}
                            <button
                                type="button"
                                className="w-10 h-10 rounded-lg flex items-center justify-center text-muted hover:bg-white/5 hover:text-text-primary transition-colors"
                                title="إرفاق ملف أو رابط"
                            >
                                <span className="material-icons-round">attach_file</span>
                            </button>

                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-sm
                  ${inputText.trim()
                                        ? 'bg-primary text-white hover:bg-primary-hover shadow-primary-glow'
                                        : 'bg-white/5 text-muted cursor-not-allowed'}`}
                            >
                                <span className="material-icons-round" style={{ transform: 'rotate(180deg)' }}>send</span> {/* RTL Fix: Rotate send icon for Arabic */}
                            </button>
                        </div>
                    </form>
                    <div className="text-center mt-2 text-xs text-muted">
                        يمكن لـ OpenFlow معالجة الأكواد البرمجية، قراءة الملفات، وتوجيه الوكلاء الفرعيين.
                    </div>
                </div>

            </div>
        </div>
    );
}
