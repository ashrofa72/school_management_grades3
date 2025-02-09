import TableDisplay from "../../components/TableDisplay";
import Link from "next/link";
export default function Home() {
  return (
    
      <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center">PDF to JSON Converter</h1>

      <div className="flex justify-center mt-6">
        <Link href="/pdf-to-json/" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Go to PDF Converter
        </Link>
      </div>
   
      <TableDisplay />
    </main>
  );
}
