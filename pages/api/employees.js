import { google } from 'googleapis';

export default async function handler(req, res) {
  const { email } = req.query;

  // Check if email query parameter is provided
  if (!email) {
    return res.status(400).json({ error: 'Email query parameter is required' });
  }

  try {
    // Authenticate with Google Sheets API
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

    // Get data from the TeacherAssignments sheet
    const { data } = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'TeacherAssignments!A1:K', // Adjust the range to match columns in the Google Sheets
    });

    const [headers, ...rows] = data.values;

    // Ensure the required headers exist
    const requiredHeaders = [
      'name',
      'email',
      'classroom',
      'subject',
      'position',
      'level',
      'birth_date',
      'appointment_date',
      'starting_date',
      'address',
      'phone',
    ];

    const missingHeaders = requiredHeaders.filter(
      (header) => !headers.includes(header)
    );
    if (missingHeaders.length > 0) {
      return res.status(400).json({
        error: `Missing required headers in spreadsheet: ${missingHeaders.join(
          ', '
        )}`,
      });
    }

    // Map rows to objects with column names as keys
    const employees = rows.map((row) =>
      headers.reduce((acc, header, index) => {
        acc[header.toLowerCase()] = row[index] || ''; // Default to empty string if value is missing
        return acc;
      }, {})
    );

    // Filter employees based on email
    const filteredEmployees = employees.filter(
      (employee) => employee.email === email.toLowerCase()
    );

    if (filteredEmployees.length === 0) {
      return res
        .status(404)
        .json({ error: 'No data found for the given email' });
    }

    // Return the filtered employee data
    res.status(200).json(filteredEmployees);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
