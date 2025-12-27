const StatusBadge = ({ status }) => {
  const colors = {
    Draft: "bg-gray-100 text-gray-700 border-gray-200",
    Approved: "bg-primary/10 text-primary border-primary/20",
    "Partially Received": "bg-yellow-100 text-yellow-700 border-yellow-200",
    Completed: "bg-green-100 text-green-700 border-green-200",
  };
  return (
    <span className={`text-[11px] p-1 border ${colors[status]}`}>{status}</span>
  );
};

export default StatusBadge;