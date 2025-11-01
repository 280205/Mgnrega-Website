import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.tsx';
import { FaHome } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FaHome className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-md p-8">
          {language === 'hi' ? (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-6 font-hindi">
                मनरेगा के बारे में
              </h1>

              <div className="space-y-6 font-hindi">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा)
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    मनरेगा भारत सरकार की एक महत्वपूर्ण योजना है जो ग्रामीण परिवारों को रोजगार की गारंटी देती है। 
                    यह योजना हर साल एक वित्तीय वर्ष में 100 दिनों के अकुशल शारीरिक कार्य की गारंटी देती है।
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    मुख्य विशेषताएं
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>प्रत्येक ग्रामीण परिवार को 100 दिन का रोजगार गारंटी</li>
                    <li>कम से कम न्यूनतम मजदूरी का भुगतान</li>
                    <li>महिलाओं के लिए 33% आरक्षण</li>
                    <li>बुनियादी ढांचे का विकास</li>
                    <li>पर्यावरण संरक्षण कार्य</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    यह डैशबोर्ड क्या करता है?
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    यह वेबसाइट आपको अपने जिले में मनरेगा की प्रगति को आसानी से समझने में मदद करती है। 
                    आप देख सकते हैं कि कितने लोगों को रोजगार मिला, कितना पैसा खर्च हुआ, और कितने काम पूरे हुए।
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    डेटा स्रोत
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    सभी डेटा सरकार की आधिकारिक वेबसाइट data.gov.in से लिया गया है।
                  </p>
                </section>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-800 mb-6">
                About MGNREGA
              </h1>

              <div className="space-y-6">
                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    Mahatma Gandhi National Rural Employment Guarantee Act
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    MGNREGA is one of the largest social welfare programs in the world. It guarantees 
                    100 days of wage employment in a financial year to every rural household whose 
                    adult members volunteer to do unskilled manual work.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    Key Features
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    <li>Guaranteed 100 days of employment per rural household</li>
                    <li>Payment of minimum wages</li>
                    <li>33% reservation for women</li>
                    <li>Infrastructure development in rural areas</li>
                    <li>Environmental conservation works</li>
                    <li>Strengthening rural livelihood</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    What This Dashboard Does
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    This website helps you understand how MGNREGA is performing in your district in 
                    a simple, visual way. You can see employment data, wages paid, works completed, 
                    and compare your district's performance with state averages.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    Impact in 2025
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    In 2025 alone, 12.15 Crore rural Indians have benefited from MGNREGA, making it 
                    one of the most impactful welfare programs globally.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-3">
                    Data Source
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    All data is sourced from the official Government of India Open Data platform at{' '}
                    <a 
                      href="https://data.gov.in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:underline"
                    >
                      data.gov.in
                    </a>
                  </p>
                </section>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
