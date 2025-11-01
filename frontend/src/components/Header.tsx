import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-orange-100">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
              <span className="text-2xl">🏛️</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{t('appTitle')}</div>
              <p className="text-sm text-gray-600 font-medium">{t('subtitle')}</p>
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/about" 
              className="hidden md:inline-flex items-center px-4 py-2 text-gray-700 font-semibold hover:text-orange-600 transition-colors"
            >
              ℹ️ About
            </Link>
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
