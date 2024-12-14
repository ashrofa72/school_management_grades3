import { google } from 'googleapis';

const sheets = google.sheets('v4');

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { email, classroom } = req.query;

    try {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(
            /\\n/g,
            '\n'
          ),
          client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      const authClient = await auth.getClient();
      const spreadsheetId = process.env.SPREADSHEET_ID;

      // Fetch teacher assignments for classrooms and subjects
      const range = 'TeacherAssignments!A1:D'; // Assuming this sheet contains teacher info
      const response = await sheets.spreadsheets.values.get({
        auth: authClient,
        spreadsheetId,
        range,
      });

      // Process classrooms and subjects
      const classrooms = [];
      const subjects = [];

      response.data.values.forEach((row) => {
        if (row[1] === email) {
          // Filter by teacher's email
          classrooms.push(row[2]); // Add classroom to list
          subjects.push(row[3]); // Add subject to list
        }
      });

      // Log to ensure the email and classrooms are correctly retrieved
      console.log('Teacher classrooms:', classrooms);
      console.log('Teacher subjects:', subjects);

      // Fetch students if classroom is specified
      let students = [];
      if (classroom) {
        const studentRange = 'StudentsData!A1:B'; // Fetch students' names and classroom info
        const studentResponse = await sheets.spreadsheets.values.get({
          auth: authClient,
          spreadsheetId,
          range: studentRange,
        });

        // Log the full student response for debugging
        console.log('Student Data:', studentResponse.data.values);

        // Filter students based on the selected classroom
        students = studentResponse.data.values.filter(
          (row) => row[1] === classroom
        ); // row[1] is the Classroom column
        console.log('Filtered Students:', students);
      }

      res.status(200).json({ classrooms, subjects, students });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
