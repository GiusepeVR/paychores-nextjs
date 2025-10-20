'use client';

import { useState, useEffect } from 'react';
import { Bill, BillFilters, SortBy, SortOrder } from '@/types/bill';

const STORAGE_KEY = 'paychores-bills';
const CLOUD_SYNC_KEY = 'paychores-bills-cloud-sync';

// Future: This will be used for cloud synchronization
type SyncStatus = 'idle' | 'syncing' | 'error' | 'success';

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  // Load bills from localStorage on mount
  useEffect(() => {
    try {
      const storedBills = localStorage.getItem(STORAGE_KEY);
      if (storedBills) {
        setBills(JSON.parse(storedBills));
      }
    } catch (error) {
      console.error('Error loading bills from localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
      } catch (error) {
        console.error('Error saving bills to localStorage:', error);
      }
    }
  }, [bills, loading]);

  const addBill = (bill: Bill) => {
    setBills((prev) => [...prev, bill]);
  };

  const togglePaid = (billId: string) => {
    setBills((prev) =>
      prev.map((bill) =>
        bill.id === billId ? { ...bill, isPaid: !bill.isPaid } : bill
      )
    );
  };

  const updateBill = (updatedBill: Bill) => {
    setBills((prev) =>
      prev.map((bill) => (bill.id === updatedBill.id ? updatedBill : bill))
    );
  };

  const deleteBill = (billId: string) => {
    setBills((prev) => prev.filter((bill) => bill.id !== billId));
  };

  const moveBillToStatus = (
    billId: string,
    newStatus: 'pending' | 'paid' | 'overdue'
  ) => {
    setBills((prev) =>
      prev.map((bill) => {
        if (bill.id === billId) {
          const today = new Date();
          const dueDate = new Date(bill.dueDate);

          switch (newStatus) {
            case 'paid':
              return {
                ...bill,
                isPaid: true,
                paidAt: new Date().toISOString(),
              };
            case 'overdue':
              return {
                ...bill,
                isPaid: false,
                paidAt: undefined,
                dueDate: new Date(
                  today.getTime() - 24 * 60 * 60 * 1000
                ).toISOString(), // Set to yesterday
              };
            case 'pending':
              return {
                ...bill,
                isPaid: false,
                paidAt: undefined,
                dueDate: new Date(
                  today.getTime() + 7 * 24 * 60 * 60 * 1000
                ).toISOString(), // Set to next week
              };
            default:
              return bill;
          }
        }
        return bill;
      })
    );
  };

  const getBillById = (billId: string): Bill | undefined => {
    return bills.find((bill) => bill.id === billId);
  };

  // Future: Cloud synchronization methods
  const syncWithCloud = async (): Promise<void> => {
    // TODO: Implement cloud sync
    // setSyncStatus('syncing');
    // try {
    //   const cloudBills = await fetchBillsFromCloud();
    //   const mergedBills = mergeBills(bills, cloudBills);
    //   setBills(mergedBills);
    //   setSyncStatus('success');
    // } catch (error) {
    //   setSyncStatus('error');
    //   console.error('Sync failed:', error);
    // }
    console.log('Cloud sync not implemented yet');
  };

  const exportBills = (): string => {
    return JSON.stringify(bills, null, 2);
  };

  const importBills = (billsData: string): boolean => {
    try {
      const importedBills = JSON.parse(billsData) as Bill[];
      // Validate the structure
      if (Array.isArray(importedBills)) {
        setBills(importedBills);
        return true;
      }
    } catch (error) {
      console.error('Import failed:', error);
    }
    return false;
  };

  return {
    bills,
    loading,
    syncStatus,
    addBill,
    updateBill,
    deleteBill,
    togglePaid,
    moveBillToStatus,
    getBillById,
    syncWithCloud,
    exportBills,
    importBills,
  };
}

export function useFilteredBills(
  bills: Bill[],
  filters: BillFilters = {},
  sortBy: SortBy = 'dueDate',
  sortOrder: SortOrder = 'asc'
) {
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);

  useEffect(() => {
    let filtered = [...bills];

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter((bill) => bill.category === filters.category);
    }

    if (filters.isPaid !== undefined) {
      filtered = filtered.filter((bill) => bill.isPaid === filters.isPaid);
    }

    if (filters.dueDateRange) {
      const start = new Date(filters.dueDateRange.start);
      const end = new Date(filters.dueDateRange.end);
      filtered = filtered.filter((bill) => {
        const dueDate = new Date(bill.dueDate);
        return dueDate >= start && dueDate <= end;
      });
    }

    // Apply sorting with strong typing
    filtered.sort((a, b) => {
      const getSortValue = (
        bill: Bill,
        sortField: SortBy
      ): string | number | Date => {
        switch (sortField) {
          case 'dueDate':
            return new Date(bill.dueDate);
          case 'amount':
            return bill.amount;
          case 'name':
            return bill.name.toLowerCase();
          case 'category':
            return bill.category.toLowerCase();
          default:
            // This should never happen with proper typing
            const _exhaustiveCheck: never = sortField;
            return _exhaustiveCheck;
        }
      };

      const aValue = getSortValue(a, sortBy);
      const bValue = getSortValue(b, sortBy);

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredBills(filtered);
  }, [bills, filters, sortBy, sortOrder]);

  return filteredBills;
}

export function useBillStats(bills: Bill[]) {
  const stats = {
    total: bills.length,
    paid: bills.filter((bill) => bill.isPaid).length,
    unpaid: bills.filter((bill) => !bill.isPaid).length,
    overdue: bills.filter((bill) => {
      const today = new Date();
      const dueDate = new Date(bill.dueDate);
      return !bill.isPaid && dueDate < today;
    }).length,
    dueSoon: bills.filter((bill) => {
      const today = new Date();
      const dueDate = new Date(bill.dueDate);
      const sevenDaysFromNow = new Date(
        today.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      return !bill.isPaid && dueDate >= today && dueDate <= sevenDaysFromNow;
    }).length,
    totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
    paidAmount: bills
      .filter((bill) => bill.isPaid)
      .reduce((sum, bill) => sum + bill.amount, 0),
    unpaidAmount: bills
      .filter((bill) => !bill.isPaid)
      .reduce((sum, bill) => sum + bill.amount, 0),
  };

  return stats;
}
