import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Search, MapPin, DollarSign, Briefcase, CheckCircle, Clock, AlertCircle, User, Edit3, Send, RefreshCw } from 'lucide-react';

const LabourerDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'applications' | 'profile'
  
  // Search state
  const [jobs, setJobs] = useState([]);
  const [searchLocation, setSearchLocation] = useState('');
  const [minWage, setMinWage] = useState('');
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Applications state
  const [myApplications, setMyApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);

  // Apply modal
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);
  const [applyRemarks, setApplyRemarks] = useState('');

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{t('labourerDashboard')}</h1>
          <p className="text-slate-600 mt-1">Find agricultural jobs matching your skills and location.</p>
        </div>
        <button
          onClick={() => setShowProfileModal(true)}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-bold transition-colors"
        >
          <User className="h-4 w-4" />
          <span>{t('editProfile')}</span>
        </button>
      </div>

      {/* Tabs */}
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center space-x-1"
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
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500">
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
                      className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-bold transition-colors"
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
            <div className="bg-white rounded-xl p-8 text-center border border-slate-200 text-slate-500">
              {t('noApplications')}
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map((app) => (
                <div key={app.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{app.jobTitle}</h3>
                    <p className="text-sm text-slate-600">{app.farmLocation} • ₹{app.wageAmount} / {app.wageBasis}</p>
                    {app.remarks && <p className="text-xs text-slate-500 mt-1 italic">Farmer Note: "{app.remarks}"</p>}
                  </div>

                  <div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                      app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                      app.status === 'CANCELLED' ? 'bg-slate-100 text-slate-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {app.status === 'ACCEPTED' ? t('accepted') :
                       app.status === 'REJECTED' ? t('rejected') :
                       app.status === 'CANCELLED' ? t('cancelled') : t('pending')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Apply Modal */}
      {selectedJobForApply && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">{t('apply')}</h3>
            <p className="text-sm text-slate-600">{selectedJobForApply.title}</p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('remarks')}</label>
                <textarea
                  rows={3}
                  value={applyRemarks}
                  onChange={(e) => setApplyRemarks(e.target.value)}
                  placeholder="I am available for all 4 days with experience in harvesting..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobForApply(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold"
                >
                  {t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl my-8">
            <h3 className="text-xl font-bold text-slate-900">{t('editProfile')}</h3>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
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

              <div className="flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold"
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
