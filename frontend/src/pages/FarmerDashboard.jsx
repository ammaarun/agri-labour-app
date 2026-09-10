import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PlusCircle, Users, CheckCircle, XCircle, Clock, MapPin, Calendar, DollarSign, AlertCircle, RefreshCw, Star, ClipboardCheck, FileSpreadsheet } from 'lucide-react';

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [jobs, setJobs] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Attendance & Rating Modals
  const [selectedJobForAttendance, setSelectedJobForAttendance] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    labourerProfileId: '',
    workDate: new Date().toISOString().split('T')[0],
    status: 'PRESENT',
    hoursWorked: 8,
    remarks: ''
  });

  const [selectedJobForSummary, setSelectedJobForSummary] = useState(null);
  const [wageSummary, setWageSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const [selectedWorkerForRating, setSelectedWorkerForRating] = useState(null);
  const [ratingData, setRatingData] = useState({
    ratingValue: 5,
    reviewText: ''
  });

  // Post Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    workType: 'Harvesting',
    description: '',
    numLabourersRequired: 5,
    requiredSkillIds: [],
    farmLocation: '',
    startDate: '',
    endDate: '',
    workingHours: 8,
    wageAmount: 600,
    wageBasis: 'DAILY',
    foodProvided: true,
    accommodationProvided: false,
  });

  const [actionRemark, setActionRemark] = useState('');

  useEffect(() => {
    fetchFarmerJobs();
    fetchSkills();
  }, [language]);

  const fetchFarmerJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/jobs/farmer/${user.userId}`);
      setJobs(res.data);
    } catch (err) {
      setError('Failed to fetch posted jobs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await api.get('/skills');
      setSkillsList(res.data);
    } catch (err) {
      console.error('Failed to fetch skills list');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/jobs/farmer/${user.userId}`, newJob);
      setShowPostModal(false);
      fetchFarmerJobs();
      setNewJob({
        title: '',
        workType: 'Harvesting',
        description: '',
        numLabourersRequired: 5,
        requiredSkillIds: [],
        farmLocation: '',
        startDate: '',
        endDate: '',
        workingHours: 8,
        wageAmount: 600,
        wageBasis: 'DAILY',
        foodProvided: true,
        accommodationProvided: false,
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to post job');
    }
  };

  const openApplicantsModal = async (job) => {
    setSelectedJobForApplicants(job);
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/applications/farmer/${user.userId}/job/${job.id}`);
      setApplicants(res.data);
    } catch (err) {
      alert('Failed to load applications for this job');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleUpdateApplicantStatus = async (applicationId, status) => {
    try {
      await api.patch(`/applications/farmer/${user.userId}/${applicationId}/status`, {
        status,
        remarks: actionRemark,
      });
      setActionRemark('');
      if (selectedJobForApplicants) {
        openApplicantsModal(selectedJobForApplicants);
      }
      fetchFarmerJobs();
    } catch (err) {
      alert('Failed to update application status');
    }
  };

  const handleLogAttendance = async (e) => {
    e.preventDefault();
    if (!attendanceData.labourerProfileId) {
      alert('Please select a worker');
      return;
    }
    try {
      await api.post(`/attendance/farmer/${user.userId}`, {
        jobId: selectedJobForAttendance.id,
        labourerProfileId: Number(attendanceData.labourerProfileId),
        workDate: attendanceData.workDate,
        status: attendanceData.status,
        hoursWorked: Number(attendanceData.hoursWorked),
        remarks: attendanceData.remarks
      });
      alert('Attendance logged successfully!');
      setSelectedJobForAttendance(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to log attendance');
    }
  };

  const openWageSummaryModal = async (job) => {
    setSelectedJobForSummary(job);
    setLoadingSummary(true);
    try {
      const res = await api.get(`/attendance/farmer/${user.userId}/job/${job.id}/summary`);
      setWageSummary(res.data);
    } catch (err) {
      alert('Failed to load wage summary report');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/ratings/${user.userId}`, {
        jobId: selectedWorkerForRating.jobId,
        revieweeUserId: selectedWorkerForRating.labourerUserId,
        ratingValue: Number(ratingData.ratingValue),
        reviewText: ratingData.reviewText
      });
      alert('Star rating & review submitted successfully!');
      setSelectedWorkerForRating(null);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit rating');
    }
  };

  const toggleSkillSelect = (skillId) => {
    setNewJob((prev) => {
      const skillIds = prev.requiredSkillIds.includes(skillId)
        ? prev.requiredSkillIds.filter((id) => id !== skillId)
        : [...prev.requiredSkillIds, skillId];
      return { ...prev, requiredSkillIds: skillIds };
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">{t('farmerDashboard')}</h1>
          <p className="text-slate-600 mt-1">Manage farm jobs, review applicants, track attendance, and rate workers.</p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-colors"
        >
          <PlusCircle className="h-5 w-5" />
          <span>{t('postJob')}</span>
        </button>
      </div>

      {/* Jobs List */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">{t('myJobs')}</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="h-8 w-8 text-emerald-600 animate-spin" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <p className="text-slate-500">You haven't posted any jobs yet.</p>
            <button
              onClick={() => setShowPostModal(true)}
              className="mt-4 inline-flex items-center space-x-2 text-emerald-600 font-bold hover:underline"
            >
              <span>{t('postJob')}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      job.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800' :
                      job.status === 'IN_PROGRESS' ? 'bg-amber-100 text-amber-800' :
                      job.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>{job.farmLocation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      <span>₹{job.wageAmount} / {job.wageBasis === 'DAILY' ? t('daily') : t('hourly')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-emerald-600" />
                      <span>{t('requiredWorkers')}: {job.numLabourersRequired}</span>
                    </div>
                  </div>

                  {/* Skills Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.requiredSkills.map((skill) => (
                      <span key={skill.id} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => openApplicantsModal(job)}
                    className="flex items-center justify-center space-x-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-xs font-medium"
                  >
                    <Users className="h-3.5 w-3.5" />
                    <span>{t('viewApplicants')}</span>
                  </button>

                  <button
                    onClick={async () => {
                      setSelectedJobForAttendance(job);
                      // Load accepted workers for dropdown
                      const res = await api.get(`/applications/farmer/${user.userId}/job/${job.id}`);
                      const acceptedList = res.data.filter(a => a.status === 'ACCEPTED');
                      setApplicants(acceptedList);
                    }}
                    className="flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg text-xs font-medium"
                  >
                    <ClipboardCheck className="h-3.5 w-3.5" />
                    <span>{t('markAttendance')}</span>
                  </button>

                  <button
                    onClick={() => openWageSummaryModal(job)}
                    className="flex items-center justify-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-medium"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <h2 className="text-2xl font-bold text-slate-900">{t('postJob')}</h2>

            <form onSubmit={handlePostJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="Need 5 workers for paddy harvesting"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('workType')}</label>
                  <input
                    type="text"
                    value={newJob.workType}
                    onChange={(e) => setNewJob({ ...newJob, workType: e.target.value })}
                    placeholder="Harvesting, Plowing, etc."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('requiredWorkers')} *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newJob.numLabourersRequired}
                    onChange={(e) => setNewJob({ ...newJob, numLabourersRequired: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('location')} *</label>
                <input
                  type="text"
                  required
                  value={newJob.farmLocation}
                  onChange={(e) => setNewJob({ ...newJob, farmLocation: e.target.value })}
                  placeholder="Guntur, Andhra Pradesh"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('startDate')} *</label>
                  <input
                    type="date"
                    required
                    value={newJob.startDate}
                    onChange={(e) => setNewJob({ ...newJob, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('endDate')} *</label>
                  <input
                    type="date"
                    required
                    value={newJob.endDate}
                    onChange={(e) => setNewJob({ ...newJob, endDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('wage')} (₹) *</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newJob.wageAmount}
                    onChange={(e) => setNewJob({ ...newJob, wageAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Wage Basis</label>
                  <select
                    value={newJob.wageBasis}
                    onChange={(e) => setNewJob({ ...newJob, wageBasis: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="DAILY">{t('daily')}</option>
                    <option value="HOURLY">{t('hourly')}</option>
                  </select>
                </div>
              </div>

              {/* Skills selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t('skills')}</label>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill) => (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSkillSelect(skill.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                        newJob.requiredSkillIds.includes(skill.id)
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-6 pt-2">
                <label className="flex items-center space-x-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={newJob.foodProvided}
                    onChange={(e) => setNewJob({ ...newJob, foodProvided: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{t('foodProvided')}</span>
                </label>

                <label className="flex items-center space-x-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={newJob.accommodationProvided}
                    onChange={(e) => setNewJob({ ...newJob, accommodationProvided: e.target.checked })}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{t('accommodationProvided')}</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('description')}</label>
                <textarea
                  rows={3}
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
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

      {/* View Applicants Modal */}
      {selectedJobForApplicants && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{t('viewApplicants')}</h2>
                <p className="text-sm text-slate-600">{selectedJobForApplicants.title}</p>
              </div>
              <button
                onClick={() => setSelectedJobForApplicants(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {loadingApplicants ? (
              <div className="py-8 text-center">Loading applicants...</div>
            ) : applicants.length === 0 ? (
              <div className="py-8 text-center text-slate-500">{t('noApplications')}</div>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {applicants.map((app) => (
                  <div key={app.id} className="border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-slate-900">{app.labourerName || 'Labourer Candidate'}</h4>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          Phone: {app.labourerPhoneNumber}
                        </span>
                      </div>

                      <div className="text-sm text-slate-600 mt-1 space-y-0.5">
                        <p>Experience: {app.labourerExperience} years | Location: {app.labourerLocation || 'N/A'}</p>
                        {app.remarks && <p className="italic text-slate-500">"{app.remarks}"</p>}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2 w-full md:w-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        app.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' :
                        app.status === 'CANCELLED' ? 'bg-slate-100 text-slate-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {app.status}
                      </span>

                      {app.status === 'PENDING' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleUpdateApplicantStatus(app.id, 'ACCEPTED')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold"
                          >
                            {t('accept')}
                          </button>
                          <button
                            onClick={() => handleUpdateApplicantStatus(app.id, 'REJECTED')}
                            className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold"
                          >
                            {t('reject')}
                          </button>
                        </div>
                      )}

                      {app.status === 'ACCEPTED' && (
                        <button
                          onClick={() => setSelectedWorkerForRating({
                            jobId: selectedJobForApplicants.id,
                            labourerUserId: app.labourerProfileId, // reviewee user id
                            labourerName: app.labourerName
                          })}
                          className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-bold text-xs bg-amber-50 px-2.5 py-1 rounded-md"
                        >
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>{t('rateWorker')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Log Attendance Modal */}
      {selectedJobForAttendance && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900">{t('logAttendance')}</h2>
            <p className="text-xs text-slate-500">{selectedJobForAttendance.title}</p>

            <form onSubmit={handleLogAttendance} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Accepted Worker *</label>
                <select
                  required
                  value={attendanceData.labourerProfileId}
                  onChange={(e) => setAttendanceData({ ...attendanceData, labourerProfileId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">-- Choose Worker --</option>
                  {applicants.map((app) => (
                    <option key={app.labourerProfileId} value={app.labourerProfileId}>
                      {app.labourerName} ({app.labourerPhoneNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('workDate')} *</label>
                  <input
                    type="date"
                    required
                    value={attendanceData.workDate}
                    onChange={(e) => setAttendanceData({ ...attendanceData, workDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
                  <select
                    value={attendanceData.status}
                    onChange={(e) => setAttendanceData({ ...attendanceData, status: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  >
                    <option value="PRESENT">{t('present')}</option>
                    <option value="HALF_DAY">{t('halfDay')}</option>
                    <option value="ABSENT">{t('absent')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('hoursWorked')}</label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={attendanceData.hoursWorked}
                  onChange={(e) => setAttendanceData({ ...attendanceData, hoursWorked: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('remarks')}</label>
                <input
                  type="text"
                  value={attendanceData.remarks}
                  onChange={(e) => setAttendanceData({ ...attendanceData, remarks: e.target.value })}
                  placeholder="Good work performance"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedJobForAttendance(null)}
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

      {/* Wage Summary Report Modal */}
      {selectedJobForSummary && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{t('wageSummary')}</h2>
                <p className="text-sm text-slate-600">{selectedJobForSummary.title}</p>
              </div>
              <button
                onClick={() => setSelectedJobForSummary(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {loadingSummary ? (
              <div className="py-8 text-center">Loading wage summary report...</div>
            ) : wageSummary && (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl text-center">
                  <div>
                    <span className="text-xs text-slate-500 block">{t('totalDaysPresent')}</span>
                    <span className="text-lg font-bold text-emerald-700">{wageSummary.totalDaysPresent}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">{t('totalDaysHalfDay')}</span>
                    <span className="text-lg font-bold text-amber-700">{wageSummary.totalDaysHalfDay}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block">{t('totalWages')}</span>
                    <span className="text-lg font-bold text-slate-900">₹{wageSummary.totalWageEarned}</span>
                  </div>
                </div>

                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                  <h4 className="font-bold text-slate-800 text-sm">Attendance Log Records</h4>
                  {wageSummary.attendanceRecords.length === 0 ? (
                    <p className="text-xs text-slate-500">No attendance logged yet.</p>
                  ) : (
                    wageSummary.attendanceRecords.map((record) => (
                      <div key={record.id} className="border p-3 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{record.labourerName}</span>
                          <p className="text-slate-500">{record.workDate} | {record.hoursWorked} hrs</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-700">₹{record.wageCalculated}</span>
                          <span className="block text-slate-500">{record.status}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rate Worker Star Rating Modal */}
      {selectedWorkerForRating && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-xl font-bold text-slate-900">{t('rateWorker')}</h2>
            <p className="text-sm text-slate-600">Rate performance for: <strong>{selectedWorkerForRating.labourerName}</strong></p>

            <form onSubmit={handleSubmitRating} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('ratingScore')}</label>
                <select
                  value={ratingData.ratingValue}
                  onChange={(e) => setRatingData({ ...ratingData, ratingValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
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
                  placeholder="Hardworking worker, arrived on time."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedWorkerForRating(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold"
                >
                  {t('submitRating')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default FarmerDashboard;
