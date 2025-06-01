import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AddTeacherForm() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    grade: '',
    email: '',
    phone: '',
    address: '',
  });

  // Detect system preference for dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handler = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Teacher added:', formData);
    alert('تم إضافة المعلم بنجاح!');
    router.push('/teachers');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-900'}`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div key={i} className={`absolute rounded-full opacity-10 ${darkMode ? 'bg-purple-400' : 'bg-indigo-300'}`}
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 flex h-20 items-center justify-between px-6 backdrop-blur-md border-b ${
        darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => router.back()}
            className={`p-2 rounded-full transition-all duration-300 hover:bg-opacity-20 hover:bg-gray-500 ${
              darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
            إضافة معلم جديد
          </h1>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition-all ${
            darkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-10 relative z-10">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
            نظام إدارة المعلمين
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            أضف معلمًا جديدًا إلى النظام التعليمي وابدأ في إدارة الفصول والمواد الدراسية بسهولة
          </p>
        </div>

        {/* Form Card */}
        <div className={`max-w-4xl mx-auto rounded-3xl p-8 shadow-2xl backdrop-blur-sm transform transition-all duration-500 hover:scale-[1.005] ${
          darkMode ? 'bg-gray-800/70 border border-gray-700' : 'bg-white/90 border border-gray-100'
        }`}>
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              نموذج إضافة معلم
            </h3>
            <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="relative group">
                <input
                  type="text"
                  name="name"
                  placeholder=" "
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 peer focus:border-indigo-500 focus:ring-0 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 focus:border-indigo-400 text-white' 
                      : 'bg-white border-gray-300 focus:border-indigo-500 text-gray-900'
                  }`}
                />
                <label className={`absolute right-4 top-1/2 -translate-y-1/2 px-1 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:-translate-y-0 peer-focus:scale-90 peer-focus:text-indigo-600 ${
                  darkMode 
                    ? 'peer-focus:text-indigo-400 bg-gray-800 text-gray-300' 
                    : 'bg-white text-gray-600'
                }`}>
                  اسم المعلم
                </label>
              </div>

              {/* Subject */}
              <div className="relative group">
                <input
                  type="text"
                  name="subject"
                  placeholder=" "
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 peer focus:border-indigo-500 focus:ring-0 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 focus:border-indigo-400 text-white' 
                      : 'bg-white border-gray-300 focus:border-indigo-500 text-gray-900'
                  }`}
                />
                <label className={`absolute right-4 top-1/2 -translate-y-1/2 px-1 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:-translate-y-0 peer-focus:scale-90 peer-focus:text-indigo-600 ${
                  darkMode 
                    ? 'peer-focus:text-indigo-400 bg-gray-800 text-gray-300' 
                    : 'bg-white text-gray-600'
                }`}>
                  التخصص
                </label>
              </div>

              {/* Grade */}
              <div className="relative group">
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 appearance-none peer focus:border-indigo-500 focus:ring-0 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 focus:border-indigo-400 text-white' 
                      : 'bg-white border-gray-300 focus:border-indigo-500 text-gray-900'
                  }`}
                >
                  <option value=""></option>
                  <option value="الصف السابع">الصف السابع</option>
                  <option value="الصف الثامن">الصف الثامن</option>
                  <option value="الصف التاسع">الصف التاسع</option>
                  <option value="الصف العاشر">الصف العاشر</option>
                  <option value="الصف الحادي عشر">الصف الحادي عشر</option>
                  <option value="الصف الثاني عشر">الصف الثاني عشر</option>
                </select>
                <label className={`absolute right-4 top-1/2 -translate-y-1/2 px-1 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:-translate-y-0 peer-focus:scale-90 peer-focus:text-indigo-600 ${
                  darkMode 
                    ? 'peer-focus:text-indigo-400 bg-gray-800 text-gray-300' 
                    : 'bg-white text-gray-600'
                }`}>
                  الصف المسؤول عنه
                </label>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Email */}
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder=" "
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 peer focus:border-indigo-500 focus:ring-0 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 focus:border-indigo-400 text-white' 
                      : 'bg-white border-gray-300 focus:border-indigo-500 text-gray-900'
                  }`}
                />
                <label className={`absolute right-4 top-1/2 -translate-y-1/2 px-1 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:-translate-y-0 peer-focus:scale-90 peer-focus:text-indigo-600 ${
                  darkMode 
                    ? 'peer-focus:text-indigo-400 bg-gray-800 text-gray-300' 
                    : 'bg-white text-gray-600'
                }`}>
                  البريد الإلكتروني
                </label>
              </div>

              {/* Phone */}
              <div className="relative group">
                <input
                  type="tel"
                  name="phone"
                  placeholder=" "
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-3 rounded-xl border-2 peer focus:border-indigo-500 focus:ring-0 transition-all duration-200 ${
                    darkMode 
                      ? 'bg-gray-700/50 border-gray-600 focus:border-indigo-400 text-white' 
                      : 'bg-white border-gray-300 focus:border-indigo-500 text-gray-900'
                  }`}
                />
                <label className={`absolute right-4 top-1/2 -translate-y-1/2 px-1 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:-translate-y-0 peer-focus:scale-90 peer-focus:text-indigo-600 ${
                  darkMode 
                    ? 'peer-focus:text-indigo-400 bg-gray-800 text-gray-300' 
                    : 'bg-white text-gray-600'
                }`}>
                  رقم الهاتف
                </label>
              </div>
            </div>

            {/* Address */}
            <div className="relative group">
              <textarea
                name="address"
                rows="3"
                placeholder=" "
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border-2 peer focus:border-indigo-500 focus:ring-0 transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700/50 border-gray-600 focus:border-indigo-400 text-white' 
                    : 'bg-white border-gray-300 focus:border-indigo-500 text-gray-900'
                }`}
              ></textarea>
              <label className={`absolute right-4 top-3 px-1 pointer-events-none transition-all duration-200 peer-placeholder-shown:top-3 peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:-translate-y-0 peer-focus:scale-90 peer-focus:text-indigo-600 ${
                darkMode 
                  ? 'peer-focus:text-indigo-400 bg-gray-800 text-gray-300' 
                  : 'bg-white text-gray-600'
              }`}>
                العنوان
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center space-x-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>حفظ المعلم</span>
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className={`py-3.5 px-6 rounded-xl border-2 font-medium transition-all duration-300 hover:scale-[1.02] ${
                  darkMode 
                    ? 'border-gray-600 hover:bg-gray-700/50 hover:border-gray-500' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        .dark select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}