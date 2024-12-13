'use client';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import Navbar from '../../components/navbar';
import styles from '../../styles/MarksInsertion.module.css';

export default function StudentEvaluationPage() {
  const [classrooms, setClassrooms] = useState([
    '2-1',
    '2-2',
    '2-3',
    '2-4',
    '2-5',
    '2-6',
    '2-7',
  ]);
  const [subjects, setSubjects] = useState(['English', 'Biology', 'Chemistry']);
  const [students, setStudents] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
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
        <h1>Student Evaluation</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.filters}>
            <select
              className={styles.dropdown}
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
            >
              <option value="">Select Classroom</option>
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
              <option value="">Select Student</option>
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
              <option value="">Select Subject</option>
              {subjects.map((subject, index) => (
                <option key={index} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Weekly Evaluation</label>
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
            <label>Homework</label>
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
            <label>Behavior</label>
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
            <label>Monthly Exams</label>
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
            Save Evaluation
          </button>
        </form>
      </div>
    </div>
  );
}
