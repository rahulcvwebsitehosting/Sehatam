import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { analyzeSymptomText, analyzeSymptomImage } from '../services/gemini';

const SymptomCheck = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { state } = useLocation();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState(1); // 1: Text, 2: Image
  const [symptoms, setSymptoms] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (state?.mode === 'photo') {
      setActiveTab(2);
    } else if (state?.mode === 'type') {
      setActiveTab(1);
    }
  }, [state]);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError('');
    try {
      const result = await analyzeSymptomText(symptoms, language);
      navigate('/results', { state: { result, source: 'text', symptoms, language } });
    } catch (err) {
      console.error('Text analysis error:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size too large (max 5MB)');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (!imagePreview) return;

    setLoading(true);
    setError('');
    try {
      // Extract base64 data (remove prefix)
      const base64Data = imagePreview.split(',')[1];
      const result = await analyzeSymptomImage(base64Data, image.type, language);
      navigate('/results', { state: { result, source: 'image', symptoms: 'Image Analysis', language } });
    } catch (err) {
      console.error('Image analysis error:', err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const tab1Label = t.describeSymptom.split(' ').slice(0, 3).join(' ');

  return (
    <div className="max-w-[480px] mx-auto px-[24px] py-[32px] bg-surface dark:bg-stone-950 min-h-screen khadi-texture">
      <button
        onClick={() => navigate('/')}
        className="text-primary dark:text-[#c04d29] bg-transparent border-none text-[16px] mb-[24px] cursor-pointer flex items-center font-bold active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined mr-1">arrow_back</span>
        {t.back}
      </button>

      <div className="flex bg-surface-container-low dark:bg-stone-900 rounded-2xl p-1 mb-[32px] border border-outline-variant/10">
        <button
          onClick={() => setActiveTab(1)}
          className={`flex-1 py-[12px] text-[15px] font-bold rounded-xl transition-all duration-300 ${
            activeTab === 1 
              ? 'bg-primary text-on-primary shadow-md' 
              : 'text-on-surface-variant/60 hover:bg-surface-container-high'
          }`}
        >
          {tab1Label}
        </button>
        <button
          onClick={() => setActiveTab(2)}
          className={`flex-1 py-[12px] text-[15px] font-bold rounded-xl transition-all duration-300 ${
            activeTab === 2 
              ? 'bg-primary text-on-primary shadow-md' 
              : 'text-on-surface-variant/60 hover:bg-surface-container-high'
          }`}
        >
          {t.uploadPhoto}
        </button>
      </div>

      {activeTab === 1 ? (
        <form onSubmit={handleTextSubmit} className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[8px]">
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder={t.describeSymptom}
              maxLength={300}
              rows={5}
              className="w-full border border-outline-variant/30 rounded-2xl p-[16px] text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none bg-surface-container-lowest dark:bg-stone-900 dark:text-stone-100"
              required
            />
            <span className="text-[12px] text-on-surface-variant/60 text-right font-medium">
              {300 - symptoms.length} {t.characterCount}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !symptoms.trim()}
            className={`w-full h-[56px] bg-primary text-on-primary rounded-2xl text-[16px] font-bold border-none cursor-pointer shadow-lg shadow-primary/20 active:scale-[0.98] transition-all ${
              loading || !symptoms.trim() ? 'opacity-50 grayscale' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                {t.loading}
              </div>
            ) : t.checkNow}
          </button>
        </form>
      ) : (
        <form onSubmit={handleImageSubmit} className="flex flex-col gap-[16px]">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video border-2 border-dashed border-outline-variant/30 rounded-2xl flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-surface-container-low dark:bg-stone-900 khadi-pattern hover:border-primary transition-colors group"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="text-center p-[24px]">
                <span className="material-symbols-outlined text-4xl text-primary/40 group-hover:text-primary transition-colors mb-2">add_a_photo</span>
                <span className="text-[14px] text-on-surface font-bold block">{t.uploadPhoto}</span>
                <span className="text-[12px] text-on-surface-variant/60 mt-[4px] block font-medium">(Max 5MB)</span>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          <button
            type="submit"
            disabled={loading || !imagePreview}
            className={`w-full h-[56px] bg-primary text-on-primary rounded-2xl text-[16px] font-bold border-none cursor-pointer shadow-lg shadow-primary/20 active:scale-[0.98] transition-all ${
              loading || !imagePreview ? 'opacity-50 grayscale' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                {t.loading}
              </div>
            ) : t.checkNow}
          </button>
        </form>
      )}

      {error && (
        <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 text-error">
          <span className="material-symbols-outlined">error</span>
          <p className="text-[14px] font-bold">{error}</p>
        </div>
      )}

      <div className="mt-12 p-4 bg-surface-container-highest/30 rounded-2xl border border-outline-variant/10">
        <p className="text-[12px] text-on-surface-variant/70 italic text-center leading-relaxed">
          {t.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default SymptomCheck;
