'use client';

import { useState } from 'react';
import { Bill, BillFormData, BILL_CATEGORIES } from '@/types/bill';
import { Button, Input } from '@/components';
import Select from '@/components/ui/Select';

interface AddBillFormProps {
  onSubmit: (billData: Bill) => void;
  onCancel: () => void;
  editingBill?: Bill;
}

export default function AddBillForm({
  onSubmit,
  onCancel,
  editingBill,
}: AddBillFormProps) {
  const [formData, setFormData] = useState<BillFormData>({
    name: editingBill?.name || '',
    amount: editingBill?.amount.toString() || '',
    dueDate: editingBill?.dueDate.split('T')[0] || '', // Extract date part for input
    category: editingBill?.category || 'utilities',
    description: editingBill?.description || '',
  });

  const [errors, setErrors] = useState<Partial<BillFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<BillFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Bill name is required';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amount = parseFloat(formData.amount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.amount = 'Please enter a valid amount';
      }
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const billData: Bill = {
      id: editingBill?.id || crypto.randomUUID(),
      name: formData.name.trim(),
      amount: parseFloat(formData.amount),
      dueDate: new Date(formData.dueDate).toISOString(),
      category: formData.category,
      isPaid: editingBill?.isPaid || false,
      description: formData.description?.trim() || undefined,
      createdAt: editingBill?.createdAt || new Date().toISOString(),
      paidAt: editingBill?.paidAt,
    };

    onSubmit(billData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof BillFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        {editingBill ? 'Edit Bill' : 'Add New Bill'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            name="name"
            label="Bill Name"
            placeholder="e.g., Electric Bill"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            required
          />
        </div>

        <div>
          <Input
            type="number"
            name="amount"
            label="Amount"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={handleInputChange}
            error={errors.amount}
            required
          />
        </div>

        <div>
          <Input
            type="date"
            name="dueDate"
            label="Due Date"
            value={formData.dueDate}
            onChange={handleInputChange}
            error={errors.dueDate}
            required
          />
        </div>

        <div>
          <Select
            name="category"
            label="Category"
            options={BILL_CATEGORIES}
            value={formData.category}
            onChange={handleInputChange}
            required
          />
        </div>

        <div>
          <label className="text-gray-500 mb-1 block">Description (Optional)</label>
          <textarea
            name="description"
            placeholder="Add any notes about this bill..."
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="border border-gray-300 rounded-md p-2 w-full resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
          >
            {editingBill ? 'Update Bill' : 'Add Bill'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}