export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // ISO date string
  category: BillCategory;
  isPaid: boolean;
  description?: string;
  createdAt: string; // ISO date string
  paidAt?: string; // ISO date string
}

export type BillCategory = 
  | 'utilities'
  | 'rent'
  | 'insurance'
  | 'subscriptions'
  | 'loans'
  | 'credit-cards'
  | 'phone'
  | 'internet'
  | 'groceries'
  | 'transportation'
  | 'healthcare'
  | 'other';

export interface BillFormData {
  name: string;
  amount: string; // string for form input, will be converted to number
  dueDate: string;
  category: BillCategory;
  description?: string;
}

export interface BillFilters {
  category?: BillCategory;
  isPaid?: boolean;
  dueDateRange?: {
    start: string;
    end: string;
  };
}

export type SortBy = 'dueDate' | 'amount' | 'name' | 'category';
export type SortOrder = 'asc' | 'desc';

export const BILL_CATEGORIES: { value: BillCategory; label: string }[] = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'rent', label: 'Rent/Mortgage' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'subscriptions', label: 'Subscriptions' },
  { value: 'loans', label: 'Loans' },
  { value: 'credit-cards', label: 'Credit Cards' },
  { value: 'phone', label: 'Phone' },
  { value: 'internet', label: 'Internet' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'transportation', label: 'Transportation' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'other', label: 'Other' },
];