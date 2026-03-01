import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className="mobile-toggle fixed top-4 right-4 z-50 bg-bg-card p-2 rounded-md lg:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="material-icons-round text-text-primary">menu</span>
            </button>

            <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
                <div className="sidebar-header">
                    <NavLink to="/" className="brand">
                        <div className="brand-icon">
                            <span className="material-icons-round">graphic_eq</span>
                        </div>
                        <div className="brand-text">OpenFlow</div>
                    </NavLink>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-label">القائمة الرئيسية</div>
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="material-icons-round nav-icon">grid_view</span>
                        <span>الرئيسية</span>
                    </NavLink>
                    <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="material-icons-round nav-icon">forum</span>
                        <span>التواصل مع المنسق</span>
                    </NavLink>
                    <NavLink to="/results" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="material-icons-round nav-icon">analytics</span>
                        <span>النتائج</span>
                    </NavLink>

                    <div className="nav-label mt-4">الفريق والموارد</div>
                    <NavLink to="/team" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="material-icons-round nav-icon">group</span>
                        <span>الهيكل والفريق</span>
                    </NavLink>
                    <NavLink to="/calendar" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="material-icons-round nav-icon">event</span>
                        <span>التقويم والمهام</span>
                    </NavLink>
                    <NavLink to="/office" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="material-icons-round nav-icon">business</span>
                        <span>المكتب الرقمي</span>
                    </NavLink>
                    <NavLink to="/memory" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="material-icons-round nav-icon">memory</span>
                        <span>الذاكرة المؤسسية</span>
                    </NavLink>
                    <NavLink to="/content" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="material-icons-round nav-icon">campaign</span>
                        <span>دورة المحتوى</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-widget">
                        <img src="https://ui-avatars.com/api/?name=Hamad&background=3b82f6&color=fff" alt="User" className="user-avatar" />
                        <div className="user-info">
                            <span className="user-name">حمد</span>
                            <span className="user-role">المدير العام</span>
                        </div>
                        <span className="material-icons-round text-muted mr-auto text-sm">unfold_more</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
