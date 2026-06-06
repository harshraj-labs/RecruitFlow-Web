import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

function Dashboard() {
    const navigate = useNavigate();

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-blue-600">
                    RecruitFlow
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                        Welcome, {user.name}!
                    </span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        -- You're logged in! --
                    </h2>
                    <p className="text-gray-500">
                        Dashboard coming soon
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;