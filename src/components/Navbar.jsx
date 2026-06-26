import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { signOutUser } from '../services/firebase';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return '';
    // Assuming phone number is in user.phoneNumber
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length >= 6) {
      return cleanPhone.substring(0, 6) + '****';
    }
    return phone;
  };

  return (
    <header className="bg-surface dark:bg-stone-950 flex justify-between items-center w-full px-6 h-16 sticky top-0 z-50 border-b border-outline-variant/10">
      <div 
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <img 
          src="https://i.ibb.co/Fq3M1JVv/screen.png" 
          alt="Sehatam Logo" 
          className="h-10 w-auto object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <span className="text-2xl font-black text-primary dark:text-[#c04d29] font-headline hidden sm:block">{t.appName}</span>
        <span className="text-2xl font-black text-primary dark:text-[#c04d29] font-headline sm:hidden" style={{display: 'none'}}>{t.appName}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <LanguageToggle />
        
        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-on-surface-variant font-medium hidden sm:block">
              {formatPhone(user.phoneNumber)}
            </span>
            <button
              onClick={handleLogout}
              className="material-symbols-outlined text-stone-600 dark:text-stone-400 hover:bg-[#f5f0e1] dark:hover:bg-stone-800 p-2 rounded-full transition-transform active:scale-95 duration-200"
              title={t.logout}
            >
              logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="material-symbols-outlined text-stone-600 dark:text-stone-400 hover:bg-[#f5f0e1] dark:hover:bg-stone-800 p-2 rounded-full transition-transform active:scale-95 duration-200"
            title={t.login}
          >
            account_circle
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
