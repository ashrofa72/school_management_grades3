import React, { useState, useEffect } from 'react';
import { useSheet } from '@sheety/react';

const StudentReportCard = () => {
  const { data, loading, error } = useSheet({
    // Replace with your Google Sheet URL
    url: 'https://sheet.new/api/v1/sheets/your-sheet-id/data',
    // Specify the column names to fetch from Google Sheet
    columns: [
      'Name',
      'Roll No',
      'Subject 1',
      'Subject 2',
      'Subject 3',
      'Total',
    ],
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="report-card">
      {/* School and Academic Details */}
      <div className="header">
        <div className="school-name">
          {/* Replace with actual school name */}
          <span>Directorate of Education, Cairo Governorate</span>
        </div>
        <div className="academic-details">
          {/* Replace with actual academic details */}
          <span>Academic Year: 2023-2024</span>
          <span>Term: First</span>
          <span>Grade: 10</span>
        </div>
      </div>

      {/* Student Information */}
      <div className="student-info">
        {/* Replace with actual student information */}
        <span>Student Name:</span>
        <span>Roll No:</span>
      </div>

      {/* Table for Subjects and Grades */}
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Max Marks</th>
            <th>Min Marks</th>
            <th>Grade</th>
            <th>Teacher's Remarks</th>
          </tr>
        </thead>
        <tbody>
          {data.map((student) => (
            <tr key={student.Roll_No}>
              <td>{student.Subject_1}</td>
              <td>{student.Max_Marks_1}</td>
              <td>{student.Min_Marks_1}</td>
              <td>{student.Grade_1}</td>
              <td>
                <input type="text" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Overall Performance */}
      <div className="performance">
        {/* Replace with actual performance details */}
        <span>Overall Grade:</span>
        <span>Attendance:</span>
        <span>Behavior and Conduct:</span>
      </div>

      {/* Signatures and Date */}
      <div className="signatures">
        <span>Principal's Signature:</span>
        <span>Class Teacher's Signature:</span>
        <span>Date:</span>
      </div>
    </div>
  );
};

export default StudentReportCard;
