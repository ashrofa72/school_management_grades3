import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MarksForm() {
  const [classroom, setClassroom] = useState('');
  const [section, setSection] = useState('');
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [sections, setSections] = useState([]);
  const [studentData, setStudentData] = useState({
    studentName: '',
    classroom: '',
    section: '',
    subjects: {
      arabic: '',
      english1: '',
      english2: '',
      math: '',
      physics: '',
      chemistry: '',
      biology: '',
      religion: '',
      nationalEducation: '',
      skills: '',
      sports: '',
    },
    total: 0,
  });

  const classroomOptions = [
    { label: 'First Classroom', value: 'first' },
    { label: 'Second Classroom', value: 'second' },
  ];

  useEffect(() => {
    // Fetch students from Google Sheets API
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          'https://sheetdb.io/api/v1/0byef2y5zio60?sheet=StudentsData'
        );
        setStudents(response.data); // Store all student data
      } catch (error) {
        console.error('Error fetching students:', error.message);
      }
    };

    fetchStudents();
  }, []);

  const handleClassroomChange = (e) => {
    const selectedClassroom = e.target.value;
    setClassroom(selectedClassroom);

    if (selectedClassroom === 'first') {
      setSections(['1-1', '1-2', '1-3', '1-4', '1-5', '1-6', '1-7', '1-8']);
    } else if (selectedClassroom === 'second') {
      setSections(['2-1', '2-2', '2-3', '2-4', '2-5', '2-6', '2-7']);
    } else {
      setSections([]);
    }

    // Filter students based on classroom
    const classroomFilter = selectedClassroom === 'first' ? '1' : '2';
    const filtered = students.filter((student) =>
      student.Classroom.startsWith(classroomFilter)
    );
    setFilteredStudents(filtered);
  };

  const handleSectionChange = (e) => {
    const selectedSection = e.target.value;
    setSection(selectedSection);
    setStudentData((prev) => ({
      ...prev,
      section: selectedSection,
      studentName: '',
    }));
  };

  const handleStudentNameChange = (e) => {
    const selectedName = e.target.value;
    setStudentData((prev) => ({ ...prev, studentName: selectedName }));
  };

  const handleInputChange = (e, subject) => {
    const value = e.target.value;
    setStudentData((prev) => ({
      ...prev,
      subjects: {
        ...prev.subjects,
        [subject]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate total marks
    const totalMarks = Object.values(studentData.subjects).reduce(
      (total, mark) => total + (parseInt(mark, 10) || 0),
      0
    );
    setStudentData((prev) => ({ ...prev, total: totalMarks }));

    // Prepare payload for SheetDB
    const payload = {
      data: {
        Classroom: classroom,
        Section: section,
        'Student Name': studentData.studentName,
        Arabic: studentData.subjects.arabic,
        English1: studentData.subjects.english1,
        Math: studentData.subjects.math,
        // Add other subjects dynamically if needed
        Total: totalMarks,
      },
    };

    try {
      const response = await axios.post(
        'https://sheetdb.io/api/v1/0byef2y5zio60?sheet=Student_Evaluation',
        payload
      );
      console.log('Response from SheetDB:', response.data);
      alert('Marks saved successfully!');
    } catch (error) {
      console.error('Error saving marks:', error.message);
      console.error('Response details:', error.response?.data);
      alert('An error occurred while saving. Please check the console.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Student Marks Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Classroom</label>
          <select
            className="border w-full p-2"
            value={classroom}
            onChange={handleClassroomChange}
            required
          >
            <option value="">Select Classroom</option>
            {classroomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Section</label>
          <select
            className="border w-full p-2"
            value={section}
            onChange={handleSectionChange}
            required
            disabled={!classroom}
          >
            <option value="">Select Section</option>
            {sections.map((sec, index) => (
              <option key={index} value={sec}>
                {sec}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium">Student Name</label>
          <select
            className="border w-full p-2"
            value={studentData.studentName}
            onChange={handleStudentNameChange}
            required
            disabled={!section}
          >
            <option value="">Select Student</option>
            {filteredStudents.map((student, index) => (
              <option key={index} value={student.Name}>
                {student.Name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {Object.keys(studentData.subjects).map((subject, index) => (
            <div key={index} className="mb-4">
              <label className="block mb-2 font-medium capitalize">
                {subject.replace(/([A-Z])/g, ' $1')}
              </label>
              <input
                type="number"
                className="border w-full p-2"
                value={studentData.subjects[subject]}
                onChange={(e) => handleInputChange(e, subject)}
                min="0"
                max="100"
                required
              />
            </div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block font-medium">Total Marks</label>
          <input
            type="text"
            className="border w-full p-2"
            value={studentData.total}
            readOnly
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Save Marks
        </button>
      </form>
    </div>
  );
}
