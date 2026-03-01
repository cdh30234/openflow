import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout({ children }) {
    return (
        <div className="app-container">
            <Sidebar />
            <div className="main-wrapper">
                <Topbar />
                <main className="page-content relative">
                    {children}
                </main>
            </div>
        </div>
    );
}
