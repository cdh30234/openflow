export default function Topbar() {
    return (
        <header className="topbar">
            <div className="search-container">
                <span className="material-icons-round search-icon">search</span>
                <input type="text" className="search-input" placeholder="البحث في المستندات والمهام..." />
            </div>

            <div className="topbar-actions">
                <div className="lang-switcher">
                    <button className="lang-btn active">عربي</button>
                    <button className="lang-btn">EN</button>
                </div>

                <button className="action-btn" title="تحديثات النظام">
                    <span className="material-icons-round">notifications</span>
                    <span className="badge">3</span>
                </button>

                <button className="action-btn" title="الإعدادات">
                    <span className="material-icons-round">settings</span>
                </button>

                <button className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>
                    <span className="material-icons-round" style={{ fontSize: '1rem' }}>add</span>
                    مهمة جديدة
                </button>
            </div>
        </header>
    );
}
