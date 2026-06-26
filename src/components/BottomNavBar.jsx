import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const BottomNavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', icon: 'home', label: t.home || 'Home' },
    { path: '/check', icon: 'medical_services', label: t.symptoms || 'Symptoms' },
    { path: '/clinics', icon: 'map', label: t.clinics || 'Clinics' },
    { path: '/history', icon: 'history', label: t.history || 'History' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-4 pt-2 bg-[#ffffff]/80 dark:bg-stone-900/80 backdrop-blur-md z-50 rounded-t-[2rem] shadow-[0_-4px_24px_rgba(28,28,22,0.06)] border-t border-[#dfc0b7]/15">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center w-14 h-14 transition-all duration-300 active:scale-90 ${
              isActive 
                ? 'bg-[#f5f0e1] dark:bg-stone-800 text-primary dark:text-[#fcf9ef] rounded-full' 
                : 'text-stone-500 dark:text-stone-400 hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            <span className="font-body text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNavBar;
