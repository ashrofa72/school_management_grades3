import { google } from 'googleapis';

export async function getSheetData(Room, Subject) {
  try {
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth: jwt });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'combined_exams!A1:Z', // Adjust range to your sheet
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error('No data found in the spreadsheet.');
    }

    const headerRow = rows[0];
    const dataRows = rows.slice(1);

    const columnMap = headerRow.reduce((acc, colName, index) => {
      acc[colName] = index;
      return acc;
    }, {});

    const filteredAndSortedDataRows = dataRows
      .map((row) => ({
        FullName: row[columnMap['FullName']],
        Room: row[columnMap['Room']],
        Subject: row[columnMap['Subject']],
        StartDate: row[columnMap['StartDate']],
        SISUserID: row[columnMap['SISUserID']],
        Total: row[columnMap['Total']],
      }))
      .filter(
        (row) => row.Room === Room && row.Subject === Subject // Filter by both Room and Subject
      )
      .sort((a, b) => a.FullName.localeCompare(b.FullName));

    return filteredAndSortedDataRows;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw new Error('Error fetching Google Sheets data');
  }
}
