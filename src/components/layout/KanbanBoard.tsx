'use client';

import { Bill } from '@/types/bill';
import BillCard from '@/components/cards/BillCard';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { isAfter, isBefore, startOfDay } from 'date-fns';

interface KanbanBoardProps {
  bills: Bill[];
  onTogglePaid: (billId: string) => void;
  onEdit: (bill: Bill) => void;
  onDelete: (billId: string) => void;
  onMoveBill: (
    billId: string,
    newStatus: 'pending' | 'paid' | 'overdue'
  ) => void;
}

interface KanbanColumnProps {
  title: string;
  bills: Bill[];
  id: string;
  onTogglePaid: (billId: string) => void;
  onEdit: (bill: Bill) => void;
  onDelete: (billId: string) => void;
}

function KanbanColumn({
  title,
  bills,
  id,
  onTogglePaid,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 bg-gray-50 rounded-lg p-4 min-h-[400px] transition-colors duration-200 ${
        isOver ? 'bg-blue-50 border-2 border-blue-300' : ''
      }`}
    >
      <div className='flex items-center justify-between mb-4'>
        <h3 className='font-semibold text-gray-900'>{title}</h3>
        <span className='bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm font-medium'>
          {bills.length}
        </span>
      </div>
      <SortableContext
        items={bills.map((bill) => bill.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='space-y-3'>
          {bills.map((bill) => (
            <BillCard
              key={bill.id}
              bill={bill}
              onTogglePaid={onTogglePaid}
              onEdit={onEdit}
              onDelete={onDelete}
              displayMode='kanban'
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({
  bills,
  onTogglePaid,
  onEdit,
  onDelete,
  onMoveBill,
}: KanbanBoardProps) {
  const [activeBill, setActiveBill] = useState<Bill | null>(null);

  // Categorize bills into columns
  const categorizeBills = () => {
    const today = startOfDay(new Date());

    const paidBills = bills.filter((bill) => bill.isPaid);
    const overdueBills = bills.filter((bill) => {
      const dueDate = new Date(bill.dueDate);
      return !bill.isPaid && isBefore(dueDate, today);
    });
    const pendingBills = bills.filter((bill) => {
      const dueDate = new Date(bill.dueDate);
      return !bill.isPaid && !isBefore(dueDate, today);
    });

    return {
      paid: paidBills,
      overdue: overdueBills,
      pending: pendingBills,
    };
  };

  const { paid, overdue, pending } = categorizeBills();

  const handleDragStart = (event: DragStartEvent) => {
    const billId = event.active.id as string;
    const bill = bills.find((b) => b.id === billId);
    setActiveBill(bill || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBill(null);

    if (!over) return;

    const billId = active.id as string;
    const columnId = over.id as string;

    // Map column IDs to status
    const statusMap: { [key: string]: 'pending' | 'paid' | 'overdue' } = {
      'paid-column': 'paid',
      'overdue-column': 'overdue',
      'pending-column': 'pending',
    };

    const newStatus = statusMap[columnId];
    if (newStatus) {
      onMoveBill(billId, newStatus);
    }
  };

  if (bills.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='text-6xl mb-4'>📊</div>
        <h3 className='text-xl font-semibold text-gray-900 mb-2'>
          No bills to display
        </h3>
        <p className='text-gray-600'>Add a bill to get started</p>
      </div>
    );
  }

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
    >
      <div className='flex gap-6'>
        <KanbanColumn
          title='Pending'
          bills={pending}
          id='pending-column'
          onTogglePaid={onTogglePaid}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <KanbanColumn
          title='Overdue'
          bills={overdue}
          id='overdue-column'
          onTogglePaid={onTogglePaid}
          onEdit={onEdit}
          onDelete={onDelete}
        />
        <KanbanColumn
          title='Paid'
          bills={paid}
          id='paid-column'
          onTogglePaid={onTogglePaid}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <DragOverlay>
        {activeBill ? (
          <BillCard
            bill={activeBill}
            onTogglePaid={onTogglePaid}
            onEdit={onEdit}
            onDelete={onDelete}
            displayMode='kanban'
            className='opacity-50 rotate-3'
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
