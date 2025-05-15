import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: 'https://www.googleapis.com/auth/spreadsheets',
});

const sheets = google.sheets({ version: 'v4', auth });

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle classroom list
  if (req.method === 'GET' && req.query.type === 'classrooms') {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'StudentsData!B:B',
      });

      if (!response.data.values) {
        return res.status(200).json({ data: [] });
      }

      const classrooms = Array.from(new Set(
        response.data.values
          .slice(1) // Skip header
          .flat()
          .filter(Boolean)
      ));

      return res.status(200).json({ data: classrooms });
    } catch (error) {
      console.error('Classrooms Error:', error);
      return res.status(500).json({ 
        error: (error as any).message,
        details: (error as any).response?.data
      });
    }
  }
 // In pages/api/attendance.ts
if (req.method === 'GET' && req.query.type === 'attendance') {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Attendance!A2:D',
    });

    const data = (response.data.values || [])
      .map(row => ({
        date: row[0] || new Date().toISOString(),
        name: row[1]?.trim() || 'Unknown',
        classroom: row[2]?.trim() || 'Unknown',
        status: (row[3]?.trim() || 'غائب') // Handle missing status
      }))
      .filter(record => record.name !== 'Unknown'); // Filter out invalid rows

    return res.status(200).json({ 
      success: true, 
      data 
    });
  } catch (error) {
    console.error('Attendance Data Error:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Failed to fetch attendance data'
    });
  }
}

  // Handle student list
  if (req.method === 'GET' && req.query.type === 'students') {
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'StudentsData!A:B',
      });

      const students = (response.data.values || []).slice(1);
      const filtered = students.filter(
        student => student[1] === req.query.classroom
      );
      
      return res.status(200).json({ data: filtered });
    } catch (error) {
      console.error('Students Error:', error);
      return res.status(500).json({ 
        error: (error as any).message,
        details: (error as any).response?.data
      });
    }
  }

  // Handle attendance submission
  if (req.method === 'POST') {
    try {
      const records = req.body;

      if (!Array.isArray(records)) {
        return res.status(400).json({ error: "Invalid data format" });
      }

      const values = records.map(record => [
        new Date().toISOString(),
        record.name,
        record.classroom,
        record.status.toUpperCase() || 'PRESENT'
      ]);

      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'attendance!A:C',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });

      return res.status(200).json({ 
        success: true,
        inserted: response.data.updates?.updatedRows
      });

    } catch (error) {
      console.error('Submission Error:', error);
      return res.status(500).json({ 
        error: (error as Error).message,
        details: (error as any).response?.data
      });
    }
  }

  res.status(405).json({ message: 'Method not allowed' });
}