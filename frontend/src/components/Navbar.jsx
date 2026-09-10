import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Globe, LogOut, User, ShieldCheck } from 'lucide-react';

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-emerald-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold tracking-wide">
            <Sprout className="h-8 w-8 text-amber-300" />
            <span>{t('appTitle')}</span>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Language Switcher */}
            <div className="flex items-center space-x-1 bg-emerald-800 rounded-lg p-1 text-sm font-medium">
              <Globe className="h-4 w-4 text-emerald-200 ml-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-emerald-500 text-white font-bold' : 'text-emerald-200 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2 py-1 rounded transition-colors ${
                  language === 'te' ? 'bg-emerald-500 text-white font-bold' : 'text-emerald-200 hover:text-white'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Authenticated Links */}
            {user ? (
              <div className="flex items-center space-x-3">
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                  >
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>{t('adminDashboard')}</span>
                  </Link>
                )}

                <span className="bg-amber-400 text-emerald-950 px-2.5 py-1 rounded-full text-xs font-bold uppercase">
                  {user.role === 'FARMER' ? t('farmer') :
                   user.role === 'ADMIN' ? t('admin') : t('labourer')}
                </span>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('logout')}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="hover:bg-emerald-600 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="bg-amber-400 hover:bg-amber-500 text-emerald-950 px-3 py-1.5 rounded-md text-sm font-bold transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
