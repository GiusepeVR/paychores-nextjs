import { Bill, BILL_CATEGORIES } from '@/types/bill';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

interface BillCardProps {
  bill: Bill;
  className?: string;
  onTogglePaid?: (billId: string) => void;
  onEdit?: (bill: Bill) => void;
  onDelete?: (billId: string) => void;
}

export default function BillCard({
  bill,
  className = '',
  onTogglePaid,
  onEdit,
  onDelete,
}: BillCardProps) {
  const dueDate = new Date(bill.dueDate);
  const today = startOfDay(new Date());
  const isOverdue = isBefore(dueDate, today) && !bill.isPaid;
  const isDueSoon = isAfter(dueDate, today) && 
    isBefore(dueDate, new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)); // due within 7 days

  const categoryLabel = BILL_CATEGORIES.find(cat => cat.value === bill.category)?.label || bill.category;

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      utilities: '⚡',
      rent: '🏠',
      insurance: '🛡️',
      subscriptions: '📱',
      loans: '💰',
      'credit-cards': '💳',
      phone: '📞',
      internet: '🌐',
      groceries: '🛒',
      transportation: '🚗',
      healthcare: '🏥',
      other: '📋',
    };
    return icons[category] || '📋';
  };

  const getStatusColor = () => {
    if (bill.isPaid) return 'bg-green-50 border-green-200';
    if (isOverdue) return 'bg-red-50 border-red-200';
    if (isDueSoon) return 'bg-yellow-50 border-yellow-200';
    return 'bg-white border-gray-200';
  };

  const getStatusBadge = () => {
    if (bill.isPaid) return 'bg-green-100 text-green-800';
    if (isOverdue) return 'bg-red-100 text-red-800';
    if (isDueSoon) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div
      className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 ${getStatusColor()} ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getCategoryIcon(bill.category)}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{bill.name}</h3>
            <p className="text-sm text-gray-600">{categoryLabel}</p>
          </div>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className="font-bold text-xl text-gray-900">
            ${bill.amount.toFixed(2)}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge()}`}
          >
            {bill.isPaid
              ? 'Paid'
              : isOverdue
              ? 'Overdue'
              : isDueSoon
              ? 'Due Soon'
              : 'Pending'}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Due:</span>{' '}
          {format(dueDate, 'MMM dd, yyyy')}
        </p>
        {bill.description && (
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Note:</span> {bill.description}
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => onTogglePaid?.(bill.id)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
            bill.isPaid
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {bill.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
        </button>

        <div className="flex space-x-2">
          <button
            onClick={() => onEdit?.(bill)}
            className="px-3 py-1 rounded text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(bill.id)}
            className="px-3 py-1 rounded text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}