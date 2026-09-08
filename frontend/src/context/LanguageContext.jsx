import React, { createContext, useContext, useState, useEffect } from 'react';

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
    age: "Age",
    experience: "Experience (Years)",
    expectedWage: "Expected Wage",
    noJobsFound: "No jobs found matching your search criteria.",
    noApplications: "No applications found."
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
    role: "పా పాత్రను ఎంచుకోండి",
    labourer: "వ్యవసాయ కూలీ",
    farmer: "రైతు / యజమాని",
    age: "వయస్సు",
    experience: "అనుభవం (సంవత్సరాలలో)",
    expectedWage: "ఆశిస్తున్న కూలీ రేటు",
    noJobsFound: "మీరు వెతికిన వివరాలకు సరిపోలే పనులు ఏవీ లేవు.",
    noApplications: "దరఖాస్తులు ఏవీ లేవు."
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
