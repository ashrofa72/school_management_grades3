import { google } from 'googleapis';

export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(
          /\\n/g,
          '\n'
        ),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const range = 'TeacherAssignments!A:K'; // Update with your specific range

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    // Assuming the email is in the first column (index 0)
    const headers = rows[0];
    const emailColumnIndex = headers.indexOf('name'); // Adjust based on your header name
    const assignmentsColumnIndex = headers.indexOf('email'); // Adjust based on your header name

    if (emailColumnIndex === -1 || assignmentsColumnIndex === -1) {
      return res
        .status(500)
        .json({ error: 'Required columns not found in the sheet' });
    }

    const userAssignments = rows
      .slice(1) // Skip the header row
      .filter((row) => row[emailColumnIndex] === email)
      .map((row) => ({
        email: row[emailColumnIndex],
        assignments: row[assignmentsColumnIndex],
      }));

    if (userAssignments.length === 0) {
      return res
        .status(404)
        .json({ error: 'No assignments found for this user' });
    }

    return res.status(200).json({ assignments: userAssignments });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
