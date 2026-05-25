const STATUS_STYLES = {
  Draft: {
    light: 'bg-gray-100 text-gray-700 border-gray-200',
    cssVar: false,
  },
  Approved: {
    light: 'bg-primary/10 text-primary border-primary/20',
    cssVar: false,
  },
  'Partially Received': {
    light: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    cssVar: false,
  },
  Completed: {
    light: 'bg-green-100 text-green-700 border-green-200',
    cssVar: false,
  },
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Draft;
  return (
    <span className={`text-[11px] px-1.5 py-0.5 rounded border font-medium ${style.light}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
