function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h2 className={`text-4xl font-bold mt-2 ${color}`}>
        {value}
      </h2>

    </div>
  );
}

export default SummaryCard;