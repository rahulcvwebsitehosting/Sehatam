import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const Clinics = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState('idle');
  const [mapUrl, setMapUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setLoading('error');
      setErrorMsg(t.locationDenied);
      return;
    }

    setLoading('locating');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://maps.google.com/maps?q=hospitals+near+me&ll=${latitude},${longitude}&z=14&output=embed`;
        setMapUrl(url);
        setLoading('done');
      },
      () => {
        // Location denied — fall back to generic hospital search
        setMapUrl('https://maps.google.com/maps?q=hospitals+near+me&output=embed');
        setLoading('done');
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-6 pt-8 pb-24 bg-surface dark:bg-stone-950 min-h-screen khadi-texture">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary dark:text-[#c04d29] font-headline m-0">
            {t.nearbyHospitals}
          </h1>
          <p className="text-sm text-on-surface-variant/70 font-medium m-0">
            Hospitals and clinics near you
          </p>
        </div>
        <button
          onClick={handleLocate}
          disabled={loading === 'locating'}
          className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading === 'locating' ? (
            <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <span className="material-symbols-outlined text-lg">my_location</span>
          )}
          {loading === 'done' ? 'Refresh' : 'Find Hospitals'}
        </button>
      </div>

      {/* Idle state */}
      {loading === 'idle' && (
        <div className="w-full h-80 md:h-[500px] rounded-[2rem] border-2 border-dashed border-outline-variant/30 bg-surface-container-low dark:bg-stone-900 flex flex-col items-center justify-center gap-6 khadi-pattern group hover:border-primary transition-colors">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-5xl text-primary">
              local_hospital
            </span>
          </div>
          <div className="text-center px-8">
            <p className="text-on-surface font-bold text-lg mb-1">Find Medical Care</p>
            <p className="text-on-surface-variant text-sm max-w-[280px]">
              Tap the button below to locate the nearest clinics and hospitals.
            </p>
          </div>
          <button
            onClick={handleLocate}
            className="bg-primary text-on-primary px-10 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 active:scale-95 transition-transform"
          >
            Find Hospitals Near Me
          </button>
        </div>
      )}

      {/* Locating spinner */}
      {loading === 'locating' && (
        <div className="w-full h-72 md:h-[500px] rounded-2xl border border-outline-variant/20 bg-surface-container-highest flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-primary">Finding your location...</p>
        </div>
      )}

      {/* Embedded map */}
      {loading === 'done' && mapUrl && (
        <div className="w-full h-72 md:h-[500px] rounded-2xl overflow-hidden border border-outline-variant/20 shadow-sm">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Hospitals near you"
          />
        </div>
      )}

      {/* Error state */}
      {loading === 'error' && (
        <div className="w-full h-48 rounded-2xl border border-error/20 bg-error/5 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <span className="material-symbols-outlined text-error text-3xl">error</span>
          <p className="text-sm font-medium text-on-surface">{errorMsg}</p>
          <button
            onClick={handleLocate}
            className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {loading === 'done' && (
        <p className="text-xs text-on-surface-variant/50 text-center mt-3">
          Tap any result on the map to see details, directions, and contact info
        </p>
      )}
    </div>
  );
};

export default Clinics;
