import { getSheetData } from '../../../../utils/sheets';
import styles from '../../../../styles/Table.module.css';

export default async function Home() {
  let dataRows = [];

  try {
    dataRows = await getSheetData();
  } catch (error) {
    console.error('Error fetching data:', error);
  }

  return (
    <div>
      <h1 className={`${styles.centered} ${styles.header}`}>
        درجات الأختبار الشهري
      </h1>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>FullName</th>
              <th>Class</th>
              <th>Course</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {dataRows && dataRows.length > 0 ? (
              dataRows.map((row, index) => (
                <tr key={index}>
                  <td>{row.FullName}</td>
                  <td>{row.Room}</td>
                  <td>{row.Course}</td>
                  <td>{row.Total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
