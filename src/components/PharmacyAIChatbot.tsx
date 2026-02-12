import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePushToTalk } from "@/hooks/use-push-to-talk";
import {
  Bot,
  Send,
  User,
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Mic,
  MicOff,
  Shield,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface PharmacyAIChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  pharmacyName?: string;
}

export function PharmacyAIChatbot({
  isOpen,
  onToggle,
  pharmacyName = "MediCare Pharmacy",
}: PharmacyAIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: `Hello! I'm your MediCare Pharmacy AI assistant. I can help you with inventory, orders, prescriptions, low-stock alerts, and verification. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        "Low stock alert",
        "Today's orders",
        "Verify prescription",
        "Inventory summary",
        "Restock reminder",
        "Revenue overview",
      ],
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    supported: isVoiceSupported,
    isListening,
    error: voiceError,
    start: startListening,
    stop: stopListening,
  } = usePushToTalk({
    language: "en-IN",
    onInterimTranscript: (text) => {
      setInputMessage(text);
    },
    onFinalTranscript: (text) => {
      setInputMessage(text);
      setTimeout(() => {
        handleSendMessage();
      }, 50);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (voiceError) {
      // No toast dependency here, keep it silent. Consumers can see error in console.
      console.error('Voice input error:', voiceError);
    }
  }, [voiceError]);

  const generateBotResponse = (userMessage: string): Message => {
    const msg = userMessage.toLowerCase();

    // Inventory
    if (
      msg.includes("inventory") ||
      msg.includes("stock") ||
      msg.includes("medicine list")
    ) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: `📦 **Inventory Summary**\n\n• **Total SKUs:** 47 medicines\n• **In stock:** 42 | **Low stock:** 3 | **Out of stock:** 2\n\n**Categories:**\n• Pain Relief, Antibiotic, Diabetes, Cardiac\n• Gastric, Respiratory, Vitamins, Dermatological\n\n**Quick actions:** Use the **Inventory** tab to search, filter by category, and add new medicines. Verified medicines show a green badge.\n\nNeed to restock? I can remind you for low-stock items.`,
        timestamp: new Date(),
        suggestions: ["Low stock items", "Add new medicine", "Verify medicine"],
      };
    }

    // Low stock
    if (
      msg.includes("low stock") ||
      msg.includes("restock") ||
      msg.includes("running out")
    ) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: `⚠️ **Low Stock Alert**\n\n**Medicines to restock:**\n• Diclofenac 50mg – 8 units (Pain Relief)\n• Amoxicillin 250mg – 75 units (Antibiotic)\n• Omeprazole 20mg – 100 units (Gastric)\n\n**Suggested reorder:**\n• Paracetamol 500mg – 148 left (monitor)\n• Ibuprofen 400mg – 119 left\n\nGo to **Inventory** → filter or search, then use **Restock** or **Add Medicine** to update quantities.`,
        timestamp: new Date(),
        suggestions: ["View inventory", "Restock now", "Set restock reminder"],
      };
    }

    // Orders
    if (
      msg.includes("order") ||
      msg.includes("today's order") ||
      msg.includes("pending order")
    ) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: `🛒 **Orders Overview**\n\n• **Pending:** 2 | **Processing:** 1 | **Ready:** 1 | **Delivered:** —\n\n**Recent orders:**\n• ORD001 – Priya Sharma – ₹84 – **Ready**\n• ORD002 – Amit Patel – ₹90 – **Processing**\n\nUse the **Orders** tab to update status (Start processing → Mark ready → Mark delivered). Customer VID and contact are shown for each order.`,
        timestamp: new Date(),
        suggestions: ["View all orders", "Mark order ready", "Customer contact"],
      };
    }

    // Prescription
    if (
      msg.includes("prescription") ||
      msg.includes("verify prescription") ||
      msg.includes("rx")
    ) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: `📋 **Prescription Verification**\n\n**How to verify:**\n1. Open the **Prescriptions** tab\n2. Select a prescription (patient name, VID, doctor, hospital)\n3. Click **Verify Prescription** or **Scan QR**\n4. Match medicines and dosage with your stock\n\n**Current:** 1 verified prescription (PRES001 – Priya Sharma).\n\nAlways confirm patient VID and doctor details before dispensing prescription-only medicines.`,
        timestamp: new Date(),
        suggestions: ["View prescriptions", "Scan QR", "Verification guide"],
      };
    }

    // Verify medicine / drug auth
    if (
      msg.includes("verify") ||
      msg.includes("authentic") ||
      msg.includes("blockchain")
    ) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: `🛡️ **Medicine Verification**\n\n**Blockchain verification:**\n• Each batch has a unique hash\n• Scan QR on pack or use batch number to verify\n• Status: Verified / Unverified shown in Inventory\n\n**In your inventory:**\n• Paracetamol, Amoxicillin, Metformin – all **Verified**\n• Unverified items show an **Verify** button in the Inventory tab\n\nThis helps prevent counterfeit medicines and builds customer trust.`,
        timestamp: new Date(),
        suggestions: ["Verify a medicine", "Inventory list", "QR scan"],
      };
    }

    // Revenue / sales
    if (
      msg.includes("revenue") ||
      msg.includes("sales") ||
      msg.includes("earning")
    ) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: `📈 **Revenue Overview**\n\n• **Total revenue (demo):** ₹24.5L\n• **Total orders:** 1,247\n• **Verified medicines:** 98.5%\n• **Customer rating:** 4.8\n\nUse the **Overview** tab for stats and the **Orders** tab for order-wise details. Export or reports can be added from Settings.`,
        timestamp: new Date(),
        suggestions: ["Today's orders", "Top medicines", "Settings"],
      };
    }

    // Greetings
    if (
      msg.includes("hello") ||
      msg.includes("hi") ||
      msg.includes("hey") ||
      msg.includes("good morning") ||
      msg.includes("good afternoon")
    ) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: `Hello! Welcome to ${pharmacyName}. I'm here to help with inventory, orders, prescriptions, and verification. What would you like to do?`,
        timestamp: new Date(),
        suggestions: [
          "Low stock alert",
          "Today's orders",
          "Verify prescription",
          "Inventory summary",
        ],
      };
    }

    // Thanks
    if (msg.includes("thank") || msg.includes("thanks")) {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: "You're welcome! If you need anything else—orders, inventory, or prescriptions—just ask.",
        timestamp: new Date(),
        suggestions: ["Orders", "Inventory", "Prescriptions"],
      };
    }

    // Default
    return {
      id: Date.now().toString(),
      type: "bot",
      content: `I can help you with:\n\n📦 **Inventory** – stock levels, add/restock medicines\n🛒 **Orders** – pending, processing, ready, delivered\n📋 **Prescriptions** – verify and process\n🛡️ **Verification** – medicine authenticity\n📈 **Revenue** – overview and stats\n\nAsk something like: "Low stock", "Today's orders", or "Verify prescription".`,
      timestamp: new Date(),
      suggestions: [
        "Low stock alert",
        "Today's orders",
        "Verify prescription",
        "Inventory summary",
      ],
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[560px]"
      }`}
    >
      <Card className="h-full shadow-2xl border-2">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Pharmacy AI</CardTitle>
                <p className="text-xs opacity-90">{pharmacyName} Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={onToggle}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-[calc(100%-72px)]">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "bot" && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-primary text-white"
                          : "bg-muted"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">
                        {message.content}
                      </div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    {message.type === "user" && (
                      <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-secondary" />
                      </div>
                    )}
                  </div>
                ))}

                {messages.length > 0 &&
                  messages[messages.length - 1].suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {messages[
                        messages.length - 1
                      ].suggestions!.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about orders, inventory, prescriptions..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="button"
                  variant={isListening ? "default" : "outline"}
                  onClick={() => {
                    if (!isVoiceSupported) {
                      console.error('Voice input is not supported in this browser');
                      return;
                    }
                    if (isListening) stopListening();
                    else startListening();
                  }}
                  size="icon"
                  disabled={isTyping}
                  title={isListening ? "Stop listening" : "Push to talk"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Secure pharmacy assistant</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
