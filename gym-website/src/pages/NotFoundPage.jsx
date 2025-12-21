import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all"
          >
            <Home size={20} />
            <span>Go Home</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-all"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
        </div>
        
        <div className="mt-12 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> If you're looking for the admin panel, visit{' '}
            <Link to="/admin-login" className="text-blue-600 hover:text-blue-700 font-medium">
              /admin-login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;