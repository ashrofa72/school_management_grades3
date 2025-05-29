import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Extract form data from the request body
      const {
        displayName,
        email,
        classroom,
        studentName,
        subject,
        evaluationData,
      } = req.body;

      // Calculate the sum of evaluation entries
      const { WeeklyEvaluation, Homework, Behavior, MonthlyExams1,MonthlyExams2 } =
        evaluationData;
      const totalScore =
        (parseFloat(WeeklyEvaluation) || 0) +
        (parseFloat(Homework) || 0) +
        (parseFloat(Behavior) || 0) +
        (parseFloat(MonthlyExams1) || 0) +
        (parseFloat(MonthlyExams2) || 0);

      // Authenticate with Google Sheets API
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(
            /\\n/g,
            '\n'
          ),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const sheets = google.sheets({ version: 'v4', auth });

      // Spreadsheet ID and range to write data
      const spreadsheetId = process.env.SPREADSHEET_ID;
      const range = 'Student_Evaluation!A:K'; // Adjust to match your sheet structure

      // Prepare the row data to append
      const row = [
        displayName,
        email,
        classroom,
        studentName,
        subject,
        WeeklyEvaluation,
        Homework,
        Behavior,
        MonthlyExams1,
        MonthlyExams2,
        totalScore, // Include the total score
      ];

      // Append data to the sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: [row],
        },
      });

      res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
      console.error('Error saving data to Google Sheets:', error);
      res.status(500).json({ error: 'Error saving data to Google Sheets' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
