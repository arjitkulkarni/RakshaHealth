/**
 * Medicines catalog and patient orders (localStorage-backed for demo).
 * Seed catalog so Order Medicine page and pharmacy can share the same data.
 */

export type MedicineCatalogItem = {
  id: string;
  name: string;
  manufacturer: string;
  stock: number;
  price: number;
  category: string;
  prescriptionRequired?: boolean;
};

export type CartItem = {
  medicineId: string;
  medicineName: string;
  price: number;
  quantity: number;
};

export type PatientOrder = {
  id: string;
  patientVID: string;
  patientName: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "processing" | "ready" | "delivered";
  orderDate: string;
  pharmacyName?: string;
  pharmacyId?: string;
  estimatedDeliveryAt?: string; // ISO date string
};

const CATALOG_KEY = "medination_medicines_catalog";
const ORDERS_KEY_PREFIX = "medination_patient_orders_";
const ALL_ORDERS_KEY = "medination_all_orders";

/** Partner pharmacies (orders are assigned to one of these). */
const PHARMACIES = [
  { id: "PH001", name: "MediCare Pharmacy", deliveryHours: 24 },
  { id: "PH002", name: "Apollo Pharmacy", deliveryHours: 36 },
  { id: "PH003", name: "HealthPlus Pharmacy", deliveryHours: 48 },
];

