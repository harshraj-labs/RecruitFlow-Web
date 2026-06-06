import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LogOut, BarChart3 } from 'lucide-react';

function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <BarChart3 className="text-blue-600" size={24} />
                    <h1 className="text-xl font-bold text-blue-600">
                        RecruitFlow
                    </h1>
                </div>

                {/* User info + Logout */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">
                            {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user.email}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;