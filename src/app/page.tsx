'use client';

import { useState } from 'react';
import { Button, BillCard, AddBillForm } from '@/components';
import { useBills, useBillStats, useFilteredBills } from '@/hooks/useBills';
import { Bill, BillCategory, BILL_CATEGORIES } from '@/types/bill';

export default function Home() {
  const { bills, loading, addBill, updateBill, deleteBill, togglePaid } = useBills();
  const stats = useBillStats(bills);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | undefined>();
  const [filterCategory, setFilterCategory] = useState<BillCategory | ''>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'unpaid'>('all');
  
  const filters = {
    ...(filterCategory && { category: filterCategory }),
    ...(filterStatus !== 'all' && { isPaid: filterStatus === 'paid' }),
  };
  
  const filteredBills = useFilteredBills(bills, filters, 'dueDate', 'asc');

  const handleAddBill = (billData: Bill) => {
    addBill(billData);
    setShowAddForm(false);
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    setShowAddForm(true);
  };

  const handleUpdateBill = (billData: Bill) => {
    updateBill(billData);
    setEditingBill(undefined);
    setShowAddForm(false);
  };

  const handleCancelForm = () => {
    setShowAddForm(false);
    setEditingBill(undefined);
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>PayChores</h1>
          <p className='text-gray-600'>Manage your bills and never miss a payment</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Bills</p>
                <p className='text-2xl font-semibold text-gray-900'>{stats.total}</p>
              </div>
              <div className='text-blue-500 text-2xl'>📋</div>
            </div>
          </div>
          
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Overdue</p>
                <p className='text-2xl font-semibold text-red-600'>{stats.overdue}</p>
              </div>
              <div className='text-red-500 text-2xl'>⚠️</div>
            </div>
          </div>
          
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Due Soon</p>
                <p className='text-2xl font-semibold text-yellow-600'>{stats.dueSoon}</p>
              </div>
              <div className='text-yellow-500 text-2xl'>⏰</div>
            </div>
          </div>
          
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600'>Total Amount</p>
                <p className='text-2xl font-semibold text-gray-900'>${stats.totalAmount.toFixed(2)}</p>
              </div>
              <div className='text-green-500 text-2xl'>💰</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
          <div className='flex flex-wrap gap-4'>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as BillCategory | '')}
              className='border border-gray-300 rounded-md px-3 py-2 text-sm'
            >
              <option value="">All Categories</option>
              {BILL_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'paid' | 'unpaid')}
              className='border border-gray-300 rounded-md px-3 py-2 text-sm'
            >
              <option value="all">All Bills</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          
          <Button
            onClick={() => setShowAddForm(true)}
            variant="primary"
            leftIcon={<span>+</span>}
          >
            Add Bill
          </Button>
        </div>

        {/* Bills Grid */}
        {filteredBills.length === 0 ? (
          <div className='text-center py-12'>
            <div className='text-6xl mb-4'>📝</div>
            <h3 className='text-xl font-semibold text-gray-900 mb-2'>
              {bills.length === 0 ? 'No bills yet' : 'No bills match your filters'}
            </h3>
            <p className='text-gray-600 mb-6'>
              {bills.length === 0 
                ? 'Add your first bill to get started' 
                : 'Try adjusting your filters or add a new bill'
              }
            </p>
            {bills.length === 0 && (
              <Button onClick={() => setShowAddForm(true)} variant="primary">
                Add Your First Bill
              </Button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredBills.map(bill => (
              <BillCard
                key={bill.id}
                bill={bill}
                onTogglePaid={togglePaid}
                onEdit={handleEditBill}
                onDelete={deleteBill}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Bill Modal */}
      {showAddForm && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
          <div className='max-w-md w-full'>
            <AddBillForm
              onSubmit={editingBill ? handleUpdateBill : handleAddBill}
              onCancel={handleCancelForm}
              editingBill={editingBill}
            />
          </div>
        </div>
      )}
    </div>
  );
}
