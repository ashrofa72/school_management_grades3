import StudentEvaluationTable from '../../components/StudentEvaluationTable';

export default function Home() {
  return (
    <div>
      <h1 className="text-xl font-bold text-center pt-5">بيان تقييم الطالب</h1>
      <StudentEvaluationTable />
    </div>
  );
}
