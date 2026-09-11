import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Phone, Mail, Lock, UserCheck, AlertCircle } from 'lucide-react';

const Register = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('LABOURER');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        phoneNumber,
        email: email ? email : null,
        password,
        role,
      });

      loginUser(response.data);

      if (response.data.role === 'ADMIN') {
        navigate('/admin');
      } else if (response.data.role === 'FARMER') {
        navigate('/farmer');
      } else {
        navigate('/labourer');
      }
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data) {
        const firstErrKey = Object.keys(err.response.data)[0];
        setError(err.response.data[firstErrKey]);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-emerald-900">
            {t('register')}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Create an account on {t('appTitle')}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg flex items-center space-x-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Role Toggle */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t('role')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('LABOURER')}
                  className={`py-2.5 px-2 rounded-lg font-bold text-xs border flex items-center justify-center space-x-1 transition-all ${
                    role === 'LABOURER'
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-2 ring-emerald-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>{t('labourer')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('FARMER')}
                  className={`py-2.5 px-2 rounded-lg font-bold text-xs border flex items-center justify-center space-x-1 transition-all ${
                    role === 'FARMER'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 ring-2 ring-amber-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>{t('farmer')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`py-2.5 px-2 rounded-lg font-bold text-xs border flex items-center justify-center space-x-1 transition-all ${
                    role === 'ADMIN'
                      ? 'bg-slate-900 border-slate-900 text-white ring-2 ring-slate-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>{t('admin')}</span>
                </button>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('phoneNumber')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="9876543210"
                  className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t('password')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900"
                />
              </div>
            </div>

          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : t('register')}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            {t('login')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
