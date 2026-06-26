import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  const langs = [
    { id: 'English', label: 'EN' },
    { id: 'Tamil', label: 'த' },
    { id: 'Hindi', label: 'हि' }
  ];

  return (
    <div className="flex gap-[4px]">
      {langs.map((lang) => (
        <button
          key={lang.id}
          onClick={() => setLanguage(lang.id)}
          className={`px-3 py-1 text-[13px] border transition-none ${
            language === lang.id
              ? 'bg-[#FF9933] text-white border-[#FF9933]'
              : 'bg-white text-[#666] border-[#ddd]'
          }`}
          style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
