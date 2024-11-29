'use client';
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import styles from '../../styles/Scanner.module.css';
import Navbar from '../../components/navbar';

export default function Scanner() {
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [serialNumber, setSerialNumber] = useState('');
  const [imei, setImei] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isClient, setIsClient] = useState(false); // Flag for client-only rendering

  useEffect(() => {
    setIsClient(true); // Set to true on the client
  }, []);

  useEffect(() => {
    async function fetchRooms() {
      const response = await fetch('/api/loadRooms');
      const data = await response.json();
      if (response.ok) {
        setRooms(data.rooms.map((room) => ({ value: room, label: room })));
      }
    }

    async function fetchStudents() {
      const response = await fetch('/api/loadStudents');
      const data = await response.json();
      if (response.ok) {
        setStudents(data.students);
      }
    }

    fetchRooms();
    fetchStudents();
  }, []);

  const handleRoomChange = (selected) => {
    setSelectedRoom(selected);

    const filtered = students.filter(
      (student) => student.room === selected.value
    );
    setFilteredStudents(
      filtered.map((student) => ({
        value: student.FullName,
        label: student.FullName,
      }))
    );
  };

  const handleSave = async () => {
    // Get current date and time
    const timestamp = new Date().toISOString(); // ISO format ensures consistency

    const response = await fetch('/api/saveData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        serialNumber,
        imei,
        FullName: selectedStudent?.value,
        room: selectedRoom?.value,
        timestamp, // Include timestamp in the payload
      }),
    });

    if (response.ok) {
      alert('Data saved successfully!');
      setSerialNumber('');
      setImei('');
      setSelectedRoom(null);
      setSelectedStudent(null);
    } else {
      alert('Failed to save data.');
    }
  };

  if (!isClient) return null; // Prevent SSR mismatches by avoiding rendering on the server

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h1>نموذج إدخال بيانات اجهزة التابلت</h1>
        <div className={styles['form-group']}>
          <label>الصف:</label>
          {isClient && (
            <Select
              className="react-select-container"
              options={rooms}
              onChange={handleRoomChange}
              value={selectedRoom}
            />
          )}
        </div>
        <div className={styles['form-group']}>
          <label>اسم الطالبة:</label>
          {isClient && (
            <Select
              className="react-select-container"
              options={filteredStudents}
              onChange={setSelectedStudent}
              value={selectedStudent}
            />
          )}
        </div>
        <div className={styles['form-group']}>
          <label>رقم السيريال:</label>
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </div>
        <div className={styles['form-group']}>
          <label>IMEI:</label>
          <input
            type="text"
            value={imei}
            onChange={(e) => setImei(e.target.value)}
          />
        </div>
        <button onClick={handleSave}>تسجيل البيانات</button>
      </div>
    </div>
  );
}
