import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    appTitle: 'MGNREGA Dashboard',
    subtitle: 'Our Voice, Our Rights',
    selectDistrict: 'Select Your District',
    autoDetect: 'Auto-Detect Location',
    currentPerformance: 'Current Performance',
    historicalTrends: 'Historical Trends',
    comparison: 'State Comparison',
    personDays: 'Person Days Generated',
    employment: 'Employment Provided',
    activeJobCards: 'Active Job Cards',
    averageWage: 'Average Wage',
    totalExpenditure: 'Total Expenditure',
    worksCompleted: 'Works Completed',
    worksOngoing: 'Works Ongoing',
    loading: 'Loading...',
    error: 'Error loading data',
    noData: 'No data available',
    monthsAgo: 'months ago',
    vsStateAverage: 'vs State Average',
    higher: 'Higher',
    lower: 'Lower',
    about: 'About MGNREGA',
    footer: '© 2025 MGNREGA Dashboard. Data from data.gov.in',
  },
  hi: {
    appTitle: 'मनरेगा डैशबोर्ड',
    subtitle: 'हमारी आवाज़, हमारे अधिकार',
    selectDistrict: 'अपना जिला चुनें',
    autoDetect: 'स्थान स्वत: पता करें',
    currentPerformance: 'वर्तमान प्रदर्शन',
    historicalTrends: 'ऐतिहासिक रुझान',
    comparison: 'राज्य की तुलना',
    personDays: 'व्यक्ति दिवस उत्पन्न',
    employment: 'रोजगार प्रदान किया गया',
    activeJobCards: 'सक्रिय जॉब कार्ड',
    averageWage: 'औसत मजदूरी',
    totalExpenditure: 'कुल व्यय',
    worksCompleted: 'कार्य पूर्ण',
    worksOngoing: 'चल रहे कार्य',
    loading: 'लोड हो रहा है...',
    error: 'डेटा लोड करने में त्रुटि',
    noData: 'कोई डेटा उपलब्ध नहीं',
    monthsAgo: 'महीने पहले',
    vsStateAverage: 'राज्य औसत की तुलना में',
    higher: 'अधिक',
    lower: 'कम',
    about: 'मनरेगा के बारे में',
    footer: '© 2025 मनरेगा डैशबोर्ड। डेटा स्रोत: data.gov.in',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('hi'); // Default to Hindi for rural users

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
