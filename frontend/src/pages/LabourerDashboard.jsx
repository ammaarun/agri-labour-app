import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, MapPin, DollarSign, Briefcase, CheckCircle, Clock, AlertCircle, User, Edit3, Send, RefreshCw, Star, Calendar, FileText, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LabourerDashboard = () => {
  const { user, logoutUser } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'applications' | 'earnings'
  
  // Search state
  const [jobs, setJobs] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [minWage, setMinWage] = useState('');
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Applications state
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Earnings & Attendance state
  const [earningsSummary, setEarningsSummary] = useState(null);
  const [loadingEarnings, setLoadingEarnings] = useState(false);

  // Apply modal
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [applyRemarks, setApplyRemarks] = useState('');

  // Rating Modal
  const [selectedFarmerForRating, setSelectedFarmerForRating] = useState(null);
  const [ratingData, setRatingData] = useState({
    ratingValue: 5,
    reviewText: ''
  });

  // Profile State
  const [profile, setProfile] = useState(null);
  const [skillsList, setSkillsList] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    location: '',
    age: 25,
    gender: 'Male',
    yearsOfExperience: 2,
    expectedWage: 500,
    wageBasis: 'DAILY',
    availability: true,
    skillIds: [],
  });

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
    fetchProfile();
    fetchSkills();
    fetchEarningsSummary();
  }, [language]);

  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      let url = '/jobs/search?';
      if (searchLocation) url += `location=${encodeURIComponent(searchLocation)}&`;
      if (minWage) url += `minWage=${minWage}&`;
      const res = await api.get(url);
      setJobs(res.data);
    } catch (err) {
      console.error('Failed to search jobs');
    } finally {
      setLoadingJobs(false);
    }
  };

  const fetchMyApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.get(`/applications/labourer/${user.userId}`);
      setMyApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications');
    } finally {
      setLoadingApps(false);
    }
  };

  const fetchEarningsSummary = async () => {
    setLoadingEarnings(true);
    try {
      const res = await api.get(`/attendance/labourer/${user.userId}/summary`);
      setEarningsSummary(res.data);
    } catch (err) {
      console.error('Failed to load earnings summary');
    } finally {
      setLoadingEarnings(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await api.get(`/profiles/labourer/${user.userId}`);
      setProfile(res.data);
      setProfileForm({
        fullName: res.data.fullName || '',
        location: res.data.location || '',
        age: res.data.age || 25,
        gender: res.data.gender || 'Male',
        yearsOfExperience: res.data.yearsOfExperience || 0,
        expectedWage: res.data.expectedWage || 500,
        wageBasis: res.data.wageBasis || 'DAILY',
        availability: res.data.availability,
        skillIds: res.data.skills.map((s) => s.id),
      });
    } catch (err) {
      console.error('Failed to fetch profile');
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkillsList(res.data);
    } catch (err) {
      console.error('Failed to fetch skills');
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedJobForApply) return;

    try {
      await api.post(`/applications/labourer/${user.userId}`, {
        jobId: selectedJobForApply.id,
        remarks: applyRemarks,
      });
      alert('Application submitted successfully!');
      setSelectedJobForApply(null);
      setApplyRemarks('');
      fetchMyApplications();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit application.');
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/ratings/${user.userId}`, {
        jobId: selectedFarmerForRating.jobId,
        revieweeUserId: selectedFarmerForRating.farmerUserId,
        ratingValue: Number(ratingData.ratingValue),
        reviewText: ratingData.reviewText
      });
      alert('Star rating submitted for farmer successfully!');
      setSelectedFarmerForRating(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/profiles/labourer/${user.userId}`, profileForm);
      setShowProfileModal(false);
      fetchProfile();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to update profile');
    }
  };

  const toggleSkillSelect = (skillId) => {
    setProfileForm((prev) => {
      const skillIds = prev.skillIds.includes(skillId)
        ? prev.skillIds.filter((id) => id !== skillId)
        : [...prev.skillIds, skillId];
      return { ...prev, skillIds };
    });
  };

  const handleLogoutAndSwitch = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-extrabold text-slate-900">{t('labourerDashboard')}</h1>
            <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
              🛠️ Logged in as Labourer
            </span>
            {profile?.verified && (
              <span className="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                ✓ Verified Worker
              </span>
            )}
          </div>
          <p className="text-slate-600 mt-1">Find agricultural jobs, track daily attendance earnings, and rate employers.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleLogoutAndSwitch}
            className="flex items-center space-x-1 bg-slate-200 hover:bg-slate-300 text-slate-700 px-3.5 py-2 rounded-lg font-bold text-xs transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Switch Role / Logout</span>
          </button>

          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold transition-colors"
          >
            <User className="h-4 w-4" />
            <span>{t('editProfile')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('search')}
          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'search'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {t('searchJobs')}
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'applications'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {t('myApplications')} ({myApplications.length})
        </button>
        <button
          onClick={() => setActiveTab('earnings')}
          className={`pb-3 font-bold text-sm border-b-2 transition-colors ${
            activeTab === 'earnings'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          {t('attendance')}
        </button>
      </div>

      {/* Tab 1: Search & Filter */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Filters */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap sm:flex-nowrap gap-4 items-center shadow-sm">
            <div className="flex-1 min-w-[200px] relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder={t('location') + " (e.g. Guntur)"}
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-9 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="w-48 relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="number"
                placeholder="Min Wage (₹)"
                value={minWage}
                onChange={(e) => setMinWage(e.target.value)}
                className="pl-9 w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={fetchJobs}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center space-x-1 shadow"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </button>
          </div>

          {/* Job List */}
          {loadingJobs ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500 shadow-sm">
              {t('noJobsFound')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                      <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold">
                        {job.wageAmount} ₹ / {job.wageBasis === 'DAILY' ? t('daily') : t('hourly')}
                      </span>
                    </div>

                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                    <div className="space-y-1.5 text-sm text-slate-600 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-emerald-600" />
                        <span>{job.farmLocation}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-emerald-600" />
                        <span>Farmer: {job.farmerName || 'Farm Owner'}</span>
                      </div>
                    </div>

                    {/* Localized Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {job.requiredSkills.map((skill) => (
                        <span key={skill.id} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-semibold">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedJobForApply(job)}
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-bold shadow transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      <span>{t('apply')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: My Applications */}
      {activeTab === 'applications' && (
        <div>
          {loadingApps ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
            </div>
          ) : myApplications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500 shadow-sm">
              {t('noApplications')}
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map((app) => (
                <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                    <p className="text-sm text-slate-600">{app.farmLocation} • ₹{app.wageAmount} / {app.wageBasis}</p>
                    <p className="text-xs text-slate-500 mt-1">Farmer: {app.farmerName} ({app.farmerContact})</p>
                    {app.remarks && <p className="text-xs text-slate-500 italic">Farmer Note: "{app.remarks}"</p>}
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      app.status === 'CANCELLED' ? 'bg-slate-100 text-slate-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status === 'ACCEPTED' ? t('accepted') :
                       app.status === 'REJECTED' ? t('rejected') :
                       app.status === 'CANCELLED' ? t('cancelled') : t('pending')}
                    </span>

                    {app.status === 'ACCEPTED' && (
                      <button
                        onClick={() => setSelectedFarmerForRating({
                          jobId: app.jobId,
                          farmerUserId: app.farmerId,
                          farmerName: app.farmerName
                        })}
                        className="flex items-center space-x-1 text-amber-800 hover:text-amber-900 font-bold text-xs bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg shadow-sm"
                      >
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{t('rateFarmer')}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Attendance & Total Earnings */}
      {activeTab === 'earnings' && (
        <div className="space-y-6">
          {loadingEarnings ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
            </div>
          ) : earningsSummary && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="text-sm font-medium text-slate-500 block">{t('totalEarnings')}</span>
                  <h3 className="text-3xl font-extrabold text-emerald-700 mt-1">₹{earningsSummary.totalWageEarned}</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="text-sm font-medium text-slate-500 block">{t('totalDaysPresent')}</span>
                  <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{earningsSummary.totalDaysPresent} Days</h3>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                  <span className="text-sm font-medium text-slate-500 block">{t('hoursWorked')}</span>
                  <h3 className="text-3xl font-extrabold text-blue-700 mt-1">{earningsSummary.totalHoursWorked} Hours</h3>
                </div>
              </div>

              {/* Attendance Log Table */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Attendance & Calculated Wage History</h3>
                {earningsSummary.attendanceRecords.length === 0 ? (
                  <p className="text-slate-500 text-center py-8">No attendance records found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b">
                          <th className="p-3">Job Title</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Hours</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Earned Wage</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {earningsSummary.attendanceRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-slate-50">
                            <td className="p-3 font-bold text-slate-900">{record.jobTitle}</td>
                            <td className="p-3 text-slate-600">{record.workDate}</td>
                            <td className="p-3 text-slate-600">{record.hoursWorked} hrs</td>
                            <td className="p-3">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                record.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' :
                                record.status === 'HALF_DAY' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {record.status}
                              </span>
                            </td>
                            <td className="p-3 text-right font-bold text-emerald-700">₹{record.wageCalculated}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full my-auto max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50 flex-shrink-0">
              <h3 className="text-xl font-bold text-slate-900">{t('apply')}</h3>
              <button onClick={() => setSelectedJobForApply(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4 overflow-y-auto flex-1">
              <p className="text-sm font-semibold text-slate-700">{selectedJobForApply.title}</p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('remarks')}</label>
                <textarea
                  rows={3}
                  value={applyRemarks}
                  onChange={(e) => setApplyRemarks(e.target.value)}
                  placeholder="I am available for all work days with relevant harvesting experience..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 border-t flex justify-end space-x-3 flex-shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setSelectedJobForApply(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-extrabold shadow-md"
                >
                  {t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rate Farmer Modal */}
      {selectedFarmerForRating && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-md w-full my-auto max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50 flex-shrink-0">
              <h3 className="text-xl font-bold text-slate-900">{t('rateFarmer')}</h3>
              <button onClick={() => setSelectedFarmerForRating(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitRating} className="p-6 space-y-4 overflow-y-auto flex-1">
              <p className="text-sm text-slate-600">Rate employer: <strong>{selectedFarmerForRating.farmerName}</strong></p>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('ratingScore')}</label>
                <select
                  value={ratingData.ratingValue}
                  onChange={(e) => setRatingData({ ...ratingData, ratingValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Below Average)</option>
                  <option value={1}>⭐ (1 - Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('reviewText')}</label>
                <textarea
                  rows={3}
                  value={ratingData.reviewText}
                  onChange={(e) => setRatingData({ ...ratingData, reviewText: e.target.value })}
                  placeholder="Fair wages paid on time, good working environment."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 border-t flex justify-end space-x-3 flex-shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setSelectedFarmerForRating(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-extrabold shadow-md"
                >
                  {t('submitRating')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full my-auto max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
            <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50 flex-shrink-0">
              <h3 className="text-xl font-bold text-slate-900">{t('editProfile')}</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('location')} *</label>
                <input
                  type="text"
                  required
                  value={profileForm.location}
                  onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('age')}</label>
                  <input
                    type="number"
                    value={profileForm.age}
                    onChange={(e) => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('experience')}</label>
                  <input
                    type="number"
                    value={profileForm.yearsOfExperience}
                    onChange={(e) => setProfileForm({ ...profileForm, yearsOfExperience: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('skills')}</label>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkillSelect(skill.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        profileForm.skillIds.includes(skill.id)
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 bg-white pt-4 border-t flex justify-end space-x-3 flex-shrink-0 z-10">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-extrabold shadow-md"
                >
                  {t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default LabourerDashboard;
