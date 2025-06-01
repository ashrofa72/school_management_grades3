import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function TeachersPage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [teachers, setTeachers] = useState([
    { id: 1, name: "أ. سارة أحمد", subject: "الرياضيات", grade: "الصف العاشر", email: "sara@example.com", avatar: "https://picsum.photos/200/300?random=1" },
    { id: 2, name: "أ. نادية محمد", subject: "العلوم", grade: "الصف الحادي عشر", email: "nadia@example.com", avatar: "https://picsum.photos/200/300?random=2" },
    { id: 3, name: "أ. ريماس علي", subject: "اللغة الإنجليزية", grade: "الصف الثاني عشر", email: "rimas@example.com", avatar: "https://picsum.photos/200/300?random=3" },
    { id: 4, name: "أ. محمد حسن", subject: "التاريخ", grade: "الصف الثامن", email: "mohammad@example.com", avatar: "https://picsum.photos/200/300?random=4" },
    { id: 5, name: "أ. لينا عمر", subject: "الفيزياء", grade: "الصف الحادي عشر", email: "lena@example.com", avatar: "https://picsum.photos/200/300?random=5" },
  ]);

  // Detect system preference for dark mode
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Filter teachers by search term
  const filteredTeachers = teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    setTeachers(teachers.filter(teacher => teacher.id !== id));
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 flex h-16 items-center justify-between border-b px-6 shadow-sm ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h1 className="text-xl font-bold">المعلمون</h1>
        <div className="flex items-center space-x-4">
          <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>
          <button 
            onClick={() => router.push('/teachers/AddTeacherForm')} 
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            إضافة معلم
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            إدارة المعلمين
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
            عرض وتحديث بيانات المعلمين المسجلين في مدرسة فاطمة الزهراء الثانوية للبنات.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن معلم أو تخصص..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-4 pl-12 rounded-xl border focus:ring-2 focus:outline-none transition-all duration-300 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 focus:ring-indigo-500' 
                  : 'bg-white border-gray-300 focus:ring-indigo-300 shadow-md'
              }`}
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <SearchIcon />
            </div>
          </div>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-lg text-gray-500 dark:text-gray-400">لا يوجد معلمون يطابقون البحث.</p>
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div 
                key={teacher.id}
                className={`rounded-2xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                  darkMode ? 'bg-gray-800' : 'bg-white backdrop-blur-sm bg-opacity-80'
                }`}
              >
                <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
                    <Image
                    width={96}
                    height={96}
                    src={teacher.avatar} 
                    alt={teacher.name}
                    className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-24 h-24 rounded-full object-cover border-4 border-white"
                  />
                </div>
                <div className="pt-10 pb-6 px-6">
                  <h2 className="text-xl font-semibold">{teacher.name}</h2>
                  <p className="mt-1 text-indigo-600 dark:text-indigo-400">{teacher.subject}</p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{teacher.grade}</p>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{teacher.email}</p>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button 
                      onClick={() => router.push(`/teachers/edit/${teacher.id}`)} 
                      className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 transition"
                    >
                      <EditIcon />
                    </button>
                    <button 
                      onClick={() => handleDelete(teacher.id)} 
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

// Icons
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}