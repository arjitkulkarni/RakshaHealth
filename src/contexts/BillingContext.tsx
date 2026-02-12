import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Service {
  id: string;
  name: string;
  description: string;
  amount: number;
  category: string;
  quantity?: number;
}

export interface Bill {
  id: string;
  patientName: string;
  patientVID: string;
  patientPhone?: string;
  doctorId: string;
  doctorName: string;
  hospitalName: string;
  department: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected' | 'insurance_pending';
  createdAt: string;
  dueDate: string;
  services: Service[];
  insuranceClaimId?: string;
  paymentMethod?: 'medivoucher' | 'wallet' | 'insurance' | 'cash';
  transactionHash?: string;
  notes?: string;
  billNumber: string;
}

export interface Payment {
  id: string;
  billId: string;
  amount: number;
  method: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  transactionHash?: string;
}

interface BillingContextType {
  bills: Bill[];
  payments: Payment[];
  createBill: (billData: Omit<Bill, 'id' | 'createdAt' | 'status' | 'billNumber'>) => void;
  updateBillStatus: (billId: string, status: Bill['status']) => void;
  getBillsByPatientVID: (vid: string) => Bill[];
  getBillsByDoctor: (doctorId: string) => Bill[];
  addPayment: (payment: Omit<Payment, 'id' | 'timestamp'>) => void;
  validateVID: (vid: string) => boolean;
}

const BillingContext = createContext<BillingContextType | undefined>(undefined);

const BILLS_STORAGE_KEY = 'medination_bills';
const PAYMENTS_STORAGE_KEY = 'medination_payments';

// Sample bills data
const sampleBills: Bill[] = [
  {
    id: "bill_1",
    patientName: "Rajesh Kumar",
    patientVID: "V123456789",
    patientPhone: "9876543210",
    doctorId: "doc1",
    doctorName: "Dr. Rajesh Sharma",
    hospitalName: "Apollo Hospital",
    department: "Cardiology",
    amount: 2500,
    status: "paid",
    createdAt: "2024-01-15T10:30:00Z",
    dueDate: "2024-01-22T23:59:59Z",
    billNumber: "BILL-2024-001",
    services: [
      {
        id: "1",
        name: "Consultation",
        description: "Cardiology consultation",
        amount: 1000,
        category: "Consultation",
        quantity: 1,
      },
      {
        id: "2",
        name: "ECG",
        description: "Electrocardiogram",
        amount: 800,
        category: "Diagnostics",
        quantity: 1,
      },
      {
        id: "3",
        name: "Blood Test",
        description: "Complete blood count",
        amount: 700,
        category: "Lab Tests",
        quantity: 1,
      },
    ],
    paymentMethod: "medivoucher",
    transactionHash: "0x1234567890abcdef",
  },
  {
    id: "bill_2",
    patientName: "Priya Sharma",
    patientVID: "V987654321",
    patientPhone: "9876543211",
    doctorId: "doc2",
    doctorName: "Dr. Priya Patel",
    hospitalName: "Fortis Hospital",
    department: "Dermatology",
    amount: 1800,
    status: "pending",
    createdAt: "2024-01-18T14:20:00Z",
    dueDate: "2024-01-25T23:59:59Z",
    billNumber: "BILL-2024-002",
    services: [
      {
        id: "4",
        name: "Consultation",
        description: "Dermatology consultation",
        amount: 800,
        category: "Consultation",
        quantity: 1,
      },
      {
        id: "5",
        name: "Skin Treatment",
        description: "Acne treatment procedure",
        amount: 1000,
        category: "Treatment",
        quantity: 1,
      },
    ],
  },
];

// Sample payments data
const samplePayments: Payment[] = [
  {
    id: "pay_1",
    billId: "bill_1",
    amount: 2500,
    method: "MediVoucher",
    status: "completed",
    timestamp: "2024-01-16T11:45:00Z",
    transactionHash: "0x1234567890abcdef",
  },
];

// Valid VIDs for demo (in real app, this would be fetched from user database)
const validVIDs = [
  "V123456789",
  "V987654321", 
  "V456789123",
  "V111222333",
  "V444555666",
  "V777888999"
];

export function BillingProvider({ children }: { children: ReactNode }) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    // Load bills from localStorage
    const storedBills = localStorage.getItem(BILLS_STORAGE_KEY);
    if (storedBills) {
      setBills(JSON.parse(storedBills));
    } else {
      // Initialize with sample data
      setBills(sampleBills);
      localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(sampleBills));
    }

    // Load payments from localStorage
    const storedPayments = localStorage.getItem(PAYMENTS_STORAGE_KEY);
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments));
    } else {
      // Initialize with sample data
      setPayments(samplePayments);
      localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(samplePayments));
    }
  }, []);

  const saveBills = (newBills: Bill[]) => {
    setBills(newBills);
    localStorage.setItem(BILLS_STORAGE_KEY, JSON.stringify(newBills));
  };

  const savePayments = (newPayments: Payment[]) => {
    setPayments(newPayments);
    localStorage.setItem(PAYMENTS_STORAGE_KEY, JSON.stringify(newPayments));
  };

  const generateBillNumber = () => {
    const year = new Date().getFullYear();
    const billCount = bills.length + 1;
    return `BILL-${year}-${billCount.toString().padStart(3, '0')}`;
  };

  const validateVID = (vid: string): boolean => {
    return validVIDs.includes(vid);
  };

  const createBill = (billData: Omit<Bill, 'id' | 'createdAt' | 'status' | 'billNumber'>) => {
    const newBill: Bill = {
      ...billData,
      id: `bill_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      billNumber: generateBillNumber(),
    };

    const updatedBills = [...bills, newBill];
    saveBills(updatedBills);
  };

  const updateBillStatus = (billId: string, status: Bill['status']) => {
    const updatedBills = bills.map(bill =>
      bill.id === billId ? { ...bill, status } : bill
    );
    saveBills(updatedBills);
  };

  const getBillsByPatientVID = (vid: string) => {
    return bills.filter(bill => bill.patientVID === vid);
  };

  const getBillsByDoctor = (doctorId: string) => {
    return bills.filter(bill => bill.doctorId === doctorId);
  };

  const addPayment = (paymentData: Omit<Payment, 'id' | 'timestamp'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    const updatedPayments = [...payments, newPayment];
    savePayments(updatedPayments);

    // Update bill status to paid if payment is completed
    if (paymentData.status === 'completed') {
      updateBillStatus(paymentData.billId, 'paid');
    }
  };

  const value: BillingContextType = {
    bills,
    payments,
    createBill,
    updateBillStatus,
    getBillsByPatientVID,
    getBillsByDoctor,
    addPayment,
    validateVID,
  };

  return (
    <BillingContext.Provider value={value}>
      {children}
    </BillingContext.Provider>
  );
}

export function useBilling() {
  const context = useContext(BillingContext);
  if (context === undefined) {
    throw new Error('useBilling must be used within a BillingProvider');
  }
  return context;
}
