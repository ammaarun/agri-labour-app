import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    appTitle: "AgriLabour Marketplace",
    home: "Home",
    login: "Login",
    register: "Register",
    logout: "Logout",
    language: "Language",
    farmerDashboard: "Farmer Dashboard",
    labourerDashboard: "Labourer Dashboard",
    adminDashboard: "Admin Dashboard",
    postJob: "Post a New Job",
    myJobs: "My Posted Jobs",
    searchJobs: "Search Available Jobs",
    myApplications: "My Applications",
    profile: "My Profile",
    editProfile: "Edit Profile",
    apply: "Apply for Job",
    accepted: "Accepted",
    rejected: "Rejected",
    pending: "Pending",
    cancelled: "Cancelled",
    open: "Open",
    inProgress: "In Progress",
    completed: "Completed",
    wage: "Wage",
    daily: "Daily",
    hourly: "Hourly",
    requiredWorkers: "Workers Needed",
    location: "Location",
    workType: "Work Type",
    description: "Description",
    skills: "Required Skills",
    startDate: "Start Date",
    endDate: "End Date",
    foodProvided: "Food Provided",
    accommodationProvided: "Accommodation Provided",
    viewApplicants: "View Applicants",
    accept: "Accept",
    reject: "Reject",
    remarks: "Remarks / Message",
    submit: "Submit",
    cancel: "Cancel",
    phoneNumber: "Phone Number",
    password: "Password",
    role: "Select Role",
    labourer: "Labourer / Worker",
    farmer: "Farmer / Employer",
    admin: "System Admin",
    age: "Age",
    experience: "Experience (Years)",
    expectedWage: "Expected Wage",
    noJobsFound: "No jobs found matching your search criteria.",
    noApplications: "No applications found.",
    
    // Attendance & Wages
    attendance: "Attendance & Wages",
    markAttendance: "Mark Attendance",
    logAttendance: "Log Daily Attendance",
    wageSummary: "Wage Summary Report",
    workDate: "Work Date",
    hoursWorked: "Hours Worked",
    present: "Present",
    halfDay: "Half Day",
    absent: "Absent",
    wageCalculated: "Wage Calculated",
    totalWages: "Total Wages Disbursed",
    totalEarnings: "Total Earnings",
    totalDaysPresent: "Total Days Present",
    totalDaysHalfDay: "Total Days Half-Day",
    totalDaysAbsent: "Total Days Absent",
    
    // Ratings & Reviews
    ratings: "Ratings & Reviews",
    rateWorker: "Rate Worker",
    rateFarmer: "Rate Farmer",
    submitRating: "Submit Star Rating",
    ratingScore: "Rating Score (1-5)",
    reviewText: "Review / Feedback Comment",
    averageRating: "Average Rating",
    totalReviews: "Total Reviews",
    
    // Admin Dashboard & Moderation
    totalUsers: "Total Users",
    totalFarmers: "Total Farmers",
    totalLabourers: "Total Labourers",
    totalJobs: "Total Job Postings",
    totalApplications: "Total Job Applications",
    verifyProfile: "Verify Profile",
    verified: "Verified",
    unverified: "Unverified",
    enableUser: "Enable Account",
    disableUser: "Disable Account",
    moderateJob: "Moderate Job Status",
    userManagement: "User Account Moderation",
    jobModeration: "Job Posting Moderation"
  },
  te: {
    appTitle: "వ్యవసాయ కార్మికుల మార్కెట్ ప్లాట్‌ఫారమ్",
    home: "హోమ్",
    login: "లాగిన్",
    register: "రిజిస్టర్",
    logout: "లాగ్ అవుట్",
    language: "భాష",
    farmerDashboard: "రైతు డాష్‌బోర్డ్",
    labourerDashboard: "కూలీ డాష్‌బోర్డ్",
    adminDashboard: "అడ్మిన్ డాష్‌బోర్డ్",
    postJob: "కొత్త పనిని నమోదు చేయండి",
    myJobs: "నేను ఇచ్చిన పనులు",
    searchJobs: "అందుబాటులో ఉన్న పనుల కోసం వెతకండి",
    myApplications: "నా దరఖాస్తులు",
    profile: "నా వివరాలు",
    editProfile: "వివరాలను సవరించు",
    apply: "పనికి దరఖాస్తు చేయండి",
    accepted: "అంగీకరించబడింది",
    rejected: "తిరస్కరించబడింది",
    pending: "పరిశీలనలో ఉంది",
    cancelled: "రద్దు చేయబడింది",
    open: "తెరిచి ఉంది",
    inProgress: "పని జరుగుతోంది",
    completed: "పూర్తయింది",
    wage: "కూలీ రేటు",
    daily: "రోజువారీ",
    hourly: "గంటల ప్రాతిపదికన",
    requiredWorkers: "కావలసిన కూలీల సంఖ్య",
    location: "ప్రాంతం",
    workType: "పని రకం",
    description: "పని వివరాలు",
    skills: "కావలసిన నైపుణ్యాలు",
    startDate: "ప్రారంభ తేదీ",
    endDate: "ముగింపు తేదీ",
    foodProvided: "భోజన సౌకర్యం",
    accommodationProvided: "వసతి సౌకర్యం",
    viewApplicants: "దరఖాస్తుదారులను చూడండి",
    accept: "అంగీకరించు",
    reject: "తిరస్కరించు",
    remarks: "వ్యాఖ్యలు / సందేశం",
    submit: "సమర్పించు",
    cancel: "రద్దు చేయి",
    phoneNumber: "ఫోన్ నంబర్",
    password: "పాస్‌వర్డ్",
    role: "పాత్రను ఎంచుకోండి",
    labourer: "వ్యవసాయ కూలీ",
    farmer: "రైతు / యజమాని",
    admin: "వ్యవస్థ నిర్వాహకుడు (అడ్మిన్)",
    age: "వయస్సు",
    experience: "అనుభవం (సంవత్సరాలలో)",
    expectedWage: "ఆశిస్తున్న కూలీ రేటు",
    noJobsFound: "మీరు వెతికిన వివరాలకు సరిపోలే పనులు ఏవీ లేవు.",
    noApplications: "దరఖాస్తులు ఏవీ లేవు.",

    // Attendance & Wages
    attendance: "హాజరు మరియు కూలీ లెక్కలు",
    markAttendance: "హాజరును నమోదు చేయండి",
    logAttendance: "రోజువారీ హాజరు నమోదు",
    wageSummary: "కూలీ నివేదిక నివేదిక",
    workDate: "పని చేసిన తేదీ",
    hoursWorked: "పని చేసిన గంటలు",
    present: "హాజరు (Present)",
    halfDay: "అర రోజూ (Half Day)",
    absent: "గైర్హాజరు (Absent)",
    wageCalculated: "లెక్కింపబడిన కూలీ",
    totalWages: "మొత్తం పంపిణీ చేసిన కూలీ",
    totalEarnings: "మొత్తం సంపాదన",
    totalDaysPresent: "హాజరైన రోజులు",
    totalDaysHalfDay: "అర రోజులు",
    totalDaysAbsent: "గైర్హాజరైన రోజులు",

    // Ratings & Reviews
    ratings: "రేటింగ్‌లు & సమీక్షలు",
    rateWorker: "కార్మికుడికి రేటింగ్ ఇవ్వండి",
    rateFarmer: "రైతుకి రేటింగ్ ఇవ్వండి",
    submitRating: "నక్షత్ర రేటింగ్‌ను సమర్పించండి",
    ratingScore: "రేటింగ్ స్కోరు (1-5)",
    reviewText: "అభిప్రాయం / సమీక్ష వ్యాఖ్య",
    averageRating: "సగటు రేటింగ్",
    totalReviews: "మొత్తం సమీక్షలు",

    // Admin Dashboard & Moderation
    totalUsers: "మొత్తం వినియోగదారులు",
    totalFarmers: "మొత్తం రైతులు",
    totalLabourers: "మొత్తం కూలీలు",
    totalJobs: "మొత్తం పని ప్రకటనలు",
    totalApplications: "మొత్తం దరఖాస్తులు",
    verifyProfile: "ప్రొఫైల్‌ను ధృవీకరించు",
    verified: "ధృవీకరించబడింది",
    unverified: "ధృవీకరించబడలేదు",
    enableUser: "ఖాతాను ప్రారంభించు",
    disableUser: "ఖాతాను నిలిపివేయి",
    moderateJob: "పని స్థితిని నిర్వహించు",
    userManagement: "వినియోగదారుల నిర్వహణ",
    jobModeration: "పని ప్రకటనల నిర్వహణ"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  const setLanguage = (lang) => {
    localStorage.setItem('language', lang);
    setLanguageState(lang);
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