const DEFAULT_CATALOG: MedicineCatalogItem[] = [
  { id: "MED001", name: "Paracetamol 500mg", manufacturer: "Sun Pharma", stock: 150, price: 25, category: "Pain Relief" },
  { id: "MED002", name: "Ibuprofen 400mg", manufacturer: "Cipla", stock: 120, price: 35, category: "Pain Relief" },
  { id: "MED003", name: "Diclofenac 50mg", manufacturer: "Lupin", stock: 8, price: 45, category: "Pain Relief" },
  { id: "MED004", name: "Aspirin 75mg", manufacturer: "Bayer", stock: 200, price: 15, category: "Cardiac" },
  { id: "MED005", name: "Tramadol 50mg", manufacturer: "Ranbaxy", stock: 0, price: 85, category: "Pain Relief" },
  { id: "MED006", name: "Amoxicillin 250mg", manufacturer: "Cipla", stock: 75, price: 45, category: "Antibiotic", prescriptionRequired: true },
  { id: "MED007", name: "Azithromycin 500mg", manufacturer: "Dr. Reddy's", stock: 75, price: 125, category: "Antibiotic", prescriptionRequired: true },
  { id: "MED008", name: "Ciprofloxacin 500mg", manufacturer: "Sun Pharma", stock: 50, price: 95, category: "Antibiotic", prescriptionRequired: true },
  { id: "MED009", name: "Cephalexin 500mg", manufacturer: "Aurobindo", stock: 45, price: 75, category: "Antibiotic", prescriptionRequired: true },
  { id: "MED010", name: "Doxycycline 100mg", manufacturer: "Torrent", stock: 40, price: 65, category: "Antibiotic", prescriptionRequired: true },
  { id: "MED011", name: "Metformin 500mg", manufacturer: "Dr. Reddy's", stock: 200, price: 35, category: "Diabetes", prescriptionRequired: true },
  { id: "MED012", name: "Glimepiride 2mg", manufacturer: "Sun Pharma", stock: 90, price: 55, category: "Diabetes", prescriptionRequired: true },
  { id: "MED013", name: "Insulin Glargine", manufacturer: "Sanofi", stock: 25, price: 450, category: "Diabetes", prescriptionRequired: true },
  { id: "MED014", name: "Sitagliptin 100mg", manufacturer: "MSD", stock: 30, price: 185, category: "Diabetes", prescriptionRequired: true },
  { id: "MED015", name: "Pioglitazone 15mg", manufacturer: "Lupin", stock: 45, price: 95, category: "Diabetes", prescriptionRequired: true },
  { id: "MED016", name: "Amlodipine 5mg", manufacturer: "Cipla", stock: 180, price: 25, category: "Cardiac", prescriptionRequired: true },
  { id: "MED017", name: "Atenolol 50mg", manufacturer: "Sun Pharma", stock: 95, price: 35, category: "Cardiac", prescriptionRequired: true },
  { id: "MED018", name: "Losartan 50mg", manufacturer: "Dr. Reddy's", stock: 60, price: 65, category: "Cardiac", prescriptionRequired: true },
  { id: "MED019", name: "Atorvastatin 20mg", manufacturer: "Ranbaxy", stock: 110, price: 85, category: "Cardiac", prescriptionRequired: true },
  { id: "MED020", name: "Clopidogrel 75mg", manufacturer: "Piramal", stock: 80, price: 125, category: "Cardiac", prescriptionRequired: true },
  { id: "MED021", name: "Omeprazole 20mg", manufacturer: "Lupin", stock: 100, price: 55, category: "Gastric" },
  { id: "MED022", name: "Pantoprazole 40mg", manufacturer: "Sun Pharma", stock: 85, price: 65, category: "Gastric" },
  { id: "MED023", name: "Ranitidine 150mg", manufacturer: "Cipla", stock: 0, price: 35, category: "Gastric" },
  { id: "MED024", name: "Domperidone 10mg", manufacturer: "Cadila", stock: 125, price: 45, category: "Gastric" },
  { id: "MED025", name: "Loperamide 2mg", manufacturer: "Abbott", stock: 90, price: 25, category: "Gastric" },
  { id: "MED026", name: "Salbutamol Inhaler", manufacturer: "GSK", stock: 35, price: 185, category: "Respiratory", prescriptionRequired: true },
  { id: "MED027", name: "Montelukast 10mg", manufacturer: "Dr. Reddy's", stock: 55, price: 95, category: "Respiratory" },
  { id: "MED028", name: "Cetirizine 10mg", manufacturer: "Sun Pharma", stock: 150, price: 15, category: "Respiratory" },
  { id: "MED029", name: "Dextromethorphan Syrup", manufacturer: "Pfizer", stock: 45, price: 75, category: "Respiratory" },
  { id: "MED030", name: "Prednisolone 5mg", manufacturer: "Cipla", stock: 65, price: 45, category: "Respiratory", prescriptionRequired: true },
  { id: "MED031", name: "Vitamin D3 60000 IU", manufacturer: "Sun Pharma", stock: 200, price: 85, category: "Vitamins" },
  { id: "MED032", name: "Calcium Carbonate 500mg", manufacturer: "Cipla", stock: 120, price: 35, category: "Vitamins" },
  { id: "MED033", name: "Iron + Folic Acid", manufacturer: "Ranbaxy", stock: 95, price: 45, category: "Vitamins" },
  { id: "MED034", name: "Multivitamin Tablets", manufacturer: "Himalaya", stock: 95, price: 125, category: "Vitamins" },
  { id: "MED035", name: "Omega-3 Capsules", manufacturer: "Seven Seas", stock: 70, price: 285, category: "Vitamins" },
  { id: "MED036", name: "Gabapentin 300mg", manufacturer: "Sun Pharma", stock: 45, price: 95, category: "Neurological", prescriptionRequired: true },
  { id: "MED037", name: "Phenytoin 100mg", manufacturer: "Cipla", stock: 35, price: 65, category: "Neurological", prescriptionRequired: true },
  { id: "MED038", name: "Levetiracetam 500mg", manufacturer: "Dr. Reddy's", stock: 25, price: 185, category: "Neurological", prescriptionRequired: true },
  { id: "MED039", name: "Alprazolam 0.5mg", manufacturer: "Torrent", stock: 50, price: 45, category: "Neurological", prescriptionRequired: true },
  { id: "MED040", name: "Sertraline 50mg", manufacturer: "Lupin", stock: 55, price: 125, category: "Neurological", prescriptionRequired: true },
  { id: "MED041", name: "Clotrimazole Cream", manufacturer: "Glenmark", stock: 75, price: 55, category: "Dermatological" },
  { id: "MED042", name: "Hydrocortisone Cream", manufacturer: "Johnson & Johnson", stock: 60, price: 85, category: "Dermatological" },
  { id: "MED043", name: "Tretinoin Gel 0.025%", manufacturer: "Galderma", stock: 40, price: 195, category: "Dermatological" },
  { id: "MED044", name: "Ketoconazole Shampoo", manufacturer: "Cipla", stock: 35, price: 125, category: "Dermatological" },
  { id: "MED045", name: "Calamine Lotion", manufacturer: "Himalaya", stock: 85, price: 45, category: "Dermatological" },
  { id: "MED046", name: "Folic Acid 5mg", manufacturer: "Sun Pharma", stock: 120, price: 25, category: "Women's Health" },
  { id: "MED047", name: "Calcium + Vitamin D3", manufacturer: "Shelcal", stock: 95, price: 65, category: "Women's Health" },
];

