import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  English: {
    appName: "Sehatam",
    tagline: "Your Health, Your Language",
    startCheck: "Start Symptom Check",
    uploadPhoto: "Upload a Photo",
    describeSymptom: "Describe your symptom in your own words",
    checkNow: "Check Now",
    urgencyLow: "Home Care",
    urgencyMedium: "Visit Doctor Soon",
    urgencyHigh: "Go to Hospital Immediately",
    possibleConditions: "Possible Conditions",
    homeRemedy: "What you can do at home",
    nearbyHospitals: "Nearby Hospitals",
    findHospitals: "Find Hospitals Near Me",
    saveHistory: "Save to My History",
    saved: "Saved successfully",
    login: "Login",
    logout: "Logout",
    history: "My Health History",
    noHistory: "No health checks saved yet",
    back: "Go Back",
    newCheck: "Start New Check",
    loading: "Analyzing your symptoms...",
    error: "Something went wrong. Please try again.",
    disclaimer: "This is AI analysis only. Always consult a real doctor for medical advice.",
    noAccount: "No account needed to check symptoms",
    loginToSave: "Login to save your health history",
    characterCount: "characters remaining",
    fileTooLarge: "Image too large. Please upload under 5MB.",
    locationDenied: "Location access denied. Please enable location in your browser.",
    fetchingHospitals: "Finding hospitals near you...",
    home: "Home",
    symptoms: "Symptoms",
    results: "Results",
    clinics: "Clinics",
    resultsTitle: "Analysis Results",
    done: "Done",
    viewDetails: "View Details",
    disclaimerTitle: "Disclaimer"
  },
  Tamil: {
    appName: "Sehatam",
    tagline: "உங்கள் ஆரோக்கியம், உங்கள் மொழி",
    startCheck: "அறிகுறி பரிசோதனை தொடங்கு",
    uploadPhoto: "படம் பதிவேற்றவும்",
    describeSymptom: "உங்கள் அறிகுறியை உங்கள் சொந்த வார்த்தைகளில் விவரிக்கவும்",
    checkNow: "இப்போது சரிபார்க்கவும்",
    urgencyLow: "வீட்டு சிகிச்சை",
    urgencyMedium: "விரைவில் மருத்துவரை சந்திக்கவும்",
    urgencyHigh: "உடனே மருத்துவமனை செல்லுங்கள்",
    possibleConditions: "சாத்தியமான நோய்கள்",
    homeRemedy: "வீட்டில் செய்யக்கூடியவை",
    nearbyHospitals: "அருகிலுள்ள மருத்துவமனைகள்",
    findHospitals: "மருத்துவமனைகளை கண்டறி",
    saveHistory: "என் வரலாற்றில் சேமி",
    saved: "சேமிக்கப்பட்டது",
    login: "உள்நுழைய",
    logout: "வெளியேறு",
    history: "என் சுகாதார வரலாறு",
    noHistory: "இன்னும் எந்த பரிசோதனையும் சேமிக்கப்படவில்லை",
    back: "திரும்பு",
    newCheck: "புதிய பரிசோதனை தொடங்கு",
    loading: "உங்கள் அறிகுறிகளை பகுப்பாய்வு செய்கிறது...",
    error: "பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    disclaimer: "இது AI பகுப்பாய்வு மட்டுமே. மருத்துவ ஆலோசனைக்கு எப்போதும் மருத்துவரை சந்திக்கவும்.",
    noAccount: "அறிகுறிகளை சரிபார்க்க கணக்கு தேவையில்லை",
    loginToSave: "உங்கள் சுகாதார வரலாற்றை சேமிக்க உள்நுழையவும்",
    characterCount: "எழுத்துகள் மீதமுள்ளன",
    fileTooLarge: "படம் மிகவும் பெரியது. 5MB க்கும் குறைவாக பதிவேற்றவும்.",
    locationDenied: "இட அனுமதி மறுக்கப்பட்டது. உலாவியில் இடத்தை இயக்கவும்.",
    fetchingHospitals: "அருகிலுள்ள மருத்துவமனைகளை கண்டறிகிறது...",
    home: "முகப்பு",
    symptoms: "அறிகுறிகள்",
    results: "முடிவுகள்",
    clinics: "கிளினிக்குகள்",
    resultsTitle: "பகுப்பாய்வு முடிவுகள்",
    done: "முடிந்தது",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    disclaimerTitle: "பொறுப்புத் துறப்பு"
  },
  Hindi: {
    appName: "Sehatam",
    tagline: "आपका स्वास्थ्य, आपकी भाषा",
    startCheck: "लक्षण जांच शुरू करें",
    uploadPhoto: "फोटो अपलोड करें",
    describeSymptom: "अपना लक्षण अपने शब्दों में बताएं",
    checkNow: "अभी जांचें",
    urgencyLow: "घर पर इलाज",
    urgencyMedium: "जल्द डॉक्टर से मिलें",
    urgencyHigh: "तुरंत अस्पताल जाएं",
    possibleConditions: "संभावित बीमारियां",
    homeRemedy: "घर पर क्या करें",
    nearbyHospitals: "नजदीकी अस्पताल",
    findHospitals: "नजदीकी अस्पताल खोजें",
    saveHistory: "मेरे इतिहास में सेव करें",
    saved: "सफलतापूर्वक सेव किया",
    login: "लॉगिन",
    logout: "लॉगआउट",
    history: "मेरा स्वास्थ्य इतिहास",
    noHistory: "अभी तक कोई जांच सेव नहीं हुई",
    back: "वापस जाएं",
    newCheck: "नई जांच शुरू करें",
    loading: "आपके लक्षणों का विश्लेषण हो रहा है...",
    error: "कुछ गलत हुआ। फिर कोशिश करें।" ,
    disclaimer: "यह केवल AI विश्लेषण है। चिकित्सा सलाह के लिए हमेशा डॉक्टर से मिलें।",
    noAccount: "लक्षण जांचने के लिए खाते की जरूरत नहीं",
    loginToSave: "स्वास्थ्य इतिहास सेव करने के लिए लॉगिन करें",
    characterCount: "अक्षर शेष",
    fileTooLarge: "छवि बहुत बड़ी है। 5MB से कम अपलोड करें।",
    locationDenied: "स्थान की अनुमति नहीं मिली। ब्राउज़र में स्थान सक्षम करें।",
    fetchingHospitals: "नजदीकी अस्पताल खोजे जा रहे हैं...",
    home: "होम",
    symptoms: "लक्षण",
    results: "परिणाम",
    clinics: "क्लीनिक",
    resultsTitle: "विश्लेषण परिणाम",
    done: "हो गया",
    viewDetails: "विवरण देखें",
    disclaimerTitle: "अस्वीकरण"
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const savedLang = localStorage.getItem('sehatam_lang');
    return savedLang && translations[savedLang] ? savedLang : 'English';
  });

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      localStorage.setItem('sehatam_lang', lang);
    }
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
