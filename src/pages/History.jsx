import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { getUserHistory } from '../services/firebase';

const History = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchHistory = async () => {
        try {
          setError(null);
          const data = await getUserHistory(user.uid);
          setHistory(data);
        } catch (err) {
          console.error(err);
          setError(t.error || 'Failed to load health history. Please try again later.');
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading, t.error]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown Date';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    return `${date.toLocaleDateString('en-GB', options)} · ${date.toLocaleTimeString('en-US', timeOptions)}`;
  };

  const getUrgencyStyles = (urgency) => {
    switch (urgency) {
      case 'HOME_CARE':
        return { bg: '#e8f5e9', color: '#2e7d32' };
      case 'VISIT_SOON':
        return { bg: '#fff3e0', color: '#e65100' };
      case 'EMERGENCY':
        return { bg: '#ffebee', color: '#c62828' };
      default:
        return { bg: '#f5f5f5', color: '#666' };
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-[480px] mx-auto px-[24px] py-[64px] bg-white text-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-on-surface-variant/60">{t.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-[480px] mx-auto px-[24px] py-[64px] bg-white text-center min-h-screen">
        <div className="mb-8">
          <span className="material-symbols-outlined text-6xl text-primary/20">account_circle</span>
        </div>
        <p className="text-on-surface-variant/80 mb-[32px] font-medium">{t.loginToSave}</p>
        <button
          onClick={() => navigate('/login')}
          className="w-full h-[56px] bg-primary text-on-primary rounded-[12px] font-bold border-none cursor-pointer mb-[16px] shadow-lg shadow-primary/20"
        >
          {t.login}
        </button>
        <button
          onClick={() => navigate('/check')}
          className="w-full h-[56px] bg-white border border-primary text-primary rounded-[12px] font-bold cursor-pointer"
        >
          {t.newCheck}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto px-[24px] py-[32px] bg-surface dark:bg-stone-950 min-h-screen khadi-texture">
      <div className="flex justify-between items-center mb-[32px]">
        <h1 className="text-[24px] font-black text-primary dark:text-[#c04d29] m-0 font-headline">{t.history}</h1>
        <button
          onClick={() => navigate('/check')}
          className="bg-primary text-on-primary rounded-full px-[16px] py-[8px] text-[13px] font-bold cursor-pointer border-none shadow-md active:scale-95 transition-transform"
        >
          {t.newCheck}
        </button>
      </div>

      {error ? (
        <div className="text-center py-[64px] bg-error/5 rounded-[24px] border border-error/20">
          <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
          <p className="text-error font-medium px-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 text-primary font-bold bg-transparent border-none cursor-pointer hover:underline"
          >
            Try Again
          </button>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-[64px] bg-surface-container-low dark:bg-stone-900 rounded-[2rem] khadi-pattern border border-outline-variant/20">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-primary">history_off</span>
          </div>
          <p className="text-on-surface font-bold text-lg mb-1">No History Yet</p>
          <p className="text-on-surface-variant/60 m-0 px-8">{t.noHistory}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {history.map((record) => {
            const urgencyStyles = getUrgencyStyles(record.urgency);
            return (
              <div
                key={record.id}
                onClick={() => navigate('/results', { state: { result: record, symptoms: record.symptoms, source: record.imageUsed ? "image" : "text", language: record.language } })}
                className="border border-outline-variant/30 rounded-[2rem] p-[24px] bg-surface-container-lowest dark:bg-stone-900 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-[16px]">
                  <div className="flex flex-col gap-2">
                    <span className="text-[12px] text-on-surface-variant/60 font-bold uppercase tracking-wider">
                      {formatDate(record.timestamp)}
                    </span>
                    <span
                      style={{ backgroundColor: urgencyStyles.bg, color: urgencyStyles.color }}
                      className="px-[12px] py-[4px] rounded-full text-[11px] font-black uppercase tracking-widest w-fit"
                    >
                      {record.urgency === 'HOME_CARE' ? t.urgencyLow : record.urgency === 'VISIT_SOON' ? t.urgencyMedium : t.urgencyHigh}
                    </span>
                  </div>
                  {record.imageUsed && (
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">image</span>
                    </div>
                  )}
                </div>
                <p className="text-[18px] font-black text-on-surface m-0 mb-[8px] line-clamp-2 font-headline">
                  {record.possibleConditions.join(', ')}
                </p>
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/10">
                  <span className="text-[11px] text-on-surface-variant/40 font-black uppercase tracking-[0.2em]">
                    {record.language}
                  </span>
                  <span className="text-primary dark:text-[#c04d29] text-[13px] font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {t.viewDetails}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
