import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Proactively request location permission for finding hospitals later
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => console.log("Location permission granted"),
        () => console.log("Location permission denied"),
        { enableHighAccuracy: false, timeout: 5000, maximumAge: Infinity }
      );
    }
  }, []);

  return (
    <div className="min-h-screen pb-32 khadi-texture">
      {/* Hero Section */}
      <section className="px-6 pt-10 pb-8 max-w-2xl mx-auto flex flex-col items-center text-center">
        <img 
          src="https://i.ibb.co/Fq3M1JVv/screen.png" 
          alt="Sehatam Logo" 
          className="h-24 w-auto mb-6 object-contain"
          onError={(e) => e.target.style.display = 'none'}
        />
        <h1 className="font-headline font-bold text-4xl text-primary leading-tight mb-2">
          {t.appName}
        </h1>
        <p className="font-headline text-lg text-on-surface-variant italic mb-8">
          {t.tagline}
        </p>

        {/* Main Action Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Photo Action */}
          <button 
            onClick={() => navigate('/check', { state: { mode: 'photo' } })}
            className="group bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col items-start gap-4 border border-outline-variant/15 transition-all duration-300 hover:bg-surface-container-low active:scale-95 shadow-sm"
          >
            <div className="w-16 h-16 bg-secondary-container rounded-2xl flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-4xl">photo_camera</span>
            </div>
            <div className="text-left">
              <h3 className="font-headline text-2xl font-bold text-secondary">{t.uploadPhoto}</h3>
              <p className="text-sm text-on-surface-variant">Best for skin rashes, eyes, or visible wounds</p>
            </div>
          </button>

          {/* Type Action */}
          <button 
            onClick={() => navigate('/check', { state: { mode: 'type' } })}
            className="group bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col items-start gap-4 border border-outline-variant/15 transition-all duration-300 hover:bg-surface-container-low active:scale-95 shadow-sm"
          >
            <div className="w-16 h-16 bg-tertiary-fixed rounded-2xl flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-4xl">keyboard</span>
            </div>
            <div className="text-left">
              <h3 className="font-headline text-2xl font-bold text-tertiary">{t.describeSymptom}</h3>
              <p className="text-sm text-on-surface-variant">Write down details manually in text format</p>
            </div>
          </button>
        </div>
      </section>

      {/* Help Section / Visual Guide */}
      <section className="px-6 py-12 max-w-2xl mx-auto">
        <div className="bg-surface-container-low rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary">lightbulb</span>
            <h2 className="font-headline text-2xl font-bold text-on-surface">How to Use</h2>
          </div>
          <div className="space-y-8">
            {/* Guide Item 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-surface shadow-sm">
                <img 
                  alt="Clear photography guide" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7kARLM69lb2NF72cKm0cVuUF06nx2XHoaMbG3wiqT7FEv459d2IwWPQQeB2UTxsM6L_Z3qf5aKOW4CyZh6s6yboeYV75s80-8kW69OGh3iT_EOmMKku34OGhv3soWIDkj9OrQD112I2BdvlJTvAdQlc-JUu2Ux6l8avKo0TjIuexOVXwsDXr-ZpMAcv0jFb53NByXOEkvp5GWltewQutkL5cKLsSahFGQEbo5_wzbUY-hHvu2j-F58ufwVGQuaqBechp50gRwQA"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1">Clear Photos</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Ensure you are in a bright room or natural daylight. Keep the camera steady and focus on the affected area.</p>
              </div>
            </div>
            {/* Guide Item 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden bg-surface shadow-sm">
                <img 
                  alt="Symptom description guide" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjXQwceKssGeu7XtGmoplIyOKdfJwcoHS0RhelE6ET0FZ7zOmGy-PrN9seCengqnMmwSqdr2O2FaSqHzSOPQ31cONJUlf4fy6rK4dCigW5uaI2cinBGPxdvmfqcxMUvSL0bX1PR_QT3nsUEHnpI88Z71cVZzvqYiD5icQF0wpQRCeSe5NTP_Gey35RXbMnBLYYmNiZjBQGxqRTbdhqvsGgl1VOC9u09Wdedseso1N2VYoree70nGV2418QqAv6lxXtzJJf3pzvbw"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1">{t.describeSymptom}</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">Describe your symptoms in detail. You can write in Hindi, Tamil, or English to get an accurate analysis.</p>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <span className="bg-surface px-4 py-2 rounded-full text-xs font-semibold text-secondary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">verified_user</span> Private & Secure
            </span>
            <span className="bg-surface px-4 py-2 rounded-full text-xs font-semibold text-tertiary flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">language</span> Multilingual Support
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
