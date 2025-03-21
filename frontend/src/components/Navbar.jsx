import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, Briefcase, User } from 'lucide-react';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuthStore();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">JobPortal</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                <Link to="/jobs" className="text-gray-600 hover:text-blue-600">Jobs</Link>
                {user?.role === 'recruiter' && (
                  <Link to="/post-job" className="text-gray-600 hover:text-blue-600">Post Job</Link>
                )}
                <Link to="/applications" className="text-gray-600 hover:text-blue-600">Applications</Link>
                <div className="flex items-center space-x-2 text-gray-600">
                  <User className="h-5 w-5" />
                  <span>{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;