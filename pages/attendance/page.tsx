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
    <div dir='ltr'>
        <Navbar />
    <div className="container">
      <div className="header-section">
        <h1 className="header">نظام متابعة حضور الطالبات</h1>
        <div className="header-decoration"></div>
      </div>
      
      <div className="classroom-selector">
        <label className="label">اختار الصف المراد:</label>
        <div className="select-wrapper" >
          <select 
            value={selectedClassroom} 
            onChange={(e) => setSelectedClassroom(e.target.value)}
            disabled={classroomLoading}
            className="select"
          >
            <option value="">اختر الصف</option>
            {classrooms.map((classroom, index) => (
              <option key={index} value={classroom}>
                {classroom}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedClassroom && (
        <div className="student-list">
          <div className="section-header">
            <h2 className="subheader">طالبات صف {selectedClassroom}</h2>
            <div className="student-count">{students.length} طالبة</div>
          </div>
          
          <div className="table-container" dir='rtl'>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>اسم الطالبة</th>
                  <th>الصف</th>
                  <th>حالة الحضور</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={index} className="student-row">
                    <td className="student-name">{student[0]}</td>
                    <td className="classroom-cell">{student[1]}</td>
                    <td className="status-cells">
                      <button
                        onClick={() => handleStatusChange(student[0], 'present')}
                        className={`status-button present-btn ${
                          attendanceStatus[student[0]] === 'present' ? 'active' : ''
                        }`}
                        title="حاضر"
                      >
                        <CheckIcon />
                        <span>حاضر</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(student[0], 'absent')}
                        className={`status-button absent-btn ${
                          attendanceStatus[student[0]] === 'absent' ? 'active' : ''
                        }`}
                        title="غائب"
                      >
                        <XIcon />
                        <span>غائب</span>
                      </button>
                      <button
                        onClick={() => handleStatusChange(student[0], 'late')}
                        className={`status-button late-btn ${
                          attendanceStatus[student[0]] === 'late' ? 'active' : ''
                        }`}
                        title="متأخر"
                      >
                        <ClockIcon />
                        <span>متأخر</span>
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
            {loading ? (
              <>
                <LoadingSpinner />
                جاري الحفظ...
              </>
            ) : (
              <>
                <SaveIcon />
                حفظ الحضور
              </>
            )}
          </button>
        </div>
      )}

      {success && (
        <div className="success-message">
          <CheckIcon />
          تم حفظ الحضور بنجاح!
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <AlertIcon />
          {error}
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Marhey:wght@300..700&display=swap');
        
        * {
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Marhey', sans-serif;
          direction: rtl;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          margin: 0;
        }
      `}</style>

      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          min-height: 100vh;
        }

        .header-section {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
        }

        .header {
          font-size: 3rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          margin-bottom: 1rem;
          background: linear-gradient(45deg, #ffd700, #ffb347);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-decoration {
          width: 120px;
          height: 4px;
          background: linear-gradient(90deg, #ff6b6b, #4ecdc4, #45b7d1);
          margin: 0 auto;
          border-radius: 2px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .classroom-selector {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          
        }

        .label {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2d3748;
          min-width: 150px;
        }

        .select-wrapper {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .select {
          width: 100%;
          padding: 1rem 1.5rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          font-size: 1.1rem;
          font-family: 'Marhey', sans-serif;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .select:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          transform: translateY(-1px);
        }

        .student-list {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(15px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.3);
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 3px solid #f1f5f9;
        }

        .subheader {
          font-size: 2rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .student-count {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .table-container {
          overflow-x: auto;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          margin: 2rem 0;
        }

        .attendance-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          background: white;
          border-radius: 16px;
          overflow: hidden;
        }

        .attendance-table th {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 1.5rem;
          font-weight: 600;
          font-size: 1.1rem;
          text-align: center;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .student-row {
          transition: all 0.3s ease;
          position: relative;
        }

        .student-row:hover {
          background: linear-gradient(90deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
          transform: scale(1.01);
        }

        .attendance-table td {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
          text-align: center;
          vertical-align: middle;
        }

        .student-name {
          font-weight: 600;
          color: #2d3748;
          font-size: 1.1rem;
        }

        .classroom-cell {
          color: #718096;
          font-weight: 500;
        }

        .status-cells {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .status-button {
          padding: 0.75rem 1.25rem;
          border: 2px solid transparent;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          font-family: 'Marhey', sans-serif;
          font-weight: 500;
          font-size: 0.9rem;
          background: #f8fafc;
          color: #64748b;
          position: relative;
          overflow: hidden;
        }

        .status-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          transition: left 0.5s;
        }

        .status-button:hover::before {
          left: 100%;
        }

        .status-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .present-btn.active {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-color: #10b981;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
        }

        .absent-btn.active {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border-color: #ef4444;
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .late-btn.active {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border-color: #f59e0b;
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }

        .submit-button {
          background: linear-gradient(135deg, #4299e1, #3182ce);
          color: white;
          padding: 1.25rem 3rem;
          border: none;
          border-radius: 16px;
          font-size: 1.3rem;
          font-weight: 600;
          margin-top: 2rem;
          cursor: pointer;
          font-family: 'Marhey', sans-serif;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(66, 153, 225, 0.3);
          position: relative;
          overflow: hidden;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(66, 153, 225, 0.4);
        }

        .submit-button:disabled {
          background: linear-gradient(135deg, #a0aec0, #718096);
          cursor: not-allowed;
          transform: none;
        }

        .success-message {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          color: #065f46;
          padding: 1.5rem;
          border-radius: 16px;
          margin-top: 1.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-weight: 600;
          font-size: 1.1rem;
          border: 2px solid #10b981;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.2);
          animation: pulse 2s infinite;
        }

        .error-message {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          color: #991b1b;
          padding: 1.5rem;
          border-radius: 16px;
          margin-top: 1.5rem;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-weight: 600;
          font-size: 1.1rem;
          border: 2px solid #ef4444;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.2);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .loading-spinner {
          animation: spin 1s linear infinite;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }
          
          .header {
            font-size: 2rem;
          }
          
          .classroom-selector {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
          
          .label {
            min-width: auto;
          }
          
          .status-cells {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .status-button {
            justify-content: center;
          }
          
          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
    </div>
  );
}

// Icon components with enhanced styling
const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 6L6 18M6 6l12 12"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10"/>
    <path d="M12 6v6l4 2"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

const LoadingSpinner = () => (
  <svg className="loading-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.3"/>
    <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="10.29 3 21.71 3 16 14"/>
    <circle cx="12" cy="9" r="1"/>
    <path d="M12 17h.01"/>
  </svg>
);