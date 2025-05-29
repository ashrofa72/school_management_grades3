import { useState, useEffect } from 'react';
import Navbar from '../../components/navbar';


export default function Home() {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [classroomLoading, setClassroomLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch classrooms
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch('/api/attendance?type=classrooms');
        const data = await response.json();
        setClassrooms(data.data || []);
      } catch (error) {
        console.error(error);
        setError('Failed to load classrooms');
      } finally {
        setClassroomLoading(false);
      }
    };
    fetchClassrooms();
  }, []);

  // Fetch students when classroom changes
  useEffect(() => {
    if (!selectedClassroom) return;

    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `/api/attendance?type=students&classroom=${selectedClassroom}`
        );
        const data = await response.json();
        setStudents(data.data || []);
        
        // Initialize attendance status
        const initialStatus: Record<string, string> = {};
        data.data.forEach((student: [string, string]) => {
          initialStatus[student[0]] = 'pending';
        });
        setAttendanceStatus(initialStatus);
      } catch (error) {
        console.error(error);
        setError('Failed to load students');
      }
    };
    fetchStudents();
  }, [selectedClassroom]);

  const handleStatusChange = (studentName: string, status: string) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentName]: status
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const attendanceRecords = Object.entries(attendanceStatus)
        .filter(([_, status]) => status !== 'pending')
        .map(([name, status]) => ({
          name,
          status,
          classroom: selectedClassroom // Add classroom to each record
        }));

      if (attendanceRecords.length === 0) {
        throw new Error('Please select attendance for at least one student');
      }

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceRecords),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save attendance');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reset statuses
      const resetStatuses: Record<string, string> = {};
      Object.keys(attendanceStatus).forEach(name => {
        resetStatuses[name] = 'pending';
      });
      setAttendanceStatus(resetStatuses);

    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div >
        <Navbar />
    <div className="container">
      <h1 className="header">نظام متابعة حضور الطالبات</h1>
      
      <div className="classroom-selector">
        <label className="label">اختار الصف المراد:</label>
        <select 
          value={selectedClassroom} 
          onChange={(e) => setSelectedClassroom(e.target.value)}
          disabled={classroomLoading}
          className="select"
        >
          <option value="">Select a class</option>
          {classrooms.map((classroom, index) => (
            <option key={index} value={classroom}>
              {classroom}
            </option>
          ))}
        </select>
      </div>

      {selectedClassroom && (
        <div className="student-list">
          <h2 className="subheader">طالبات صف {selectedClassroom}</h2>
          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>اسم الطالبه</th>
                  <th>الصف</th>
                  <th>حالة الحضور</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td>{student[0]}</td>
                    <td>{student[1]}</td>
                    <td className="status-cells">
                      <button
                        onClick={() => handleStatusChange(student[0], 'present')}
                        className={`status-button ${
                          attendanceStatus[student[0]] === 'present' ? 'active present' : ''
                        }`}
                      >
                        <CheckIcon />
                      </button>
                      <button
                        onClick={() => handleStatusChange(student[0], 'absent')}
                        className={`status-button ${
                          attendanceStatus[student[0]] === 'absent' ? 'active absent' : ''
                        }`}
                      >
                        <XIcon />
                      </button>
                      <button
                        onClick={() => handleStatusChange(student[0], 'late')}
                        className={`status-button ${
                          attendanceStatus[student[0]] === 'late' ? 'active late' : ''
                        }`}
                      >
                        <ClockIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="submit-button"
          >
            {loading ? 'Saving...' : 'حفظ الحضور'}
          </button>
        </div>
      )}

      {success && <div className="success-message">Attendance saved successfully!</div>}
      {error && <div className="error-message">⚠️ {error}</div>}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Marhey:wght@300..700&display=swap');
        
        body {
          font-family: 'Marhey', sans-serif;
          direction: rtl;
          background-color: #f8fafc;
        }
      `}</style>

      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 2rem;
        }

        .header {
          font-size: 2.5rem;
          color: #1e3a8a;
          text-align: center;
          margin-bottom: 2rem;
        }

        .classroom-selector {
          margin: 2rem 0;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .select {
          padding: 0.75rem 1.5rem;
          border: 2px solid #cbd5e1;
          border-radius: 8px;
          background: white;
          font-size: 1.1rem;
          width: 300px;
        }

        .student-list {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .attendance-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          
        }

        .attendance-table th,
        .attendance-table td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          text-align: center;
        }

        .status-cells {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-start;
        }

        .status-button {
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .status-button.active {
          color: white;
          border-color: transparent;
        }

        .status-button.present.active {
          background: #10b981;
        }

        .status-button.absent.active {
          background: #ef4444;
        }

        .status-button.late.active {
          background: #f59e0b;
        }

        .submit-button {
          background: #3b82f6;
          color: white;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1.5rem;
          margin-top: 1rem;
          cursor: pointer;
          font-family: 'Marhey', sans-serif;
        }

        .submit-button:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .success-message {
          background: #dcfce7;
          color: #166534;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
        }

        .error-message {
          background: #fee2e2;
          color: #991b1b;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
          text-align: center;
        }

        .icon {
          width: 1.25rem;
          height: 1.25rem;
        }
      `}</style>
    </div>
    </div>
  );
}

// Icon components
const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);