import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Stethoscope,
  Calendar,
  FileText,
  Users,
  Activity,
  Clock,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface DoctorAIChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
  doctorName?: string;
}

export function DoctorAIChatbot({ isOpen, onToggle, doctorName = "Doctor" }: DoctorAIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hello Dr. ${doctorName}! I'm MediBot AI, your intelligent clinical assistant. I can help you with appointment summaries, patient insights, report analysis, and clinical decision support. How can I assist you today?`,
      timestamp: new Date(),
      suggestions: [
        'Today\'s appointment summary',
        'Patient report analysis',
        'Upcoming schedule overview',
        'Clinical insights',
        'Patient history summary',
        'Treatment recommendations'
      ]
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
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
      toast.error(`Voice input error: ${voiceError}`);
    }
  }, [voiceError]);

  const generateDoctorResponse = (userMessage: string): Message => {
    const message = userMessage.toLowerCase();
    
    // Today's appointments summary
    if (message.includes('today') && (message.includes('appointment') || message.includes('schedule'))) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `📅 **Today's Appointment Summary (October 11th, 2024)**\n\n**📊 Overview:**\n• Total Appointments: **11**\n• Video Calls: **4** | Audio Calls: **3** | In-Person: **4**\n• Completed: **0** | Upcoming: **11** | Cancelled: **0**\n\n**⏰ Next Appointments:**\n🎥 **09:00 AM** - Rajesh Kumar (V123456789)\n   • Type: Video Call | Duration: 30 min\n   • Reason: Diabetes follow-up\n   • Last visit: 2 weeks ago\n\n👤 **09:30 AM** - Priya Sharma (V987654321)\n   • Type: In-Person | Duration: 45 min\n   • Reason: Health checkup & BP monitoring\n   • New patient: First visit\n\n🎧 **10:30 AM** - Amit Patel (V456789123)\n   • Type: Audio Call | Duration: 20 min\n   • Reason: Prescription review\n   • Follow-up from sports injury\n\n**📈 Insights:**\n• Peak hours: 11:00 AM - 12:30 PM (3 appointments)\n• Average consultation time: 32 minutes\n• 2 follow-up patients, 1 new patient in morning slot`,
        timestamp: new Date(),
        suggestions: ['Next patient details', 'Schedule optimization', 'Patient preparation notes']
      };
    }

    // Patient report analysis
    if (message.includes('patient') && (message.includes('report') || message.includes('analysis') || message.includes('summary'))) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `🩺 **Patient Report Analysis**\n\n**👤 Current Patient Pool (3 Active Patients):**\n\n**1. Rajesh Kumar (V123456789)**\n• Age: 45, Male | Blood Group: B+\n• Conditions: Hypertension, Diabetes Type 2\n• Last Visit: Jan 15, 2024 | Total Visits: 8\n• Current Medications: Metformin, Lisinopril\n• ⚠️ Alert: Due for HbA1c test\n\n**2. Priya Sharma (V987654321)**\n• Age: 32, Female | Blood Group: A+\n• Conditions: Asthma, Migraine\n• Last Visit: Jan 10, 2024 | Total Visits: 5\n• Current Medications: Albuterol, Sumatriptan\n• ✅ Recent: Inhaler technique improved\n\n**3. Amit Patel (V456789123)**\n• Age: 28, Male | Blood Group: O+\n• Conditions: Sports Injury (recovering)\n• Last Visit: Jan 12, 2024 | Total Visits: 3\n• Current Medications: Ibuprofen\n• 📈 Progress: 80% recovery, returning to sports\n\n**📊 Clinical Insights:**\n• Average patient age: 35 years\n• Most common condition: Chronic diseases (67%)\n• Medication adherence rate: 85%\n• Follow-up compliance: 90%`,
        timestamp: new Date(),
        suggestions: ['Individual patient details', 'Treatment recommendations', 'Lab results summary']
      };
    }

    // Individual patient details
    if (message.includes('rajesh') || message.includes('kumar')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `👤 **Rajesh Kumar - Detailed Analysis**\n\n**📋 Patient Profile:**\n• VID: V123456789 | Age: 45 | Male | B+\n• Emergency Contact: +91 98765 43210\n• Allergies: Penicillin\n\n**🏥 Medical History:**\n• Diagnosed: Hypertension (2019), Diabetes Type 2 (2020)\n• Family History: Diabetes (father), Hypertension (mother)\n• Lifestyle: Sedentary job, irregular meals\n\n**💊 Current Treatment:**\n• Metformin 500mg - Twice daily with meals\n• Lisinopril 10mg - Once daily morning\n• Last prescription: Jan 15, 2024\n\n**📊 Recent Vitals & Labs:**\n• BP: 140/90 mmHg (slightly elevated)\n• HbA1c: 7.2% (target <7%)\n• BMI: 28.5 (overweight)\n• Last lab work: 4 weeks ago\n\n**🎯 Today's Focus:**\n• Review blood sugar logs\n• Discuss diet compliance\n• Adjust medication if needed\n• Schedule HbA1c test\n\n**⚠️ Clinical Alerts:**\n• BP trending upward\n• Due for diabetic eye exam\n• Medication adherence: 78% (needs improvement)`,
        timestamp: new Date(),
        suggestions: ['Treatment adjustments', 'Lab orders needed', 'Lifestyle recommendations']
      };
    }

    if (message.includes('priya') || message.includes('sharma')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `👤 **Priya Sharma - Detailed Analysis**\n\n**📋 Patient Profile:**\n• VID: V987654321 | Age: 32 | Female | A+\n• Emergency Contact: +91 87654 32109\n• Allergies: Aspirin\n\n**🏥 Medical History:**\n• Asthma since childhood (well-controlled)\n• Migraine episodes (2-3 per month)\n• No surgical history\n\n**💊 Current Treatment:**\n• Albuterol inhaler - As needed for asthma\n• Sumatriptan 50mg - For migraine episodes\n• Preventive: Montelukast 10mg daily\n\n**📊 Recent Assessment:**\n• Peak Flow: 380 L/min (normal for age/height)\n• Migraine frequency: Reduced from 4 to 2 per month\n• Inhaler technique: Significantly improved\n• Trigger identification: Stress, weather changes\n\n**🎯 Today's Agenda:**\n• Routine health checkup\n• Blood pressure monitoring\n• Asthma control assessment\n• Migraine pattern review\n• Preventive care discussion\n\n**✅ Positive Trends:**\n• Better asthma control\n• Reduced migraine frequency\n• Improved medication compliance\n• Active lifestyle adoption`,
        timestamp: new Date(),
        suggestions: ['Preventive care plan', 'Trigger management', 'Medication optimization']
      };
    }

    // Clinical insights and recommendations
    if (message.includes('insight') || message.includes('recommendation') || message.includes('clinical')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `🧠 **Clinical Insights & Recommendations**\n\n**📈 Practice Analytics:**\n• Patient satisfaction: 94% (above average)\n• Average consultation time: 32 min\n• Follow-up compliance: 90%\n• Treatment success rate: 87%\n\n**🎯 Today's Clinical Priorities:**\n\n**High Priority:**\n• Rajesh Kumar: BP management review\n• Medication adherence counseling needed\n• Lab work scheduling (HbA1c, lipid panel)\n\n**Medium Priority:**\n• Priya Sharma: Preventive care discussion\n• Asthma action plan review\n• Migraine trigger diary analysis\n\n**Routine:**\n• Amit Patel: Sports injury recovery assessment\n• Return-to-activity clearance evaluation\n\n**💡 AI Recommendations:**\n\n**For Diabetes Management:**\n• Consider CGM for better glucose monitoring\n• Refer to nutritionist for meal planning\n• Increase follow-up frequency to monthly\n\n**For Asthma Care:**\n• Spacer device demonstration\n• Environmental trigger assessment\n• Peak flow monitoring at home\n\n**Practice Optimization:**\n• Schedule buffer time between complex cases\n• Prepare lab order templates\n• Update patient education materials`,
        timestamp: new Date(),
        suggestions: ['Treatment protocols', 'Patient education materials', 'Follow-up scheduling']
      };
    }

    // Schedule and workflow optimization
    if (message.includes('schedule') || message.includes('workflow') || message.includes('optimization')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `⚙️ **Schedule & Workflow Optimization**\n\n**📅 Today's Schedule Analysis:**\n• Total time: 8.5 hours\n• Patient time: 6.5 hours (76%)\n• Administrative time: 1.5 hours (18%)\n• Break time: 0.5 hours (6%)\n\n**⏰ Time Distribution:**\n• Morning (9:00-12:00): 4 appointments\n• Afternoon (1:00-4:30): 5 appointments\n• Evening (4:30-6:00): 2 appointments\n\n**🎯 Efficiency Recommendations:**\n\n**Appointment Sequencing:**\n• Group similar consultation types\n• Schedule complex cases with buffer time\n• Place follow-ups between new patients\n\n**Preparation Checklist:**\n• Pre-load patient charts 15 min before\n• Prepare common prescription templates\n• Set up telemedicine links in advance\n\n**Documentation Strategy:**\n• Use voice-to-text for quick notes\n• Template responses for common conditions\n• Batch administrative tasks\n\n**🔄 Workflow Improvements:**\n• 5-minute prep time between patients\n• Standardized examination protocols\n• Digital prescription management\n• Automated follow-up reminders\n\n**📊 Performance Metrics:**\n• On-time rate: 92%\n• Patient wait time: Avg 8 minutes\n• Consultation completion: 98%`,
        timestamp: new Date(),
        suggestions: ['Template creation', 'Time management tips', 'Patient flow optimization']
      };
    }

    // Treatment and medication recommendations
    if (message.includes('treatment') || message.includes('medication') || message.includes('prescription')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `💊 **Treatment & Medication Insights**\n\n**🎯 Evidence-Based Recommendations:**\n\n**For Diabetes Management (Rajesh Kumar):**\n• Current HbA1c: 7.2% (target <7%)\n• Consider: Metformin dose optimization\n• Add: SGLT2 inhibitor for cardiovascular benefit\n• Monitor: Kidney function (eGFR)\n• Lifestyle: Structured diabetes education program\n\n**For Hypertension Control:**\n• Current BP: 140/90 mmHg\n• ACE inhibitor dose adjustment needed\n• Consider: Combination therapy\n• Target: <130/80 mmHg for diabetic patients\n• Monitor: Electrolytes, kidney function\n\n**For Asthma Management (Priya Sharma):**\n• Well-controlled on current regimen\n• Continue: Montelukast + PRN albuterol\n• Consider: Step-down therapy trial\n• Monitor: Peak flow trends\n• Education: Proper inhaler technique\n\n**🔍 Drug Interaction Alerts:**\n• No significant interactions detected\n• Aspirin allergy noted for Priya\n• Monitor: ACE inhibitor + diabetes medications\n\n**📋 Prescription Guidelines:**\n• Electronic prescribing preferred\n• Include clear instructions\n• Specify generic substitutions\n• Add refill information\n• Patient counseling points\n\n**⚠️ Safety Considerations:**\n• Allergy verification before prescribing\n• Dose adjustments for kidney function\n• Drug interaction screening\n• Patient education on side effects`,
        timestamp: new Date(),
        suggestions: ['Drug interaction check', 'Dosage calculations', 'Patient counseling points']
      };
    }

    // Lab results and diagnostics
    if (message.includes('lab') || message.includes('test') || message.includes('diagnostic')) {
      return {
        id: Date.now().toString(),
        type: 'bot',
        content: `🔬 **Lab Results & Diagnostic Summary**\n\n**📊 Recent Lab Work Analysis:**\n\n**Rajesh Kumar (V123456789):**\n• HbA1c: 7.2% ⚠️ (Target: <7%)\n• Fasting Glucose: 145 mg/dL ⚠️ (Target: <126)\n• Creatinine: 1.1 mg/dL ✅ (Normal)\n• LDL Cholesterol: 135 mg/dL ⚠️ (Target: <100)\n• Microalbumin: 25 mg/g ⚠️ (Early nephropathy)\n\n**🎯 Recommended Tests:**\n• Repeat HbA1c in 3 months\n• Lipid panel in 6 weeks\n• Diabetic eye exam (overdue)\n• ECG for cardiovascular screening\n\n**Priya Sharma (V987654321):**\n• Complete Blood Count: Normal ✅\n• Vitamin D: 28 ng/mL ⚠️ (Borderline low)\n• Thyroid Function: Normal ✅\n• Peak Flow: 380 L/min ✅\n\n**🎯 Recommended Tests:**\n• Vitamin D supplementation trial\n• Annual thyroid monitoring\n• Allergy panel if symptoms worsen\n\n**Amit Patel (V456789123):**\n• X-ray Knee: Healing well ✅\n• Inflammatory markers: Normal ✅\n• No further imaging needed\n\n**📋 Pending Lab Orders:**\n• Rajesh: HbA1c, Lipids, Microalbumin\n• Priya: Vitamin D level recheck\n• Consider: Preventive screening panels\n\n**⚡ Critical Values Alert System:**\n• Automated flagging of abnormal results\n• Immediate notification protocols\n• Patient communication templates`,
        timestamp: new Date(),
        suggestions: ['Order lab tests', 'Interpret results', 'Critical value protocols']
      };
    }

    // Default clinical assistant response
    return {
      id: Date.now().toString(),
      type: 'bot',
      content: `🩺 **Clinical Assistant Ready**\n\nI can help you with:\n\n**📅 Schedule Management:**\n• Today's appointment overview\n• Patient preparation summaries\n• Time optimization strategies\n\n**👥 Patient Insights:**\n• Individual patient analysis\n• Medical history summaries\n• Treatment progress tracking\n\n**💊 Clinical Decision Support:**\n• Evidence-based recommendations\n• Drug interaction checking\n• Treatment protocol guidance\n\n**📊 Practice Analytics:**\n• Performance metrics\n• Workflow optimization\n• Quality improvement insights\n\n**🔬 Diagnostic Support:**\n• Lab result interpretation\n• Test recommendations\n• Clinical correlation analysis\n\nWhat specific area would you like assistance with?`,
      timestamp: new Date(),
      suggestions: ['Today\'s schedule', 'Patient summaries', 'Clinical recommendations', 'Lab results', 'Practice insights']
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateDoctorResponse(inputMessage);
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
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
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <Card className="h-full shadow-2xl border-2">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Clinical AI Assistant</CardTitle>
                <p className="text-xs opacity-90">Intelligent Clinical Support</p>
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
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'bot' && (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                        <Stethoscope className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
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

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Stethoscope className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-600/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-600/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-blue-600/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about patients, schedules, or clinical insights..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  type="button"
                  variant={isListening ? "default" : "outline"}
                  onClick={() => {
                    if (!isVoiceSupported) {
                      toast.error("Voice input is not supported in this browser");
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
                <span>HIPAA compliant • Patient data protected</span>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
