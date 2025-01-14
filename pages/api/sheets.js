import { getSheetData } from '../../utils/sheets';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { Room, Subject, Month } = req.query;

      // Validate query parameters
      if (!Room || !Subject || !Month) {
        return res.status(400).json({
          error: 'Room, Subject, and Month parameters are required',
        });
      }

      // Fetch data from Google Sheets using the utils function
      const data = await getSheetData(Room, Subject, Month);

      res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching Google Sheets data:', error);
      res
        .status(500)
        .json({ error: error.message || 'Error fetching Google Sheets data' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ error: 'Method not allowed' });
  }
}
