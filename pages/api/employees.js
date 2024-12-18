import { google } from 'googleapis';

export default async function handler(req, res) {
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
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Employee_Data!A1:H',
    });

    const [headers, ...rows] = data.values;
    const employees = rows.map((row) => ({
      Name: row[0],
      Position: row[1],
      Level: row[2],
      Birth_Date: row[3],
      Appointment_Date: row[4],
      Starting_Date: row[5],
      Address: row[6],
      Phone: row[7],
    }));

    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
