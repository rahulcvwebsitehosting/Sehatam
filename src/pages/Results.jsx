import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { saveHealthRecord } from '../services/firebase';

const Results = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [savedState, setSavedState] = useState(false);

  if (!state || !state.result) {
    return (
      <div className="max-w-[480px] mx-auto px-[24px] py-[80px] bg-surface dark:bg-stone-950 min-h-screen flex flex-col items-center justify-center text-center khadi-texture">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-4xl">assignment_late</span>
        </div>
        <h2 className="text-2xl font-black text-on-surface mb-2 font-headline">No Recent Results</h2>
        <p className="text-on-surface-variant mb-8 max-w-[280px]">
          You haven't completed a symptom check yet. Start one now to see your results here.
        </p>
        <button
          onClick={() => navigate('/check')}
          className="bg-primary text-on-primary px-8 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          Start Symptom Check
        </button>
      </div>
    );
  }

  const result = state.result;
  const language = state.language;

  const normalizedResult = {
    ...result,
    possibleConditions: Array.isArray(result.possibleConditions)
      ? result.possibleConditions.map(c =>
          typeof c === 'string' ? { name: c, probability: null } : c
        )
      : [],
    doctorTests: result.doctorTests || [],
    predictedMedications: result.predictedMedications || [],
  };

  if (result.error || !result.possibleConditions) {
    return (
      <div className="px-[24px] py-[48px] bg-white text-center">
        <p className="text-error mb-[16px] font-bold">{t.error}</p>
        <button
          onClick={() => navigate('/check')}
          className="text-primary font-bold bg-transparent border-none cursor-pointer"
        >
          ← {t.back}
        </button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!user) return;
    try {
      await saveHealthRecord(user.uid, {
        symptoms: state.symptoms,
        imageUsed: state.source === "image",
        possibleConditions: result.possibleConditions,
        urgency: result.urgency,
        description: result.description,
        homeRemedy: result.homeRemedy,
        language: language
      });
      setSavedState(true);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleFindHospitals = () => {
    navigate('/clinics');
  };

  const getUrgencyStyles = () => {
    if (result.urgency === "HOME_CARE") {
      return { 
        bg: "bg-secondary/10", 
        color: "text-secondary", 
        text: t.urgencyLow,
        icon: "check_circle"
      };
    }
    if (result.urgency === "VISIT_SOON") {
      return { 
        bg: "bg-primary/10", 
        color: "text-primary", 
        text: t.urgencyMedium,
        icon: "warning"
      };
    }
    if (result.urgency === "EMERGENCY") {
      return { 
        bg: "bg-error/10", 
        color: "text-error", 
        text: t.urgencyHigh,
        icon: "emergency"
      };
    }
    return { bg: "bg-surface-container-high", color: "text-on-surface", text: "", icon: "info" };
  };

  const urgency = getUrgencyStyles();

  const medIcons = {
    'Tablet': 'medication',
    'Syrup': 'water_drop',
    'Injection': 'vaccines',
    'IV Drip': 'iv_bag',
    'Ointment': 'back_hand',
    'Inhaler': 'air',
    'Drops': 'opacity',
    'Patch': 'healing',
  };

  return (
    <div className="max-w-[480px] mx-auto px-[24px] py-[32px] bg-surface dark:bg-stone-950 min-h-screen khadi-texture">
      <div className="flex items-center justify-between mb-[32px]">
        <h2 className="text-[24px] font-black text-primary dark:text-[#c04d29] m-0 font-headline">
          {t.resultsTitle}
        </h2>
        <button
          onClick={() => navigate('/')}
          className="text-primary dark:text-[#c04d29] bg-transparent border-none text-[14px] font-bold cursor-pointer"
        >
          {t.done}
        </button>
      </div>

      {/* 1. URGENCY BANNER */}
      <div className={`w-full rounded-[12px] p-[20px] mb-[32px] khadi-pattern border border-outline-variant/10 ${urgency.bg} ${urgency.color}`}>
        <div className="flex items-center gap-[12px] mb-[8px]">
          <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {urgency.icon}
          </span>
          <h3 className="text-[18px] font-bold m-0">{urgency.text}</h3>
        </div>
        <p className="text-[15px] m-0 opacity-90 leading-relaxed">
          {result.description}
        </p>
      </div>

      {/* 3. POSSIBLE CONDITIONS */}
      <section className="mb-[32px]">
        <h4 className="text-[14px] text-on-surface-variant/60 uppercase tracking-widest font-bold mb-[16px]">
          {t.possibleConditions}
        </h4>
        <div className="flex flex-col gap-[12px]">
          {normalizedResult.possibleConditions.map((condition, idx) => {
            const isOldFormat = condition.probability === null;
            
            // Color logic based on probability
            let barColor = "#15686c";
            let badgeBg = "#e0f4f4";
            let badgeText = "#0d4a4d";

            if (condition.probability >= 60) {
              barColor = "#ba1a1a";
              badgeBg = "#ffdad6";
              badgeText = "#93000a";
            } else if (condition.probability >= 30) {
              barColor = "#9f3513";
              badgeBg = "#fce8e0";
              badgeText = "#7a2810";
            }

            return (
              <div key={idx} className="p-[16px] border border-outline-variant/30 rounded-[12px] bg-surface-container-lowest">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[16px] font-bold text-on-surface">{condition.name}</span>
                  {!isOldFormat && (
                    <span 
                      className="text-[13px] font-black px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: badgeBg, color: badgeText }}
                    >
                      {condition.probability}%
                    </span>
                  )}
                </div>
                {!isOldFormat && (
                  <div className="w-full h-2 rounded-full bg-outline-variant/20">
                    <div 
                      className="h-2 rounded-full transition-all" 
                      style={{ width: `${condition.probability}%`, backgroundColor: barColor }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* NEW: DOCTOR TESTS */}
      {normalizedResult.doctorTests.length > 0 && (
        <section className="mb-[32px]">
          <h4 className="text-[14px] text-on-surface-variant/60 uppercase tracking-widest font-bold mb-[16px]">
            What the doctor will check
          </h4>
          <div className="flex flex-wrap gap-2">
            {normalizedResult.doctorTests.map((test, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/30 rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-secondary text-[16px]">biotech</span>
                <span className="text-[13px] font-semibold text-on-surface">{test}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NEW: LIKELY TREATMENT */}
      {normalizedResult.predictedMedications.length > 0 && (
        <section className="mb-[32px]">
          <h4 className="text-[14px] text-on-surface-variant/60 uppercase tracking-widest font-bold mb-[4px]">
            Likely treatment
          </h4>
          <p className="text-[11px] text-error font-semibold mb-[16px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">warning</span>
            AI prediction only — do not self-medicate. Doctor consultation required.
          </p>
          <div className="flex flex-col gap-3">
            {normalizedResult.predictedMedications.map((med, idx) => (
              <div key={idx} className="flex items-start gap-3 p-[14px] border border-outline-variant/30 rounded-[12px] bg-surface-container-lowest">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {medIcons[med.type] || 'medication'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px] font-bold text-on-surface">{med.name}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">{med.type}</span>
                  </div>
                  <p className="text-[12px] text-on-surface-variant m-0">{med.purpose}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. HOME REMEDY */}
      {result.urgency === "HOME_CARE" && result.homeRemedy && (
        <section className="mb-[32px]">
          <h4 className="text-[14px] text-on-surface-variant/60 uppercase tracking-widest font-bold mb-[16px]">
            {t.homeRemedy}
          </h4>
          <div className="p-[16px] bg-surface-container-low rounded-[8px] border border-outline-variant/20">
            <p className="text-[15px] text-on-surface leading-relaxed m-0">
              {result.homeRemedy}
            </p>
          </div>
        </section>
      )}

      {/* 5. WARNING */}
      {result.urgency === "EMERGENCY" && result.warning && (
        <div className="mb-[32px] p-[16px] bg-error/10 text-error rounded-[8px] border border-error/20 flex gap-3">
          <span className="material-symbols-outlined">warning</span>
          <p className="text-[14px] font-bold m-0 leading-relaxed">
            {result.warning}
          </p>
        </div>
      )}

      {/* 6. NEARBY HOSPITALS */}
      <section className="mb-[32px]">
        <h4 className="text-[14px] text-on-surface-variant/60 uppercase tracking-widest font-bold mb-[16px]">
          {t.nearbyHospitals}
        </h4>
        <button
          onClick={handleFindHospitals}
          className="w-full bg-secondary text-white rounded-[12px] py-[14px] px-[16px] text-[15px] font-bold cursor-pointer shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">map</span>
          {t.findHospitals}
        </button>
      </section>

      {/* 7. DISCLAIMER */}
      <div className="mt-[48px] p-[20px] bg-error/5 rounded-[12px] border border-error/20">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-error text-[20px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
          <div>
            <p className="text-[13px] font-black text-error m-0 mb-1">Medical Disclaimer</p>
            <p className="text-[12px] text-on-surface-variant/70 m-0 leading-relaxed">
              {result.disclaimer}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-[32px] flex flex-col gap-[12px]">
        {/* 8. SAVE BUTTON */}
        {user ? (
          <button
            onClick={handleSave}
            disabled={savedState}
            className={`w-full h-[56px] rounded-[12px] text-[16px] font-bold border-none cursor-pointer transition-all ${
              savedState 
                ? 'bg-surface-container-highest text-on-surface-variant/50 cursor-default' 
                : 'bg-primary text-on-primary shadow-lg shadow-primary/20'
            }`}
          >
            {savedState ? t.saved : t.saveHistory}
          </button>
        ) : (
          <button
            onClick={() => navigate('/login', { state: { from: '/results', result: result, symptoms: state.symptoms, source: state.source, language: language } })}
            className="w-full h-[56px] bg-surface-container-highest text-primary rounded-[12px] text-[16px] font-bold border-none cursor-pointer shadow-sm"
          >
            {t.loginToSave}
          </button>
        )}

        {/* 9. NEW CHECK BUTTON */}
        <button
          onClick={() => navigate('/check')}
          className="w-full h-[56px] bg-white border border-primary text-primary rounded-[12px] text-[16px] font-bold cursor-pointer"
        >
          {t.newCheck}
        </button>
      </div>
    </div>
  );
};

export default Results;
