'use client';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import Navbar from '../../components/navbar';
import styles from '../../styles/MarksInsertion.module.css';

export default function StudentEvaluationPage() {
  const [firstClassrooms, setFirstClassrooms] = useState([
    'الصف الأول',
    'الصف الثاني',
  ]);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedFirstClassroom, setSelectedFirstClassroom] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [subjects, setSubjects] = useState([
    'انجليزي',
    'احياء',
    'كيمياء',
    'فيزياء',
    'جغرافيا',
  ]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [evaluationData, setEvaluationData] = useState({
    WeeklyEvaluation: '',
    Homework: '',
    Behavior: '',
    MonthlyExams: '',
  });
  const [user, setUser] = useState(null);

  // Fetch user data
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

  useEffect(() => {
    async function fetchStudents() {
      if (selectedClassroom) {
        try {
          const response = await fetch(
            `/api/studentsdata?classroom=${selectedClassroom}`
          );
          if (response.ok) {
            const data = await response.json();
            setStudents(data);
          } else {
            console.error('Failed to load students.');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      }
    }
    fetchStudents();
  }, [selectedClassroom]);

  const handleFirstClassroomChange = (e) => {
    const value = e.target.value;
    setSelectedFirstClassroom(value);

    // Update classrooms based on the selected first classroom
    if (value === 'الصف الأول') {
      setClassrooms(['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8']);
    } else if (value === 'الصف الثاني') {
      setClassrooms(['2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7']);
    } else {
      setClassrooms([]); // Clear classrooms if no valid selection
    }
  };

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
            {/* First Dropdown Menu */}
            <select
              className={styles.dropdown}
              value={selectedFirstClassroom}
              onChange={handleFirstClassroomChange}
            >
              <option value="">اختار المرحلة</option>
              {firstClassrooms.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Second Dropdown Menu */}
            <select
              className={styles.dropdown}
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
              disabled={!classrooms.length}
            >
              <option value="">اختار الفصل</option>
              {classrooms.map((classroom) => (
                <option key={classroom} value={classroom}>
                  {classroom}
                </option>
              ))}
            </select>

            <select
              className={styles.dropdown}
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              disabled={!students.length}
            >
              <option value="">اختار اسم الطالبة</option>
              {students.map((student, index) => (
                <option key={index} value={student.Name}>
                  {student.Name}
                </option>
              ))}
            </select>

            <select
              className={styles.dropdown}
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value="">اختار المادة</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
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
            <label>درجة اختبار الشهرين 30%</label>
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
            حفظ الدرجات
          </button>
        </form>
      </div>
    </div>
  );
}
