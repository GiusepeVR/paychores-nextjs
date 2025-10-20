import { Bill } from '@/types/bill';
import BillCard from '@/components/cards/BillCard';

interface ListViewProps {
  bills: Bill[];
  onTogglePaid: (billId: string) => void;
  onEdit: (bill: Bill) => void;
  onDelete: (billId: string) => void;
}

export default function ListView({
  bills,
  onTogglePaid,
  onEdit,
  onDelete,
}: ListViewProps) {
  if (bills.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-6xl mb-4'>📝</div>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          No bills to display
        </h3>
        <p className='text-gray-600'>Add a bill to get started</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {bills.map((bill) => (
        <BillCard
          key={bill.id}
          bill={bill}
          onTogglePaid={onTogglePaid}
          onEdit={onEdit}
          onDelete={onDelete}
          displayMode='list'
        />
      ))}
    </div>
  );
}
