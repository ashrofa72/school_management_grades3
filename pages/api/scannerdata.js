import { getScannerSheetData } from '../../utils/scannerdata';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch data from Google Sheets using the utility function
      const data = await getScannerSheetData();

      // Return the data in the response
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
