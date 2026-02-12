import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  getMedicines,
  getCategories,
  seedMedicinesIfEmpty,
  placeOrder,
  getPatientOrders,
  type MedicineCatalogItem,
  type CartItem,
  type PatientOrder,
} from "@/lib/medicinesDb";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Pill, Search, ShoppingCart, Plus, Minus, Shield, Package, Clock, Building2 } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrderMedicine() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [medicines, setMedicines] = useState<MedicineCatalogItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placing, setPlacing] = useState(false);
  const [orders, setOrders] = useState<PatientOrder[]>([]);

  const loadOrders = () => {
    if (user?.vid) setOrders(getPatientOrders(user.vid));
  };

  useEffect(() => {
    seedMedicinesIfEmpty();
    setMedicines(getMedicines(true)); // only in-stock for ordering
    setCategories(getCategories());
  }, []);

  useEffect(() => {
    loadOrders();
  }, [user?.vid]);

  const filtered = medicines.filter((m) => {
    const matchSearch =
      !searchQuery ||
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = categoryFilter === "all" || m.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const addToCart = (m: MedicineCatalogItem, qty = 1) => {
    const maxQty = Math.min(m.stock, qty);
    if (maxQty <= 0) {
      toast.error("Out of stock");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((c) => c.medicineId === m.id);
      if (existing) {
        const newQty = Math.min(m.stock, existing.quantity + maxQty);
        if (newQty === existing.quantity) return prev;
        return prev.map((c) =>
          c.medicineId === m.id ? { ...c, quantity: newQty } : c
        );
      }
      return [...prev, { medicineId: m.id, medicineName: m.name, price: m.price, quantity: maxQty }];
    });
    toast.success(`Added ${m.name} to cart`);
  };

  const updateCartQty = (medicineId: string, delta: number) => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;
    setCart((prev) => {
      const existing = prev.find((c) => c.medicineId === medicineId);
      if (!existing) return prev;
      const newQty = Math.max(0, Math.min(med.stock, existing.quantity + delta));
      if (newQty === 0) return prev.filter((c) => c.medicineId !== medicineId);
      return prev.map((c) =>
        c.medicineId === medicineId ? { ...c, quantity: newQty } : c
      );
    });
  };

  const totalAmount = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  const formatDelivery = (order: PatientOrder) => {
    const deliveryAt = order.estimatedDeliveryAt;
    if (!deliveryAt) return "—";
    const d = new Date(deliveryAt);
    const now = new Date();
    if (d <= now) return "Delivered";
    const hours = Math.round((d.getTime() - now.getTime()) / (60 * 60 * 1000));
    if (hours < 24) return `In ${hours} hour${hours !== 1 ? "s" : ""}`;
    const days = Math.round(hours / 24);
    return `In ${days} day${days !== 1 ? "s" : ""} (by ${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })})`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "ready": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      case "delivered": return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const handlePlaceOrder = () => {
    if (!user?.vid || !user?.name) {
      toast.error("Please sign in to place an order");
      return;
    }
    if (cart.length === 0) {
      toast.error("Add medicines to cart first");
      return;
    }
    setPlacing(true);
    try {
      const order = placeOrder({
        patientVID: user.vid,
        patientName: user.name,
        items: cart,
        totalAmount,
      });
      setCart([]);
      setMedicines(getMedicines(true)); // refresh stock
      loadOrders();
      toast.success(`Order ${order.id} placed successfully!`);
    } catch (e) {
      toast.error("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />

      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Pill className="h-8 w-8 text-primary" />
            Order Medicine
          </h1>
          <p className="text-muted-foreground">
            Browse the catalog and add medicines to your cart. Orders are sent to the pharmacy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Medicine Catalog</CardTitle>
                <CardDescription>Available medicines (from pharmacy catalog)</CardDescription>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or manufacturer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-1">
                  {filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center">
                      No medicines match your search.
                    </p>
                  ) : (
                    filtered.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-medium">{m.name}</p>
                            {m.prescriptionRequired && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-0.5" />
                                Rx
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{m.manufacturer}</p>
                          <p className="text-sm mt-1">
                            <span className="font-semibold text-primary">₹{m.price}</span>
                            <span className="text-muted-foreground ml-2">Stock: {m.stock}</span>
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addToCart(m)}
                          disabled={m.stock === 0}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cart */}
          <div className="space-y-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Your Cart
                </CardTitle>
                <CardDescription>
                  {cart.length === 0
                    ? "Cart is empty"
                    : `${cart.reduce((s, c) => s + c.quantity, 0)} item(s)`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">
                    Add medicines from the catalog to place an order.
                  </p>
                ) : (
                  <>
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                      {cart.map((item) => {
                        const med = medicines.find((m) => m.id === item.medicineId);
                        return (
                          <div
                            key={item.medicineId}
                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.medicineName}</p>
                              <p className="text-xs text-muted-foreground">
                                ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateCartQty(item.medicineId, -1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => updateCartQty(item.medicineId, 1)}
                                disabled={!med || item.quantity >= med.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">₹{totalAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handlePlaceOrder}
                        disabled={placing || cart.length === 0}
                      >
                        {placing ? "Placing order..." : "Place Order"}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* View Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              View Orders
            </CardTitle>
            <CardDescription>
              Your medicine orders with pharmacy and estimated delivery
            </CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No orders yet. Place an order above to see it here.
              </p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg border bg-muted/30 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{order.id}</span>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>
                          <span className="text-muted-foreground">Pharmacy: </span>
                          <span className="font-medium">
                            {order.pharmacyName ?? "—"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>
                          <span className="text-muted-foreground">Delivery: </span>
                          <span className="font-medium">{formatDelivery(order)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Items</p>
                      <ul className="text-sm space-y-0.5">
                        {order.items.map((item, i) => (
                          <li key={i}>
                            {item.medicineName} × {item.quantity} — ₹
                            {(item.price * item.quantity).toLocaleString("en-IN")}
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm font-semibold mt-2">
                        Total: ₹{order.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
