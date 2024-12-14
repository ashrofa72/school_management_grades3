import { google } from 'googleapis';

export default async function handler(req, res) {
  try {
    // Initialize JWT with the required credentials
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth: jwt });

    if (req.method === 'GET') {
      const { email: queryEmail } = req.query; // Rename email parameter to avoid conflict

      // Fetch data from the Google Sheets API
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'TeacherAssignments!A1:C',
      });

      // Check if data is present
      if (!response.data.values || response.data.values.length === 0) {
        return res.status(404).json({ error: 'No data found' });
      }

      const rows = response.data.values.slice(1); // Skip header row
      const assignments = rows
        .filter(([email]) => email === queryEmail) // Compare with queryEmail
        .map(([_, subject, classroom]) => ({ subject, classroom }));

      return res.status(200).json(assignments);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
