import { google } from 'googleapis';

export async function getSheetData(Room, Subject, Month) {
  try {
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth: jwt });

    // Construct the sheet name dynamically based on Room, Subject, and Month
    const sheetName = `${Subject}${Month}${Room}`;
    console.log(`Fetching data from sheet: ${sheetName}`);

    // Fetch metadata to determine the last row and column in the dynamic sheet
    const metadata = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      fields: 'sheets.properties',
    });

    // Find the sheet ID to verify if the sheet exists
    const sheetExists = metadata.data.sheets.some(
      (sheet) => sheet.properties.title === sheetName
    );

    if (!sheetExists) {
      throw new Error(`Sheet "${sheetName}" not found.`);
    }

    // Fetch values from the dynamically named sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: `${sheetName}!A1:j`, // Dynamic sheet name
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

    if (!columnMap['Month']) {
      throw new Error('Month column not found in the spreadsheet.');
    }

    // Filter the data based on Room, Subject, and Month
    const filteredAndSortedDataRows = dataRows
      .map((row) => ({
        FullName: row[columnMap['FullName']],
        Room: row[columnMap['Room']],
        Subject: row[columnMap['Course']],
        StartDate: row[columnMap['StartDate']],
        SISUserID: row[columnMap['SISUserID']],
        Total: row[columnMap['Total']],
        Month: row[columnMap['Month']],
      }))
      .filter(
        (row) =>
          row.Room === Room && row.Subject === Subject && row.Month === Month
      )
      .sort((a, b) => a.FullName.localeCompare(b.FullName));

    return filteredAndSortedDataRows;
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw new Error('Error fetching Google Sheets data');
  }
}
