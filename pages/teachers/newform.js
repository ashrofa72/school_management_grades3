'use client';

import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Navbar from '../../components/navbar';
import styles from '../../styles/MarksInsertion.module.css';

export default function StudentEvaluationPage() {
  const [classrooms, setClassrooms] = useState([]); // Classrooms for the teacher
  const [subjects, setSubjects] = useState([]); // Subjects for the teacher
  const [students, setStudents] = useState([]); // Students in the selected classroom
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [evaluationData, setEvaluationData] = useState({
    WeeklyEvaluation: '',
    Homework: '',
    Behavior: '',
    MonthlyExams: '',
  });
  const [user, setUser] = useState(null); // Logged-in user data

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

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Fetch classrooms, subjects, and students based on the logged-in teacher
  useEffect(() => {
    console.log('Selected Classroom:', selectedClassroom);
    const fetchTeacherAssignments = async () => {
      if (!user) return;

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
          console.log('Fetched data:', data);
          setClassrooms(data.classrooms || []);
          setSubjects(data.subjects || []);
          setStudents(data.students || []);
        } else {
          console.error('Failed to fetch data.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTeacherAssignments();
  }, [user, selectedClassroom]); // Dependency on selectedClassroom to refetch data

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('User is not logged in.');
      return;
    }

    try {
      const response = await fetch('/api/studentsdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          classroom: selectedClassroom,
          studentName: selectedStudent,
          subject: selectedSubject,
          evaluationData,
        }),
      });

      if (response.ok) {
        alert('Data saved successfully.');
        setEvaluationData({
          WeeklyEvaluation: '',
          Homework: '',
          Behavior: '',
          MonthlyExams: '',
        });
        setSelectedSubject('');
      } else {
        console.error('Failed to save data.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1>نموذج ادخال درجات التقييم</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.filters}>
            {/* Classroom Dropdown Menu */}
            <select
              className={styles.dropdown}
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              disabled={!classrooms.length}
            >
              <option value="">اختار الفصل</option>
              {classrooms.length ? (
                classrooms.map((classroom, index) => (
                  <option key={index} value={classroom}>
                    {classroom}
                  </option>
                ))
              ) : (
                <option disabled>لا توجد فصول</option>
              )}
            </select>

            {/* Student Dropdown Menu */}
            <select
              className={styles.dropdown}
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!students.length}
            >
              <option value="">اختار اسم الطالبة</option>
              {students.length ? (
                students.map((student, index) => (
                  <option key={index} value={student[0]}>
                    {student[0]} {/* Assuming the first element is the Name */}
                  </option>
                ))
              ) : (
                <option disabled>لا توجد طلاب</option>
              )}
            </select>

            {/* Subject Dropdown Menu */}
            <select
              className={styles.dropdown}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!subjects.length}
            >
              <option value="">اختار المادة</option>
              {subjects.length ? (
                subjects.map((subject, index) => (
                  <option key={index} value={subject}>
                    {subject}
                  </option>
                ))
              ) : (
                <option disabled>لا توجد مواد</option>
              )}
            </select>
          </div>

          {/* Evaluation Inputs */}
          <div className={styles.formGroup}>
            <label>التقييم الأسبوعي 15%</label>
            <input
              type="number"
              value={evaluationData.WeeklyEvaluation}
              onChange={(e) =>
                setEvaluationData((prev) => ({
                  ...prev,
                  WeeklyEvaluation: e.target.value,
                }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>كشكول الحصة والواجب 15%</label>
            <input
              type="number"
              value={evaluationData.Homework}
              onChange={(e) =>
                setEvaluationData((prev) => ({
                  ...prev,
                  Homework: e.target.value,
                }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>السلوك والمواظبة 10%</label>
            <input
              type="number"
              value={evaluationData.Behavior}
              onChange={(e) =>
                setEvaluationData((prev) => ({
                  ...prev,
                  Behavior: e.target.value,
                }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label>الاختبار الشهري 30%</label>
            <input
              type="number"
              value={evaluationData.MonthlyExams}
              onChange={(e) =>
                setEvaluationData((prev) => ({
                  ...prev,
                  MonthlyExams: e.target.value,
                }))
              }
            />
          </div>

          <button type="submit" className={styles.button}>
            حفظ البيانات
          </button>
        </form>
      </div>
    </div>
  );
}
