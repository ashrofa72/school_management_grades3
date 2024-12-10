import { google } from 'googleapis';

export async function getScannerSheetData() {
  try {
    // Authenticate with Google API
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

    // Define spreadsheet ID and range
    const spreadsheetId = process.env.SPREADSHEET_ID; // Replace with your spreadsheet ID
    const range = 'ScannerData!A:E'; // Adjust the range to match your columns

    // Fetch data from the Google Sheets
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // Convert rows to JSON objects
    const headers = rows[0]; // First row contains headers
    const data = rows.slice(1).map((row) =>
      headers.reduce((acc, header, index) => {
        acc[header] = row[index] || ''; // Fill missing values with empty string
        return acc;
      }, {})
    );

    return data;
  } catch (error) {
    console.error('Error fetching ScannerData sheet:', error);
    throw new Error('Failed to fetch ScannerData sheet.');
  }
}
