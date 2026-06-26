import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { signInWithPhone, verifyOTP } from '../services/firebase';

const Login = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const otpRefs = useRef([]);

  useEffect(() => {
    if (user) {
      const from = location.state?.from || '/';
      navigate(from, { state: location.state, replace: true });
    }
  }, [user, navigate, location.state]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendOTP = async () => {
    if (!phoneNumber.startsWith('+91') || phoneNumber.length !== 13) {
      setError('Please enter a valid Indian mobile number (+91XXXXXXXXXX)');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await signInWithPhone(phoneNumber);
      setConfirmationResult(result);
      setStep(2);
      setResendTimer(30);
    } catch (err) {
      console.error(err);
      setError(t.error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPhone(phoneNumber);
      setConfirmationResult(result);
      setResendTimer(30);
      setError('OTP resent successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) return;

    setLoading(true);
    setError('');
    try {
      await verifyOTP(confirmationResult, otpString);
    } catch (err) {
      console.error(err);
      setError('Incorrect OTP. Please try again.');
      setOtp(['', '', '', '', '', '']);
      otpRefs.current[0].focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[480px] mx-auto px-[32px] py-[32px] bg-surface dark:bg-stone-950 min-h-screen khadi-texture">
      <button
        onClick={() => navigate('/')}
        className="text-primary dark:text-[#c04d29] bg-transparent border-none text-[16px] mb-[24px] cursor-pointer font-bold active:scale-95 transition-transform flex items-center"
      >
        <span className="material-symbols-outlined mr-1">arrow_back</span>
        {t.back}
      </button>

      <div className="text-center mb-[48px]">
        <img 
          src="https://i.ibb.co/Fq3M1JVv/screen.png" 
          alt="Sehatam Logo" 
          className="h-20 w-auto mx-auto mb-6 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/10" style={{display: 'none'}}>
          <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            lock_person
          </span>
        </div>
        <h1 className="text-[32px] font-black text-primary dark:text-[#c04d29] font-headline mb-2">
          {t.login}
        </h1>
        <p className="text-on-surface-variant/70 font-medium">
          Secure access to your health records
        </p>
      </div>

      {step === 1 ? (
        <div className="flex flex-col gap-[20px]">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[12px] font-black text-on-surface-variant uppercase tracking-[0.2em] ml-2">
              Mobile Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91 XXXXX XXXXX"
              className="w-full border border-outline-variant/30 rounded-2xl p-[20px] text-[18px] font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface-container-lowest dark:bg-stone-900 dark:text-stone-100 transition-all"
            />
          </div>
          <div id="recaptcha-container" className="mb-[16px]"></div>
          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full h-[64px] bg-primary text-on-primary rounded-2xl text-[18px] font-black border-none cursor-pointer shadow-xl shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                {t.loading}
              </div>
            ) : t.login}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-[20px]">
          <p className="text-[14px] text-on-surface-variant/80 mb-[16px] text-center font-bold">
            Enter the 6-digit OTP sent to your number
          </p>
          <div className="flex justify-between mb-[24px] gap-2">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (otpRefs.current[idx] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-full h-[64px] border border-outline-variant/30 rounded-2xl text-center text-[24px] font-black focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-surface-container-lowest dark:bg-stone-900 dark:text-stone-100 transition-all"
              />
            ))}
          </div>
          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="w-full h-[64px] bg-primary text-on-primary rounded-2xl text-[18px] font-black border-none cursor-pointer shadow-xl shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined animate-spin">progress_activity</span>
                {t.loading}
              </div>
            ) : 'Verify OTP'}
          </button>
          <div className="flex flex-col gap-2">
            <button
              onClick={handleResendOTP}
              disabled={loading || resendTimer > 0}
              className={`text-primary dark:text-[#c04d29] font-black uppercase tracking-widest bg-transparent border-none cursor-pointer py-3 active:scale-95 transition-transform ${resendTimer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : 'Resend OTP'}
            </button>
            <button
              onClick={() => setStep(1)}
              className="text-on-surface-variant/60 font-bold uppercase tracking-widest bg-transparent border-none cursor-pointer py-3 active:scale-95 transition-transform"
            >
              Change Phone Number
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-error/10 border border-error/20 rounded-xl flex items-center gap-3 text-error">
          <span className="material-symbols-outlined">error</span>
          <p className="text-[14px] font-bold">{error}</p>
        </div>
      )}

      <div className="mt-auto pt-12 text-center">
        <p className="text-[11px] text-on-surface-variant/40 font-bold uppercase tracking-[0.1em] leading-relaxed">
          By continuing, you agree to our <br />
          <span className="underline decoration-primary/30">Terms of Service</span> and <span className="underline decoration-primary/30">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
