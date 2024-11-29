import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, address, phoneNumber } = req.body;

  if (!name || !address || !phoneNumber) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    // Load environment variables
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(
      /\\n/g,
      '\n'
    ); // Handle escaped newlines
    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Authenticate with Google API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Append data to the "Contacts" sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Contacts!A:C', // "Contacts" is the sheet name, adjust columns if necessary
      valueInputOption: 'RAW',
      resource: {
        values: [[name, address, phoneNumber]],
      },
    });

    res.status(200).json({ message: 'Contact added successfully' });
  } catch (error) {
    console.error('Error adding contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
