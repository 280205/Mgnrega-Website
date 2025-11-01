import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t-2 border-gray-200 mt-16 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <span className="text-2xl">🏛️</span>
              <span className="text-xl font-bold text-gray-900">MGNREGA Dashboard</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">{t('footer')}</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors flex items-center"
            >
              <span className="mr-1">ℹ️</span>
              {t('about')}
            </Link>
            <a 
              href="https://nrega.nic.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors flex items-center"
            >
              <span className="mr-1">🔗</span>
              Official Portal
            </a>
            <a 
              href="https://data.gov.in" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-orange-600 font-semibold transition-colors flex items-center"
            >
              <span className="mr-1">📊</span>
              Data Source
            </a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600 font-medium">
            Made with <span className="text-red-500">❤️</span> for Uttar Pradesh • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
