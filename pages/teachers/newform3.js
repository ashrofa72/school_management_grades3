'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/navbar';

// Custom icon components using CSS and Unicode symbols
const Icons = {
  Users: () => <span className="text-xl">👥</span>,
  BookOpen: () => <span className="text-xl">📚</span>,
  School: () => <span className="text-xl">🏫</span>,
  Save: () => <span className="text-lg">💾</span>,
  CheckCircle: () => <span className="text-lg">✅</span>,
  AlertCircle: () => <span className="text-lg">⚠️</span>,
  Search: () => <span className="text-lg">🔍</span>,
};

export default function StudentEvaluationPage() {
  const [classrooms, setClassrooms] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [evaluationData, setEvaluationData] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [saveProgress, setSaveProgress] = useState({ current: 0, total: 0 });
  const [failedStudents, setFailedStudents] = useState([]);

  // Initialize evaluation data for all students
  const initializeEvaluationData = (studentsList) => {
    const initialData = {};
    studentsList.forEach((student) => {
      const studentName = student[0];
      initialData[studentName] = {
        WeeklyEvaluation: '',
        Homework: '',
        Behavior: '',
        MonthlyExams1: '',
        MonthlyExams2: '',
      };
    });
    setEvaluationData(initialData);
  };

  // Fetch user data on authentication
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          email: currentUser.email,
        });
      } else {
        console.error('No user is logged in.');
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch classrooms, subjects, and students
  useEffect(() => {
    const fetchTeacherAssignments = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const response = await fetch(
          `/api/googleSheets?email=${user.email}&classroom=${selectedClassroom}`,
          {
            headers: {
              'Cache-Control': 'no-cache',
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setClassrooms(data.classrooms || []);
          setSubjects(data.subjects || []);
          setStudents(data.students || []);
          
          // Initialize evaluation data for all students
          if (data.students && data.students.length > 0) {
            initializeEvaluationData(data.students);
          }
        } else {
          showNotification('فشل في تحميل البيانات', 'error');
        }
      } catch (error) {
        console.error('Error:', error);
        showNotification('حدث خطأ في تحميل البيانات', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherAssignments();
  }, [user, selectedClassroom]);

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Handle individual student data change
  const handleStudentDataChange = (studentName, field, value) => {
    setEvaluationData(prev => ({
      ...prev,
      [studentName]: {
        ...prev[studentName],
        [field]: value
      }
    }));
  };

  // Validate student data
  const validateStudentData = (data) => {
    const fields = ['WeeklyEvaluation', 'Homework', 'Behavior', 'MonthlyExams1', 'MonthlyExams2'];
    for (const field of fields) {
      const value = parseFloat(data[field]);
      if (data[field] !== '' && (isNaN(value) || value < 0 || value > 100)) {
        return false;
      }
    }
    return true;
  };

  // Save individual student data with enhanced error handling
  const saveStudentData = async (studentName, data, retryCount = 0) => {
    const maxRetries = 5; // Increased retry attempts
    
    try {
      console.log(`Attempt ${retryCount + 1} for ${studentName}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/studentsdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          classroom: selectedClassroom,
          studentName,
          subject: selectedSubject,
          evaluationData: data,
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Save successful for ${studentName}`);
      return { success: true, studentName, result };
      
    } catch (error) {
      console.error(`❌ Error saving data for ${studentName} (attempt ${retryCount + 1}):`, error);
      
      // Enhanced retry logic with different strategies
      if (retryCount < maxRetries) {
        const isNetworkError = error.name === 'AbortError' || error.message.includes('fetch');
        const isServerError = error.message.includes('500') || error.message.includes('503');
        const isRateLimit = error.message.includes('429') || error.message.includes('Too Many Requests');
        
        let retryDelay = 1000; // Base delay
        
        if (isRateLimit) {
          retryDelay = 3000 + (retryCount * 2000); // Longer delay for rate limiting
        } else if (isServerError) {
          retryDelay = 2000 + (retryCount * 1000); // Progressive delay for server errors
        } else if (isNetworkError) {
          retryDelay = 1500 + (retryCount * 500); // Shorter delay for network issues
        } else {
          retryDelay = 1000 + (retryCount * 1000); // Standard exponential backoff
        }
        
        console.log(`⏳ Retrying ${studentName} in ${retryDelay}ms (attempt ${retryCount + 2}/${maxRetries + 1})`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return saveStudentData(studentName, data, retryCount + 1);
      }
      
      console.error(`💥 Final failure for ${studentName} after ${maxRetries + 1} attempts`);
      return { success: false, studentName, error: error.message };
    }
  };

  // Handle form submission for all students
  const handleSubmitAll = async (e) => {
    e.preventDefault();
    
    if (!user || !selectedSubject) {
      showNotification('يرجى اختيار المادة أولاً', 'error');
      return;
    }

    if (!selectedClassroom) {
      showNotification('يرجى اختيار الفصل أولاً', 'error');
      return;
    }

    // Prepare students data for saving
    const studentsToSave = [];
    const validationErrors = [];

    Object.entries(evaluationData).forEach(([studentName, data]) => {
      // Check if at least one field has data
      const hasData = Object.values(data).some(value => value !== '');
      
      if (hasData) {
        // Validate the data
        if (!validateStudentData(data)) {
          validationErrors.push(studentName);
        } else {
          studentsToSave.push({ studentName, data });
        }
      }
    });

    if (validationErrors.length > 0) {
      showNotification(`بيانات غير صحيحة للطلاب: ${validationErrors.join(', ')}`, 'error');
      return;
    }

    if (studentsToSave.length === 0) {
      showNotification('لا توجد بيانات لحفظها', 'error');
      return;
    }

    console.log(`Starting to save data for ${studentsToSave.length} students:`, studentsToSave.map(s => s.studentName));

    setLoading(true);
    setSaveProgress({ current: 0, total: studentsToSave.length });

    try {
      const results = [];
      const successfulSaves = [];
      const failedSaves = [];

      // Process students one by one with detailed tracking
      const batchSize = 3; // Reduced batch size for better reliability
      for (let i = 0; i < studentsToSave.length; i += batchSize) {
        const batch = studentsToSave.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i/batchSize) + 1}: students ${i + 1} to ${Math.min(i + batchSize, studentsToSave.length)}`);
        
        // Process each student in the batch sequentially for better error tracking
        for (const { studentName, data } of batch) {
          try {
            console.log(`Attempting to save data for: ${studentName}`);
            const result = await saveStudentData(studentName, data);
            results.push(result);
            
            if (result.success) {
              successfulSaves.push(result);
              console.log(`✅ Successfully saved: ${studentName}`);
            } else {
              failedSaves.push(result);
              console.log(`❌ Failed to save: ${studentName}`, result.error);
            }
            
            // Update progress after each student
            setSaveProgress(prev => ({ 
              ...prev, 
              current: prev.current + 1
            }));
            
            // Small delay between individual saves to prevent overwhelming
            await new Promise(resolve => setTimeout(resolve, 300));
            
          } catch (error) {
            console.error(`Error processing ${studentName}:`, error);
            const failedResult = { success: false, studentName, error: error.message };
            results.push(failedResult);
            failedSaves.push(failedResult);
            
            setSaveProgress(prev => ({ 
              ...prev, 
              current: prev.current + 1
            }));
          }
        }

        // Longer delay between batches
        if (i + batchSize < studentsToSave.length) {
          console.log('Waiting before next batch...');
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Detailed logging
      console.log('=== SAVE OPERATION COMPLETE ===');
      console.log('Total students to save:', studentsToSave.length);
      console.log('Successfully saved:', successfulSaves.length);
      console.log('Failed to save:', failedSaves.length);
      console.log('Successful students:', successfulSaves.map(s => s.studentName));
      console.log('Failed students:', failedSaves.map(s => s.studentName));
      
      if (failedSaves.length > 0) {
        console.log('Failure details:', failedSaves.map(f => ({ name: f.studentName, error: f.error })));
      }

      // Show results with more detailed feedback
      if (successfulSaves.length === studentsToSave.length) {
        showNotification(`✅ تم حفظ بيانات جميع الطلاب بنجاح (${successfulSaves.length} طالب)`, 'success');
        setFailedStudents([]); // Clear failed students
        // Reset form after successful save
        initializeEvaluationData(students);
        setSelectedSubject('');
      } else if (successfulSaves.length > 0) {
        const failedNames = failedSaves.map(f => f.studentName).slice(0, 5); // Show first 5 failed names
        const additionalCount = failedSaves.length > 5 ? ` و ${failedSaves.length - 5} آخرين` : '';
        setFailedStudents(failedSaves); // Store failed students for retry
        showNotification(
          `⚠️ تم حفظ ${successfulSaves.length} من ${studentsToSave.length} طالب. فشل حفظ: ${failedNames.join(', ')}${additionalCount}`, 
          'error'
        );
      } else {
        setFailedStudents(failedSaves); // Store failed students for retry
        showNotification('❌ فشل في حفظ جميع البيانات', 'error');
      }

      // Offer retry for failed saves
      if (failedSaves.length > 0 && failedSaves.length < studentsToSave.length) {
        console.log('Some saves failed. Consider implementing a retry mechanism for failed saves.');
      }

    } catch (error) {
      console.error('Critical error in handleSubmitAll:', error);
      showNotification('حدث خطأ خطير أثناء حفظ البيانات', 'error');
    } finally {
      setLoading(false);
      setSaveProgress({ current: 0, total: 0 });
    }
  };

  // Retry failed saves
  const retryFailedSaves = async () => {
    if (failedStudents.length === 0) return;
    
    console.log(`Retrying ${failedStudents.length} failed saves...`);
    setLoading(true);
    setSaveProgress({ current: 0, total: failedStudents.length });
    
    try {
      const retryResults = [];
      const newFailures = [];
      
      for (const failedStudent of failedStudents) {
        const studentData = evaluationData[failedStudent.studentName];
        if (studentData) {
          console.log(`Retrying save for: ${failedStudent.studentName}`);
          const result = await saveStudentData(failedStudent.studentName, studentData);
          retryResults.push(result);
          
          if (!result.success) {
            newFailures.push(result);
          }
          
          setSaveProgress(prev => ({ 
            ...prev, 
            current: prev.current + 1
          }));
          
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      const retrySuccesses = retryResults.filter(r => r.success);
      
      if (retrySuccesses.length === failedStudents.length) {
        showNotification(`✅ تم حفظ جميع البيانات المتبقية بنجاح (${retrySuccesses.length} طالب)`, 'success');
        setFailedStudents([]);
      } else if (retrySuccesses.length > 0) {
        showNotification(`تم حفظ ${retrySuccesses.length} من ${failedStudents.length} طالب في المحاولة الثانية`, 'success');
        setFailedStudents(newFailures);
      } else {
        showNotification('فشل في إعادة حفظ البيانات', 'error');
        setFailedStudents(newFailures);
      }
      
    } catch (error) {
      console.error('Error in retry operation:', error);
      showNotification('حدث خطأ أثناء إعادة المحاولة', 'error');
    } finally {
      setLoading(false);
      setSaveProgress({ current: 0, total: 0 });
    }
  };
  const hasDataToSave = () => {
    return Object.values(evaluationData).some(studentData => 
      Object.values(studentData).some(value => value !== '')
    );
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student[0].toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar/>
      
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <Icons.CheckCircle /> : <Icons.AlertCircle />}
          {notification.message}
        </div>
      )}

      {/* Progress Bar */}
      {loading && saveProgress.total > 0 && (
        <div className="fixed top-16 left-4 right-4 z-40 bg-white rounded-lg shadow-lg p-4">
          <div className="text-sm text-gray-600 mb-2">
            جاري حفظ البيانات: {saveProgress.current} من {saveProgress.total}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(saveProgress.current / saveProgress.total) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-none w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">نموذج إدخال درجات التقييم</h1>
          <p className="text-gray-600">إدارة وتقييم درجات الطلاب بطريقة حديثة وفعالة</p>
        </div>

        <form onSubmit={handleSubmitAll} className="space-y-6">
          {/* Selection Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 w-full">
            {/* Classroom Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Icons.School />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">اختيار الفصل</h3>
              </div>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right"
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                disabled={!classrooms.length || loading}
              >
                <option value="">اختر الفصل</option>
                {classrooms.map((classroom, index) => (
                  <option key={index} value={classroom}>
                    {classroom}
                  </option>
                ))}
              </select>
            </div>

            {/* Subject Selection */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Icons.BookOpen />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">اختيار المادة</h3>
              </div>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-right"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                disabled={!subjects.length || loading}
              >
                <option value="">اختر المادة</option>
                {subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Students Table */}
          {students.length > 0 && selectedClassroom && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden w-full" dir="rtl">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icons.Users />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      درجات الطلاب ({filteredStudents.length} طالب)
                    </h3>
                  </div>
                  
                  {/* Search Bar */}
                  <div className="relative">
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Icons.Search />
                    </div>
                    <input
                      type="text"
                      placeholder="البحث عن طالب..."
                      className="pr-12 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-right"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto w-full">
                <table className="w-full min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 border-b sticky right-0 bg-gray-50">
                        اسم الطالب
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700 border-b min-w-[120px]">
                        التقييم الأسبوعي<br />
                        <span className="text-xs text-gray-500">(15%)</span>
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700 border-b min-w-[120px]">
                        الواجب والحصة<br />
                        <span className="text-xs text-gray-500">(15%)</span>
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700 border-b min-w-[120px]">
                        السلوك والمواظبة<br />
                        <span className="text-xs text-gray-500">(10%)</span>
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700 border-b min-w-[120px]">
                        الاختبار الأول<br />
                        <span className="text-xs text-gray-500">(30%)</span>
                      </th>
                      <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700 border-b min-w-[120px]">
                        الاختبار الثاني<br />
                        <span className="text-xs text-gray-500">(30%)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => {
                      const studentName = student[0];
                      return (
                        <tr 
                          key={index} 
                          className={`hover:bg-gray-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                          }`}
                        >
                          <td className="px-6 py-4 font-medium text-gray-900 border-b text-right sticky right-0 bg-inherit">
                            {studentName}
                          </td>
                          <td className="px-4 py-4 border-b">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              className="w-full p-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              value={evaluationData[studentName]?.WeeklyEvaluation || ''}
                              onChange={(e) => handleStudentDataChange(studentName, 'WeeklyEvaluation', e.target.value)}
                              placeholder="0-100"
                            />
                          </td>
                          <td className="px-4 py-4 border-b">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              className="w-full p-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              value={evaluationData[studentName]?.Homework || ''}
                              onChange={(e) => handleStudentDataChange(studentName, 'Homework', e.target.value)}
                              placeholder="0-100"
                            />
                          </td>
                          <td className="px-4 py-4 border-b">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              className="w-full p-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              value={evaluationData[studentName]?.Behavior || ''}
                              onChange={(e) => handleStudentDataChange(studentName, 'Behavior', e.target.value)}
                              placeholder="0-100"
                            />
                          </td>
                          <td className="px-4 py-4 border-b">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              className="w-full p-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              value={evaluationData[studentName]?.MonthlyExams1 || ''}
                              onChange={(e) => handleStudentDataChange(studentName, 'MonthlyExams1', e.target.value)}
                              placeholder="0-100"
                            />
                          </td>
                          <td className="px-4 py-4 border-b">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              className="w-full p-2 text-center border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              value={evaluationData[studentName]?.MonthlyExams2 || ''}
                              onChange={(e) => handleStudentDataChange(studentName, 'MonthlyExams2', e.target.value)}
                              placeholder="0-100"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Submit Button */}
          {students.length > 0 && (
            <div className="flex flex-col items-center gap-4">
              {hasDataToSave() && (
                <div className="text-sm text-gray-600 text-center">
                  سيتم حفظ البيانات للطلاب الذين تم إدخال درجات لهم فقط
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || !selectedSubject || !hasDataToSave()}
                  className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
                >
                  <Icons.Save />
                  {loading ? (
                    saveProgress.total > 0 
                      ? `جاري الحفظ... (${saveProgress.current}/${saveProgress.total})`
                      : 'جاري الحفظ...'
                  ) : 'حفظ جميع البيانات'}
                </button>
                
                {/* Retry Button for Failed Saves */}
                {failedStudents.length > 0 && !loading && (
                  <button
                    type="button"
                    onClick={retryFailedSaves}
                    className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                  >
                    <Icons.AlertCircle />
                    إعادة محاولة ({failedStudents.length})
                  </button>
                )}
              </div>
              
              {/* Failed Students Info */}
              {failedStudents.length > 0 && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                  <p className="text-red-700 font-medium mb-2">
                    فشل حفظ بيانات {failedStudents.length} طالب:
                  </p>
                  <p className="text-red-600 text-sm">
                    {failedStudents.map(f => f.studentName).join(', ')}
                  </p>
                  <p className="text-red-500 text-xs mt-2">
                    اضغط على إعادة محاولة لحفظ البيانات المتبقية
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {students.length === 0 && selectedClassroom && !loading && (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Icons.Users />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">لا توجد طلاب</h3>
              <p className="text-gray-500">لم يتم العثور على طلاب في هذا الفصل</p>
            </div>
          )}

          {/* Loading State */}
          {loading && saveProgress.total === 0 && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}