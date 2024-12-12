import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth: jwt });

    if (req.method === 'GET') {
      const { classroom } = req.query;
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID, // Add your spreadsheet ID
        range: 'StudentsData!A1:Z', // Adjust to your actual data range
      });

      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return res
          .status(404)
          .json({ error: 'No data found in the spreadsheet.' });
      }

      const headerRow = rows[0];
      const columnMap = headerRow.reduce((acc, colName, index) => {
        acc[colName] = index;
        return acc;
      }, {});

      const filteredStudents = rows
        .slice(1)
        .filter((row) => row[columnMap['Classroom']] === classroom)
        .map((row) => ({
          Name: row[columnMap['Name']],
        }));

      return res.status(200).json(filteredStudents);
    }

    if (req.method === 'POST') {
      const { studentName, classroom, subject, evaluationData } = req.body;

      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID, // Add your spreadsheet ID
        range: 'Student_Evaluation!A1:F', // Adjust to your target sheet and range
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [
            [
              new Date().toLocaleDateString(), // Add timestamp
              classroom,
              studentName,
              subject,
              evaluationData.WeeklyEvaluation,
              evaluationData.Homework,
              evaluationData.Behavior,
              evaluationData.MonthlyExams,
            ],
          ],
        },
      });

      return res.status(200).json({ message: 'Data saved successfully' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
