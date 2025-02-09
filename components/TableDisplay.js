"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TableDisplay = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        // Extract and decode Arabic text from JSON
        if (Array.isArray(jsonData) && jsonData.length > 0 && jsonData[0].table) {
          const table = jsonData.flatMap(item => item.table.map(row => ({
            cols: row.cols.map(col => col ? decodeUnicode(col) : "")
          })));

          setTableData(table);
          setIsLoaded(true);
        } else {
          alert("Invalid JSON format! Ensure it contains a 'table' key.");
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
        alert("Error parsing JSON file. Please upload a valid file.");
      }
    };

    reader.readAsText(file);
  };

  const decodeUnicode = (text) => {
    return text.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
      return String.fromCharCode(parseInt(match.replace("\\u", ""), 16));
    });
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.aoa_to_sheet(tableData.map((row) => row.cols));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "table_data.xlsx");
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload JSON & Export to Excel</h1>

      {/* File Input */}
      <div className="flex justify-center">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="border border-gray-400 rounded px-4 py-2 cursor-pointer"
        />
      </div>

      {/* Table Display */}
      {isLoaded && (
        <>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg mt-6">
            <table className="min-w-full border-collapse border border-gray-300 text-right">
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {row.cols.map((col, colIndex) => (
                      <td key={colIndex} className="px-4 py-2 border text-center">{col}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Download Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={exportToExcel}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Download as Excel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TableDisplay;
