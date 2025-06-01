// App.jsx - Modern Colorful School Management Dashboard

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter(); // Initialize router

  // Sample data
  const stats = [
    { name: 'Students', value: '1,234', icon: 'users', change: '+12%', color: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
    { name: 'Teachers', value: '89', icon: 'chalkboard', change: '+5%', color: 'bg-gradient-to-br from-purple-500 to-pink-500' },
    { name: 'Classes', value: '36', icon: 'book', change: '0%', color: 'bg-gradient-to-br from-green-500 to-teal-500' },
    { name: 'Attendance', value: '97.4%', icon: 'calendar', change: '-0.5%', color: 'bg-gradient-to-br from-yellow-500 to-orange-500' },
  ];

  const recentActivities = [
    { id: 1, action: 'New student registered', time: '2 hours ago', user: 'John Doe' },
    { id: 2, action: 'Exam results published', time: '4 hours ago', user: 'Math Department' },
    { id: 3, action: 'Parent-teacher meeting scheduled', time: '6 hours ago', user: 'Sarah Johnson' },
    { id: 4, action: 'Library book returned', time: '1 day ago', user: 'Michael Brown' },
  ];

  const quickActions = [
    { id: 1, title: 'Add New Student', icon: 'user-plus' },
    { id: 2, title: 'Schedule Exam', icon: 'file-text' },
    { id: 3, title: 'Send Notification', icon: 'bell' },
    { id: 4, title: 'View Timetable', icon: 'clock' },
  ];

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex transition-all duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform overflow-hidden rounded-r-3xl shadow-lg ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          darkMode ? 'bg-gray-800' : 'bg-gradient-to-b from-indigo-600 via-blue-500 to-purple-600'
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <h1 className="text-2xl font-extrabold text-white">SchoolAdmin</h1>
          <button onClick={() => setIsSidebarOpen(false)} className="rounded-md p-2 text-white hover:bg-black/20 lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-10 px-4 space-y-1">
          <NavItem icon={<DashboardIcon />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<StudentsIcon />} label="Students" active={activeTab === 'students'} onClick={() => { setActiveTab('students'); router.push('/students/page'); }}  />
          <NavItem icon={<TeachersIcon />} label="Teachers" active={activeTab === 'teachers'} onClick={() => { setActiveTab('teachers'); router.push('/teachers/ourteachers'); }} />
          <NavItem icon={<ClassesIcon />} label="Classes" active={activeTab === 'classes'} onClick={() => { setActiveTab('classes'); router.push('/students/page'); }} />
          <NavItem icon={<CalendarIcon />} label="Calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
          <NavItem icon={<SettingsIcon />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className={`sticky top-0 z-10 flex h-16 items-center justify-between border-b px-6 shadow-sm transition-colors duration-300 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center">
            <button onClick={() => setIsSidebarOpen(true)} className="rounded-md p-2 text-gray-500 focus:outline-none lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="ml-4 text-xl font-bold">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          </div>

          <div className="flex items-center space-x-6">
            <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              {darkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <BellIcon />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="flex items-center">
              <Image src="https://picsum.photos/200/300?random=1" width={100} height={100} alt="User avatar" className="h-8 w-8 rounded-full object-cover" />
              <span className="ml-2 hidden md:inline">Admin User</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} darkMode={darkMode} />
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Activities */}
            <div className={`rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-6 shadow-lg transition-transform duration-300 hover:scale-102`}>
              <h3 className="mb-4 text-lg font-semibold">Recent Activities</h3>
              <ul className="space-y-4">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="flex items-start group">
                    <div className={`mr-3 mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-gray-700' : 'bg-indigo-100 group-hover:bg-indigo-200'
                    }`}>
                      <ActivityIcon />
                    </div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{activity.time}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.user}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Actions & Calendar Preview */}
            <div className={`col-span-1 rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-6 shadow-lg lg:col-span-2 transition-transform duration-300 hover:scale-102`}>
              <h3 className="mb-4 text-lg font-semibold">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {quickActions.map((action) => (
                  <button 
                    key={action.id}
                    className="group flex flex-col items-center rounded-xl p-4 transition-all duration-200 hover:shadow-lg"
                  >
                    <div className="mb-2 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                      {action.icon === 'user-plus' && <UserPlusIcon />}
                      {action.icon === 'file-text' && <FileTextIcon />}
                      {action.icon === 'bell' && <BellIcon />}
                      {action.icon === 'clock' && <ClockIcon />}
                    </div>
                    <span className="text-sm font-medium">{action.title}</span>
                  </button>
                ))}
              </div>
              
              {/* Calendar Preview */}
              <div className="mt-6">
                <h4 className="mb-3 text-sm font-medium">Upcoming Events</h4>
                <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={`py-2 text-center text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {day}
                    </div>
                  ))}
                  {[...Array(35)].map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-12 p-1 text-right text-xs ${
                        darkMode ? 'bg-gray-800' : 'bg-white'
                      } ${i % 7 === 0 || i % 7 === 6 ? 'opacity-50' : ''}`}
                    >
                      {i >= 28 ? '' : i - 27}
                      {i >= 1 && i <= 5 && (
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center rounded-lg px-4 py-3 mb-2 transition-all duration-200 transform hover:translate-x-1 ${
        active 
          ? 'bg-white/20 backdrop-blur-sm text-white ring-1 ring-white/30' 
          : 'text-white hover:bg-white/10'
      }`}
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function StatCard({ name, value, icon, change, color, darkMode }) {
  const icons = {
    users: <UsersIcon />,
    chalkboard: <ChalkboardIcon />,
    book: <BookIcon />,
    calendar: <CalendarIcon />,
  };
  
  return (
    <div className={`rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 ${color} text-white`}>
      <div className="flex items-center">
        <div className="mr-4 h-10 w-10 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm">
          {icons[icon]}
        </div>
        <div>
          <p className="text-sm font-medium opacity-90">{name}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={`${change.startsWith('+') ? 'text-green-300' : 'text-red-300'}`}>{change}</span>
        <span className="ml-2 opacity-80">from last month</span>
      </div>
    </div>
  );
}

// Icons
function DashboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function StudentsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function TeachersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ClassesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function ChalkboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function ActivityIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

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