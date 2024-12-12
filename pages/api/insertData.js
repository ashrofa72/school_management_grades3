import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { weeklyEvaluation, homework, behaviour, monthlyExam } = req.body;

    console.log('Received data:', {
      weeklyEvaluation,
      homework,
      behaviour,
      monthlyExam,
    });

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email:
          'school-marks@school-monthly-grades.iam.gserviceaccount.com',
        private_key:
          '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDDylWVbJvpiU3w\niQs/Sop1LinVZ6xjFJ1Ngf23NTJd3kTtdxQmMHdS3jtpZ2jfWC9wTJOD1q+ekwDa\nYLdsiJRkUUVDy5PB7RWr2G5V/2nCPQvehzcZajJLpSMurhpidfIdhiWKjj3XsYUL\n70uYQDABbiSOX0NEmu7piWvACcRzN2ik8MbIT/BOM/1kCikPuhffb1DFmiCsusDd\nWeeDgGREDxHftP5S5HMSkbDQT6X/d0VOliSbJWCMjRwM7ehF7F9LMYmAPDGdp5od\nCVHlZatRmX5hmM9tGE1dt+pO2rUFDMLQSN3s7a0RwvHti4bTHkRXi0em06yYmZPR\nCOpgiM/HAgMBAAECggEAYcRH7zkQM9It2qY8OQsKT5BRMHC4CrPRBtKZ9GG6eFgU\nuDVlmNpLw1QYe745Bon9CkkawlMyV+9VFjcEcMxUuTFB8qQV8NjoIOsO0Z+cWnNs\nWV7Quz6lxdM82cLzhuYZk/eYCHOV2v6YjsibyXeH4Tb0Rym3p+rr0S8fYIIgGF2b\ngbzRGijzzLgWUIFH0ZKLhJYUWHy1Q2DL8t94VSoorRi7tcwn0DRaQeT3H01CH08G\nmJoybYvsTQ8095DEG47uytO28ofGVgzaXBATJJ6nW9ywjv18uieM9Zdr0qKQekQ0\nljE41LR47iPCmN7Ir5oKj+H/sDvrGPNyDj1g6FSJ2QKBgQDoiz5TfbhTEZmVLv1f\nHWNN3uINq6+hIn/3Wrsiehd8RB4jvpBfEsA86rt3idD0+8fBzgN3zVKo647a/X6p\nSvTUZ0eu/+74o9lS6goGS2nwDkuKxk98GOdVRYR3pGnIQRe59S+OeJHpdBxrwuLX\nSz3XFig5ea4uB2l0gWwtvsIXPwKBgQDXigoatzqTbQC0GxD4sCcV+4RlSyK7tgk2\nZW892ECZ74Kn5sOByKMzZW06YVPW8CS6nJ1mTe2M19JxdfXSUT0bSVaECBneMQM6\n9ho1ICGt59Z8GT8OfAylzpg/TkaMeFKOM5QSKyfaG+UPdPuZ8vCFRYNNvclOS2vf\nIu8IqZpteQKBgAmDULxnoze6u5avwmu2rw5LdOHsSRYFbEi5LHifmABcZQM/U3ag\nNL8JNzwPpj2vYx+ZhujKvHvujvyEbD8Osu9Rfkw5ahQ/168dpeVWBnJsk0iNDklc\nV3JUkrO2RSGNECRqVFS2t/ld55+87Dy0dkYrQOABC1AUu4qplLxWVmhPAoGBAMSQ\n51Yl9A2vQwz+AiRKwdqSXtPiCfMWuKAbMbA9H+1DOOzWz0X1LKEaxtqPGF7U8yoc\n2o8KUrI3wXwoD9+WpxvTbktK+Axitod3Gb+JZi2rWTgj7hXPm9k66C4TvNMuiFuX\nPlqzcMzA082c6jgkDqX8Fxs3EfeNYPtGaKiFxIhBAoGAJLDS3TxFDYhu+2jZzGdC\nMKZj1aCZGQt0NXk/ZpEvmQItYnDV+PZcp0XvhHQ08DJ3VitsIeBrviFelAZ8VyoJ\nGFpiaM6aqTHcORdO8llvnORmvgI56F8M6gpY/V69IsFx0p+9s5IEdfeUAsaJwoFS\nPbZb0lkrCEl3srBG7HGkhcI=\n-----END PRIVATE KEY-----\n',
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    console.log('Auth created successfully');

    const sheets = google.sheets({ version: 'v4', auth });

    // Your actual spreadsheet ID
    const spreadsheetId = '10BzoAxaSy-qnD95M51MsH2hYVen26bBQ97VbVkiyhDM';

    const values = [[weeklyEvaluation, homework, behaviour, monthlyExam]];

    console.log('Attempting to append values:', values);

    try {
      const response = sheets.spreadsheets.values.append({
        spreadsheetId,
        range: 'Student_Evaluation!A:D',
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      console.log('Sheets API Response:', response.data);
      res.status(200).json({
        message: 'Data inserted successfully',
        response: response.data,
      });
    } catch (sheetsError) {
      console.error('Sheets API Error:', sheetsError.message);
      res.status(500).json({
        message: 'Error inserting data into sheets',
        error: sheetsError.message,
      });
    }
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
}