function loadCatalog(): MedicineCatalogItem[] {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : DEFAULT_CATALOG;
    }
  } catch {
    // ignore
  }
  return DEFAULT_CATALOG;
}

function saveCatalog(catalog: MedicineCatalogItem[]) {
  localStorage.setItem(CATALOG_KEY, JSON.stringify(catalog));
}

/** Seed catalog if not present; returns true if seeded. */
export function seedMedicinesIfEmpty(): boolean {
  const existing = loadCatalog();
  if (existing.length > 0) return false;
  saveCatalog(DEFAULT_CATALOG);
  return true;
}

/** Get all medicines from catalog (optionally only in-stock). */
export function getMedicines(onlyInStock = false): MedicineCatalogItem[] {
  let list = loadCatalog();
  if (onlyInStock) list = list.filter((m) => m.stock > 0);
  return list;
}

/** Get unique categories from catalog. */
export function getCategories(): string[] {
  const set = new Set(getMedicines().map((m) => m.category));
  return Array.from(set).sort();
}

/** Reduce stock after order (demo: optional, for consistency with pharmacy). */
function reduceStock(medicineId: string, quantity: number) {
  const catalog = loadCatalog();
  const idx = catalog.findIndex((m) => m.id === medicineId);
  if (idx >= 0 && catalog[idx].stock >= quantity) {
    catalog[idx] = { ...catalog[idx], stock: catalog[idx].stock - quantity };
    saveCatalog(catalog);
  }
}

/** Place order: save to patient orders and all orders, assign pharmacy and delivery time. */
export function placeOrder(
  order: Omit<PatientOrder, "id" | "orderDate" | "status" | "pharmacyName" | "pharmacyId" | "estimatedDeliveryAt">
): PatientOrder {
  const id = `ORD${Date.now()}`;
  const orderDate = new Date();
  // Assign pharmacy (round-robin by order count for demo)
  const allOrders: PatientOrder[] = JSON.parse(localStorage.getItem(ALL_ORDERS_KEY) || "[]");
  const pharmacy = PHARMACIES[allOrders.length % PHARMACIES.length];
  const estimatedDeliveryAt = new Date(orderDate.getTime() + pharmacy.deliveryHours * 60 * 60 * 1000);

  const full: PatientOrder = {
    ...order,
    id,
    status: "pending",
    orderDate: orderDate.toISOString(),
    pharmacyName: pharmacy.name,
    pharmacyId: pharmacy.id,
    estimatedDeliveryAt: estimatedDeliveryAt.toISOString(),
  };

  const byPatientKey = `${ORDERS_KEY_PREFIX}${order.patientVID}`;
  const patientOrders: PatientOrder[] = JSON.parse(localStorage.getItem(byPatientKey) || "[]");
  patientOrders.unshift(full);
  localStorage.setItem(byPatientKey, JSON.stringify(patientOrders));

  const allOrdersList: PatientOrder[] = JSON.parse(localStorage.getItem(ALL_ORDERS_KEY) || "[]");
  allOrdersList.unshift(full);
  localStorage.setItem(ALL_ORDERS_KEY, JSON.stringify(allOrdersList));

  order.items.forEach((item) => reduceStock(item.medicineId, item.quantity));

  return full;
}

/** Fill pharmacy and delivery for legacy orders that don't have them. */
function enrichOrder(order: PatientOrder): PatientOrder {
  if (order.pharmacyName && order.estimatedDeliveryAt) return order;
  const orderDate = new Date(order.orderDate);
  const pharmacy = PHARMACIES[0]; // default for legacy
  const estimatedDeliveryAt =
    order.estimatedDeliveryAt ||
    new Date(orderDate.getTime() + pharmacy.deliveryHours * 60 * 60 * 1000).toISOString();
  return {
    ...order,
    pharmacyName: order.pharmacyName ?? pharmacy.name,
    pharmacyId: order.pharmacyId ?? pharmacy.id,
    estimatedDeliveryAt,
  };
}

/** Get orders for a patient by VID (legacy orders get default pharmacy & delivery). */
export function getPatientOrders(patientVID: string): PatientOrder[] {
  const raw = localStorage.getItem(`${ORDERS_KEY_PREFIX}${patientVID}`);
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr.map(enrichOrder);
  } catch {
    return [];
  }
}
