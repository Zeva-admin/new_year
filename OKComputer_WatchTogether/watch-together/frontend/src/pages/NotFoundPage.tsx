import { Link } from 'react-router-dom';
import { Home, Film } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center">
      <div className="text-center">
        <div className="flex items-center justify-center mb-6">
          <Film className="w-16 h-16 text-primary-500 mr-4" />
        </div>
        <h1 className="text-6xl font-bold text-dark-100 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-dark-300 mb-4">Page Not Found</h2>
        <p className="text-dark-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. Maybe you got lost on your way to the movies?
        </p>
        <Link
          to="/"
          className="btn-primary inline-flex items-center"
        >
          <Home className="w-4 h-4 mr-2" />
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;