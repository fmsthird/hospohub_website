export default function StatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Approved':
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Under review':
      case 'May be required':
      case 'Expiring soon':
        return 'bg-yellow-100 text-yellow-800';
      case 'Action required':
      case 'Required':
        return 'bg-red-100 text-red-800';
      case 'Uploaded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles()}`}>
      {status}
    </span>
  );
}
