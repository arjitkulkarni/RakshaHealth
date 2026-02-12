import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Bot,
  Send,
  User,
  MessageCircle,
  X,
  Minimize2,
  Maximize2,
  Heart,
  Calendar,
  Pill,
  FileText,
  Phone,
  MapPin,
  Clock,
  Shield,
  HelpCircle,
  Stethoscope,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AIChatbot({ isOpen, onToggle }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m MediBot, your AI healthcare assistant. I\'m here to help you with appointments, medical records, medications, and general health questions. How can I assist you today?',
      timestamp: new Date(),
      suggestions: [
        'Book an appointment',
        'Check my medical records',
        'Medication reminders',
        'Find nearby hospitals',
        'Emergency contacts',
        'Health tips'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const quickResponses = {
    'book an appointment': {
      content: 'I can help you book an appointment! Here are your options:\n\n📅 **Quick Booking Steps:**\n1. Go to "Book Appointment" from your dashboard\n2. Select your preferred doctor and department\n3. Choose available time slots\n4. Describe your symptoms\n5. Confirm your appointment\n\n🏥 **Available Departments:**\n• General Medicine\n• Cardiology\n• Dermatology\n• Orthopedics\n• Pediatrics\n\nWould you like me to guide you to the booking page?',
      suggestions: ['Yes, take me to booking', 'Show available doctors', 'Emergency appointment']
    },
    'medical records': {
      content: '📋 **Your Medical Records:**\n\nI can help you access and manage your medical records securely:\n\n🔐 **Available Records:**\n• Lab test results\n• Prescription history\n• Imaging reports (X-rays, MRI, CT scans)\n• Vaccination records\n• Discharge summaries\n\n📱 **Quick Actions:**\n• View recent records\n• Download reports\n• Share with doctors\n• Upload new documents\n\nAll records are encrypted and blockchain-verified for security.',
      suggestions: ['View recent records', 'Upload new document', 'Share with doctor']
    },
    'medication': {
      content: '💊 **Medication Management:**\n\nI can help you with all medication-related queries:\n\n⏰ **Reminders & Tracking:**\n• Set medication alarms\n• Track dosage schedules\n• Monitor side effects\n• Refill reminders\n\n🔍 **Drug Information:**\n• Verify medication authenticity\n• Check drug interactions\n• Dosage guidelines\n• Side effects information\n\n📋 **Prescription Management:**\n• Digital prescriptions\n• Pharmacy locations\n• Insurance coverage',
      suggestions: ['Set medication reminder', 'Check drug authenticity', 'Find pharmacy']
    },
    'emergency': {
      content: '🚨 **Emergency Assistance:**\n\n**Immediate Help:**\n• Emergency Hotline: 102\n• Ambulance: 108\n• Police: 100\n\n🏥 **Nearest Hospitals:**\n• Apollo Hospital - 2.3 km\n• Max Healthcare - 3.1 km\n• AIIMS - 4.5 km\n\n📱 **Emergency Features:**\n• Share location with emergency contacts\n• Access medical ID & allergies\n• Quick symptom checker\n\n⚠️ **For life-threatening emergencies, call 102 immediately!**',
      suggestions: ['Call emergency services', 'Find nearest hospital', 'Share my location']
    },
    'health tips': {
      content: '🌟 **Daily Health Tips:**\n\n💧 **Hydration:** Drink 8-10 glasses of water daily\n🥗 **Nutrition:** Include 5 servings of fruits & vegetables\n🏃 **Exercise:** 30 minutes of physical activity daily\n😴 **Sleep:** 7-9 hours of quality sleep\n🧘 **Mental Health:** Practice meditation or deep breathing\n\n📊 **Health Monitoring:**\n• Track your vitals regularly\n• Monitor blood pressure\n• Check blood sugar levels\n• Maintain healthy weight\n\n🔔 **Preventive Care:**\n• Regular health checkups\n• Vaccination schedules\n• Cancer screenings\n• Dental checkups',
      suggestions: ['Track my vitals', 'Set health reminders', 'Nutrition advice']
    }
  };

  const generateBotResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    
    // Appointment-related queries
    if (message.includes('appointment') || message.includes('book')) {
      if (message.includes('cancel') || message.includes('reschedule')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '📅 **Cancel/Reschedule Appointment:**\n\n🔄 **Easy Steps:**\n1. Go to "My Appointments" section\n2. Find your scheduled appointment\n3. Click "Manage" → "Cancel" or "Reschedule"\n4. Select new date/time if rescheduling\n5. Confirm changes\n\n⏰ **Cancellation Policy:**\n• Cancel up to 2 hours before appointment\n• No charges for cancellations\n• Rescheduling available based on doctor availability\n\n📞 **Need Help?** Call our support: 1800-MEDI-HELP',
          timestamp: new Date(),
          suggestions: ['View my appointments', 'Contact support', 'Book new appointment']
        };
      }
      if (message.includes('emergency') || message.includes('urgent')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '🚨 **Emergency Appointment Booking:**\n\n⚡ **Immediate Options:**\n• Walk-in Emergency Clinics\n• 24/7 Telemedicine Consultations\n• Hospital Emergency Departments\n\n🏥 **Nearest Emergency Centers:**\n• City Hospital Emergency - 1.2 km (Open 24/7)\n• MediCare Urgent Care - 2.1 km (6 AM - 12 AM)\n• Apollo Emergency - 3.5 km (Open 24/7)\n\n📱 **Quick Actions:**\n• Call Emergency Hotline: 102\n• Book Urgent Teleconsultation\n• Get directions to nearest hospital',
          timestamp: new Date(),
          suggestions: ['Call emergency services', 'Book urgent teleconsult', 'Find nearest hospital']
        };
      }
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: quickResponses['book an appointment'].content,
        timestamp: new Date(),
        suggestions: quickResponses['book an appointment'].suggestions
      };
    }
    
    // Medical records queries
    if (message.includes('record') || message.includes('report') || message.includes('document')) {
      if (message.includes('upload') || message.includes('add')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '📤 **Upload Medical Records:**\n\n📋 **Supported Documents:**\n• Lab test results (PDF, JPG, PNG)\n• Prescription images\n• X-rays and scans (DICOM, JPG, PNG)\n• Discharge summaries\n• Vaccination certificates\n\n🔐 **Upload Process:**\n1. Go to "Medical Records" → "Upload"\n2. Select document type and category\n3. Choose file (max 10MB)\n4. Add description and date\n5. Verify and submit\n\n✅ **Security Features:**\n• End-to-end encryption\n• Blockchain verification\n• HIPAA compliant storage\n• Access logs maintained',
          timestamp: new Date(),
          suggestions: ['Start upload process', 'View upload guidelines', 'Check storage space']
        };
      }
      if (message.includes('share') || message.includes('send')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '🤝 **Share Medical Records:**\n\n👨‍⚕️ **Share with Doctors:**\n• Generate secure access codes\n• Set time-limited permissions\n• Track who accessed your records\n• Revoke access anytime\n\n📱 **Sharing Options:**\n• QR code for instant access\n• Email secure links\n• Direct doctor portal integration\n• Emergency contact sharing\n\n🔒 **Privacy Controls:**\n• Choose specific records to share\n• Set expiration dates\n• Audit trail of all access\n• Instant revocation capability',
          timestamp: new Date(),
          suggestions: ['Generate sharing code', 'Share with doctor', 'Manage permissions']
        };
      }
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: quickResponses['medical records'].content,
        timestamp: new Date(),
        suggestions: quickResponses['medical records'].suggestions
      };
    }
    
    // Medication queries
    if (message.includes('medication') || message.includes('medicine') || message.includes('pill') || message.includes('drug')) {
      if (message.includes('reminder') || message.includes('alarm') || message.includes('schedule')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '⏰ **Medication Reminders:**\n\n📱 **Smart Reminders:**\n• Custom alarm tones\n• Snooze options (5, 10, 15 min)\n• Visual and vibration alerts\n• Missed dose notifications\n\n📊 **Tracking Features:**\n• Adherence statistics\n• Dose history calendar\n• Side effects logging\n• Refill reminders\n\n🔔 **Reminder Types:**\n• Daily medications\n• As-needed medications\n• Injection schedules\n• Supplement reminders\n\n⚙️ **Customization:**\n• Multiple daily doses\n• Meal-time coordination\n• Weekend/holiday adjustments',
          timestamp: new Date(),
          suggestions: ['Set new reminder', 'View medication schedule', 'Track adherence']
        };
      }
      if (message.includes('side effect') || message.includes('reaction') || message.includes('allergy')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '⚠️ **Medication Side Effects & Allergies:**\n\n🚨 **Immediate Actions for Severe Reactions:**\n• Stop medication immediately\n• Call emergency services: 102\n• Use emergency medications if prescribed\n• Go to nearest hospital\n\n📝 **Common Side Effects to Monitor:**\n• Nausea, dizziness, headache\n• Skin rashes or itching\n• Changes in appetite\n• Sleep disturbances\n• Mood changes\n\n📊 **Tracking Tools:**\n• Side effect diary\n• Severity scale (1-10)\n• Photo documentation\n• Symptom timeline\n\n👨‍⚕️ **When to Contact Doctor:**\n• New or worsening symptoms\n• Severe side effects\n• Suspected allergic reactions',
          timestamp: new Date(),
          suggestions: ['Report side effect', 'Emergency contacts', 'View allergy list']
        };
      }
      if (message.includes('interaction') || message.includes('conflict') || message.includes('together')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '🔍 **Drug Interaction Checker:**\n\n⚠️ **Interaction Types:**\n• Drug-Drug interactions\n• Drug-Food interactions\n• Drug-Supplement interactions\n• Drug-Condition interactions\n\n🛡️ **Safety Features:**\n• Real-time interaction alerts\n• Severity level indicators\n• Alternative medication suggestions\n• Pharmacist consultation options\n\n📋 **How to Check:**\n1. Go to "Medications" → "Interaction Checker"\n2. Add all current medications\n3. Include supplements and vitamins\n4. Review interaction report\n5. Consult healthcare provider if needed\n\n🔔 **Automatic Monitoring:**\n• New prescription alerts\n• Over-the-counter drug warnings\n• Food interaction reminders',
          timestamp: new Date(),
          suggestions: ['Check interactions now', 'Add new medication', 'Consult pharmacist']
        };
      }
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: quickResponses['medication'].content,
        timestamp: new Date(),
        suggestions: quickResponses['medication'].suggestions
      };
    }
    
    // Emergency queries
    if (message.includes('emergency') || message.includes('urgent') || message.includes('help') || message.includes('ambulance')) {
      if (message.includes('contact') || message.includes('number') || message.includes('call')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '📞 **Emergency Contact Numbers:**\n\n🚨 **National Emergency Services:**\n• Medical Emergency: **102**\n• Ambulance Service: **108**\n• Police Emergency: **100**\n• Fire Department: **101**\n• Disaster Management: **1078**\n\n🏥 **Local Emergency Contacts:**\n• City Hospital Emergency: +91-11-2234-5678\n• Apollo Emergency: +91-11-4567-8901\n• Max Healthcare: +91-11-7890-1234\n\n☎️ **MediNation Support:**\n• 24/7 Helpline: 1800-MEDI-HELP\n• Teleconsultation: 1800-TELE-DOC\n• Technical Support: 1800-TECH-HELP\n\n📱 **Quick Actions:**\n• One-tap emergency calling\n• Share location with contacts\n• Access medical ID',
          timestamp: new Date(),
          suggestions: ['Call emergency now', 'Share my location', 'View medical ID']
        };
      }
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: quickResponses['emergency'].content,
        timestamp: new Date(),
        suggestions: quickResponses['emergency'].suggestions
      };
    }
    
    // Health and wellness queries
    if (message.includes('health') || message.includes('tip') || message.includes('advice') || message.includes('wellness')) {
      if (message.includes('diet') || message.includes('nutrition') || message.includes('food')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '🥗 **Nutrition & Diet Guidance:**\n\n🍎 **Daily Nutrition Goals:**\n• 5-9 servings fruits & vegetables\n• 6-8 glasses of water\n• Lean proteins (fish, chicken, legumes)\n• Whole grains over refined carbs\n• Limit processed foods\n\n📊 **Meal Planning:**\n• Breakfast: 25% of daily calories\n• Lunch: 35% of daily calories\n• Dinner: 25% of daily calories\n• Snacks: 15% of daily calories\n\n🥘 **Healthy Cooking Tips:**\n• Steam, grill, or bake instead of frying\n• Use herbs and spices for flavor\n• Control portion sizes\n• Read nutrition labels\n\n⚖️ **Weight Management:**\n• Track calorie intake\n• Monitor portion sizes\n• Regular meal timing\n• Stay hydrated',
          timestamp: new Date(),
          suggestions: ['Create meal plan', 'Track nutrition', 'Find healthy recipes']
        };
      }
      if (message.includes('exercise') || message.includes('fitness') || message.includes('workout')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '🏃‍♂️ **Exercise & Fitness Guide:**\n\n💪 **Weekly Exercise Goals:**\n• 150 minutes moderate aerobic activity\n• 75 minutes vigorous aerobic activity\n• 2+ days strength training\n• Daily stretching/flexibility\n\n🎯 **Exercise Types:**\n• **Cardio:** Walking, running, cycling, swimming\n• **Strength:** Weight lifting, resistance bands\n• **Flexibility:** Yoga, stretching, tai chi\n• **Balance:** Standing on one foot, heel-to-toe walking\n\n📱 **Fitness Tracking:**\n• Step counter integration\n• Heart rate monitoring\n• Workout logging\n• Progress photos\n\n⚠️ **Safety Tips:**\n• Start slowly and progress gradually\n• Warm up before exercising\n• Stay hydrated\n• Listen to your body',
          timestamp: new Date(),
          suggestions: ['Start workout plan', 'Track fitness goals', 'Find exercise videos']
        };
      }
      if (message.includes('sleep') || message.includes('rest') || message.includes('insomnia')) {
        return {
          id: Date.now().toString(),
          type: 'bot',
          content: '😴 **Sleep Health & Hygiene:**\n\n⏰ **Optimal Sleep Schedule:**\n• Adults: 7-9 hours per night\n• Consistent bedtime and wake time\n• Avoid screens 1 hour before bed\n• Create relaxing bedtime routine\n\n🛏️ **Sleep Environment:**\n• Cool temperature (60-67°F)\n• Dark, quiet room\n• Comfortable mattress and pillows\n• Remove electronic devices\n\n🌙 **Better Sleep Habits:**\n• No caffeine 6 hours before bed\n• Avoid large meals before sleep\n• Regular exercise (not close to bedtime)\n• Manage stress and anxiety\n\n📊 **Sleep Tracking:**\n• Sleep duration monitoring\n• Sleep quality assessment\n• Wake-up time optimization\n• Sleep pattern analysis',
          timestamp: new Date(),
          suggestions: ['Track sleep patterns', 'Set sleep reminders', 'Relaxation techniques']
        };
      }
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: quickResponses['health tips'].content,
        timestamp: new Date(),
        suggestions: quickResponses['health tips'].suggestions
      };
    }
    
    // Insurance and billing queries
    if (message.includes('insurance') || message.includes('billing') || message.includes('payment') || message.includes('cost')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '💳 **Insurance & Billing Support:**\n\n🏥 **Insurance Coverage:**\n• Check policy benefits\n• Verify network providers\n• Pre-authorization requests\n• Claim status tracking\n• Coverage limitations\n\n💰 **Payment Options:**\n• MediVoucher digital payments\n• Insurance direct billing\n• Flexible payment plans\n• Corporate health accounts\n• Government scheme integration\n\n📋 **Billing Services:**\n• Detailed bill breakdown\n• Insurance claim assistance\n• Reimbursement support\n• Tax-saving receipts\n• Payment history\n\n🔍 **Cost Estimation:**\n• Treatment cost calculator\n• Insurance coverage preview\n• Out-of-pocket estimates\n• Comparative pricing',
        timestamp: new Date(),
        suggestions: ['Check insurance coverage', 'View billing history', 'Payment options']
      };
    }
    
    // Symptom and diagnosis queries
    if (message.includes('symptom') || message.includes('pain') || message.includes('fever') || message.includes('diagnosis')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '🩺 **Symptom Assessment & Guidance:**\n\n⚠️ **Important Notice:** This is for informational purposes only. Always consult a healthcare professional for proper diagnosis.\n\n🔍 **Symptom Checker Features:**\n• Interactive symptom assessment\n• Severity level evaluation\n• Possible condition suggestions\n• When to seek medical care\n• Home care recommendations\n\n🚨 **Seek Immediate Care If:**\n• Severe chest pain\n• Difficulty breathing\n• High fever (>103°F)\n• Severe headache\n• Loss of consciousness\n• Severe allergic reactions\n\n📱 **Assessment Tools:**\n• Guided symptom questionnaire\n• Photo documentation\n• Symptom timeline tracking\n• Severity scale rating\n\n👨‍⚕️ **Next Steps:**\n• Book teleconsultation\n• Schedule in-person visit\n• Emergency care guidance',
        timestamp: new Date(),
        suggestions: ['Start symptom checker', 'Book consultation', 'Emergency guidance']
      };
    }
    
    // Telemedicine queries
    if (message.includes('telemedicine') || message.includes('video call') || message.includes('online consultation')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: '💻 **Telemedicine Services:**\n\n📱 **Available Consultations:**\n• Video consultations\n• Audio-only calls\n• Chat-based consultations\n• Specialist referrals\n• Follow-up appointments\n\n🔧 **Technical Requirements:**\n• Stable internet connection\n• Camera and microphone\n• Updated browser or mobile app\n• Good lighting for video calls\n\n⏰ **Scheduling Options:**\n• Same-day appointments\n• Scheduled consultations\n• Emergency teleconsultations\n• International consultations\n\n💰 **Pricing & Coverage:**\n• Insurance coverage available\n• Transparent pricing\n• No hidden fees\n• Prescription delivery included\n\n🔒 **Privacy & Security:**\n• HIPAA compliant platform\n• End-to-end encryption\n• Secure data storage\n• No recording without consent',
        timestamp: new Date(),
        suggestions: ['Book video consultation', 'Check technical setup', 'View pricing']
      };
    }
    
    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      const greetings = [
        'Hello! Great to see you again. I\'m here to help with all your healthcare needs. What would you like to know about today?',
        'Hi there! Welcome back to RakshaHealth. I\'m your AI health assistant, ready to help with appointments, records, medications, and more!',
        'Hey! Good to see you. I\'m MediBot, your personal healthcare companion. How can I assist you with your health journey today?'
      ];
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: greetings[Math.floor(Math.random() * greetings.length)],
        timestamp: new Date(),
        suggestions: ['Book appointment', 'Check records', 'Medication help', 'Health tips']
      };
    }
    
    // Thank you responses
    if (message.includes('thank') || message.includes('thanks')) {
      const thankYouResponses = [
        'You\'re very welcome! I\'m always here to help with your healthcare needs. Is there anything else I can assist you with?',
        'My pleasure! Your health is important, and I\'m glad I could help. Feel free to ask me anything else!',
        'You\'re most welcome! I\'m here 24/7 to support your healthcare journey. What else can I help you with today?'
      ];
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: thankYouResponses[Math.floor(Math.random() * thankYouResponses.length)],
        timestamp: new Date(),
        suggestions: ['Book another appointment', 'Health monitoring', 'Emergency info']
      };
    }
    
    // Default response for unrecognized queries
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: 'I understand you\'re looking for help with that. Let me provide you with some options that might be useful:\n\n🏥 **Healthcare Services:**\n• Appointment booking & management\n• Medical records access & sharing\n• Medication management & reminders\n• Emergency assistance & contacts\n• Health monitoring & wellness tips\n\n💡 **Specialized Help:**\n• Symptom assessment\n• Insurance & billing support\n• Telemedicine consultations\n• Nutrition & fitness guidance\n• Sleep health optimization\n\nPlease let me know which area you\'d like help with, and I\'ll provide detailed assistance!',
      timestamp: new Date(),
      suggestions: ['Book appointment', 'Medical records', 'Medications', 'Emergency help', 'Health tips', 'Symptom checker']
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 second delay
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <Card className="h-full shadow-2xl border-2">
        <CardHeader className="pb-3 bg-gradient-to-r from-primary to-secondary text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">MediBot AI</CardTitle>
                <p className="text-xs opacity-90">Healthcare Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
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
          <CardContent className="p-0 flex flex-col h-[calc(100%-80px)]">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('en-IN', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    {message.type === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-4 w-4 text-secondary" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Suggestions */}
                {messages.length > 0 && messages[messages.length - 1].suggestions && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
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

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-muted/30">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your health..."
                  className="flex-1"
                  disabled={isTyping}
                />
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
                <span>Your conversations are private and secure</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
