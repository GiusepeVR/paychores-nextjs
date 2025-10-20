import { Bill, BILL_CATEGORIES } from '@/types/bill';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';
import { useDraggable } from '@dnd-kit/core';

export type DisplayMode = 'grid' | 'list' | 'kanban';

interface BillCardProps {
  bill: Bill;
  className?: string;
  displayMode?: DisplayMode;
  onTogglePaid?: (billId: string) => void;
  onEdit?: (bill: Bill) => void;
  onDelete?: (billId: string) => void;
}

export default function BillCard({
  bill,
  className = '',
  displayMode = 'grid',
  onTogglePaid,
  onEdit,
  onDelete,
}: BillCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: bill.id,
      disabled: displayMode !== 'kanban',
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;
  const dueDate = new Date(bill.dueDate);
  const today = startOfDay(new Date());
  const isOverdue = isBefore(dueDate, today) && !bill.isPaid;
  const isDueSoon =
    isAfter(dueDate, today) &&
    isBefore(dueDate, new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)); // due within 7 days

  const categoryLabel =
    BILL_CATEGORIES.find((cat) => cat.value === bill.category)?.label ||
    bill.category;

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

  const getCardClasses = () => {
    const baseClasses = `border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${getStatusColor()} ${className}`;

    if (displayMode === 'list') {
      return `${baseClasses} p-3 flex items-center justify-between`;
    } else if (displayMode === 'kanban') {
      return `${baseClasses} p-3 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : ''
      }`;
    }

    return `${baseClasses} p-4`;
  };

  const renderListMode = () => (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={getCardClasses()}
    >
      <div className='flex items-center space-x-4'>
        <span className='text-xl'>{getCategoryIcon(bill.category)}</span>
        <div className='flex-1'>
          <h3 className='font-semibold text-gray-900'>{bill.name}</h3>
          <p className='text-sm text-gray-600'>{categoryLabel}</p>
        </div>
        <div className='text-right'>
          <p className='text-sm text-gray-600'>
            Due: {format(dueDate, 'MMM dd, yyyy')}
          </p>
          <span className='font-bold text-lg text-gray-900'>
            ${bill.amount.toFixed(2)}
          </span>
        </div>
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

      <div className='flex space-x-2'>
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
        <button
          onClick={() => onEdit?.(bill)}
          className='px-3 py-1 rounded text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200'
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(bill.id)}
          className='px-3 py-1 rounded text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200'
        >
          Delete
        </button>
      </div>
    </div>
  );

  const renderKanbanMode = () => (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={getCardClasses()}
    >
      <div className='mb-2'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-lg'>{getCategoryIcon(bill.category)}</span>
          <span className='font-bold text-lg text-gray-900'>
            ${bill.amount.toFixed(2)}
          </span>
        </div>
        <h3 className='font-semibold text-gray-900 text-sm mb-1'>
          {bill.name}
        </h3>
        <p className='text-xs text-gray-600'>{categoryLabel}</p>
      </div>

      <div className='mb-3'>
        <p className='text-xs text-gray-600'>
          Due: {format(dueDate, 'MMM dd')}
        </p>
        {bill.description && (
          <p className='text-xs text-gray-600 mt-1 truncate'>
            {bill.description}
          </p>
        )}
      </div>

      <div className='flex justify-between items-center'>
        <button
          onClick={() => onTogglePaid?.(bill.id)}
          className={`px-2 py-1 rounded text-xs font-medium transition-colors duration-200 ${
            bill.isPaid
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {bill.isPaid ? 'Unpaid' : 'Paid'}
        </button>

        <div className='flex space-x-1'>
          <button
            onClick={() => onEdit?.(bill)}
            className='px-2 py-1 rounded text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200'
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(bill.id)}
            className='px-2 py-1 rounded text-xs font-medium text-red-600 hover:bg-red-50 transition-colors duration-200'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  const renderGridMode = () => (
    <div className={getCardClasses()}>
      <div className='flex items-start justify-between mb-3'>
        <div className='flex items-center space-x-3'>
          <span className='text-2xl'>{getCategoryIcon(bill.category)}</span>
          <div>
            <h3 className='font-semibold text-gray-900 text-lg'>{bill.name}</h3>
            <p className='text-sm text-gray-600'>{categoryLabel}</p>
          </div>
        </div>
        <div className='flex flex-col items-end space-y-2'>
          <span className='font-bold text-xl text-gray-900'>
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

      <div className='mb-3'>
        <p className='text-sm text-gray-600'>
          <span className='font-medium'>Due:</span>{' '}
          {format(dueDate, 'MMM dd, yyyy')}
        </p>
        {bill.description && (
          <p className='text-sm text-gray-600 mt-1'>
            <span className='font-medium'>Note:</span> {bill.description}
          </p>
        )}
      </div>

      <div className='flex justify-between items-center'>
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

        <div className='flex space-x-2'>
          <button
            onClick={() => onEdit?.(bill)}
            className='px-3 py-1 rounded text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-200'
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(bill.id)}
            className='px-3 py-1 rounded text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-200'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  if (displayMode === 'list') {
    return renderListMode();
  } else if (displayMode === 'kanban') {
    return renderKanbanMode();
  }

  return renderGridMode();
}
