import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import { Users, Briefcase, FileText, DollarSign, CheckCircle, XCircle, ShieldCheck, UserX, UserCheck, RefreshCw, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const { t } = useLanguage();

  const [analytics, setAnalytics] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [roleFilter, setRoleFilter] = useState('');
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
  }, [roleFilter]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data);
    } catch (err) {
      setError('Failed to load system analytics.');
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const url = roleFilter ? `/admin/users?role=${roleFilter}` : '/admin/users';
      const res = await api.get(url);
      setUsersList(res.data);
    } catch (err) {
      console.error('Failed to fetch user management list');
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleVerify = async (labourerUserId, currentStatus) => {
    try {
      await api.patch(`/admin/labourer/${labourerUserId}/verify?isVerified=${!currentStatus}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to update verification status');
    }
  };

  const handleToggleUserStatus = async (userId, currentEnabled) => {
    try {
      await api.patch(`/admin/users/${userId}/status?enabled=${!currentEnabled}`);
      fetchUsers();
      fetchAnalytics();
    } catch (err) {
      alert('Failed to toggle user account status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Title Header */}
      <div className="border-b border-slate-200 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{t('adminDashboard')}</h1>
          <p className="text-slate-600 mt-1">Platform metrics overview, worker profile verification, and system moderation.</p>
        </div>
        <button
          onClick={() => { fetchAnalytics(); fetchUsers(); }}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl flex items-center space-x-3 border border-rose-200">
          <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Analytics Metric Cards */}
      {loadingAnalytics ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
        </div>
      ) : analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t('totalUsers')}</p>
              <h3 className="text-2xl font-bold text-slate-900">{analytics.totalUsers}</h3>
              <p className="text-xs text-slate-600">{analytics.totalFarmers} Farmers | {analytics.totalLabourers} Labourers</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 text-blue-800 rounded-lg">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t('totalJobs')}</p>
              <h3 className="text-2xl font-bold text-slate-900">{analytics.totalJobs}</h3>
              <p className="text-xs text-slate-600">{analytics.openJobs} Open | {analytics.inProgressJobs} Active</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-800 rounded-lg">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t('totalApplications')}</p>
              <h3 className="text-2xl font-bold text-slate-900">{analytics.totalApplications}</h3>
              <p className="text-xs text-slate-600">{analytics.acceptedApplications} Accepted Applications</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-4">
            <div className="p-3 bg-indigo-100 text-indigo-800 rounded-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{t('totalWages')}</p>
              <h3 className="text-2xl font-bold text-slate-900">₹{analytics.totalWagesCalculated || 0}</h3>
              <p className="text-xs text-slate-600">Calculated across system</p>
            </div>
          </div>
        </div>
      )}

      {/* User Management & Moderation Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t('userManagement')}</h2>
            <p className="text-sm text-slate-600">Verify worker identity profiles and moderate active accounts.</p>
          </div>

          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-slate-700">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Roles</option>
              <option value="LABOURER">Labourers Only</option>
              <option value="FARMER">Farmers Only</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loadingUsers ? (
          <div className="py-8 text-center">Loading user records...</div>
        ) : usersList.length === 0 ? (
          <div className="py-8 text-center text-slate-500">No user accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-semibold border-b">
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Verification</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((user) => (
                  <tr key={user.userId} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{user.fullName}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.role === 'FARMER' ? 'bg-amber-100 text-amber-800' :
                        user.role === 'LABOURER' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">{user.phoneNumber}</td>
                    <td className="p-3 text-slate-600">{user.location || 'N/A'}</td>
                    <td className="p-3">
                      {user.role === 'LABOURER' ? (
                        user.isVerified ? (
                          <span className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            <span>{t('verified')}</span>
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                            {t('unverified')}
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      {user.enabled ? (
                        <span className="text-emerald-700 font-bold text-xs">Active</span>
                      ) : (
                        <span className="text-rose-700 font-bold text-xs">Disabled</span>
                      )}
                    </td>
                    <td className="p-3 text-right space-x-2">
                      {/* Verify Labourer Profile button */}
                      {user.role === 'LABOURER' && (
                        <button
                          onClick={() => handleToggleVerify(user.userId, user.isVerified)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-colors ${
                            user.isVerified
                              ? 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          {user.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                      )}

                      {/* Enable/Disable Account toggle button */}
                      <button
                        onClick={() => handleToggleUserStatus(user.userId, user.enabled)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg font-bold transition-colors ${
                          user.enabled
                            ? 'bg-rose-100 hover:bg-rose-200 text-rose-800'
                            : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                        }`}
                      >
                        {user.enabled ? t('disableUser') : t('enableUser')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
