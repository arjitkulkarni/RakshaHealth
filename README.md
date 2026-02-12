# RakshaHealth 🏥


**Comprehensive Healthcare Management Platform**

A blockchain-enabled healthcare ecosystem that connects patients, doctors, and pharmacies through secure digital infrastructure. RakshaHealth provides integrated healthcare services with real-time QR code drug authentication, appointment management, and comprehensive medical record management.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-cyan)
![ZXing](https://img.shields.io/badge/ZXing-QR_Scanner-green)

---

## 🌟 Core Features

### 👥 **Multi-Portal Architecture**

#### 🏠 **Patient Portal**
- **Secure Authentication**: Phone number + 4-digit Safe PIN system
- **Multi-language Support**: English, Hindi, Telugu, Tamil, Marathi
- **Blockchain VID**: Unique Virtual ID generation for each patient
- **Digital Wallet**: MediVoucher system with transaction tracking
- **Medical Records**: Secure document storage and management
- **Appointment Booking**: Complete appointment request/accept/reject workflow

#### 👨‍⚕️ **Doctor Portal**
- **Professional Dashboard**: Complete patient management system
- **Appointment Management**: Scheduling, calendar integration, patient notifications
- **Billing System**: Invoice generation, payment tracking, MediVoucher integration
- **Medical Records**: Digital prescription management and patient history
- **AI Chatbot**: Clinical decision support and medical assistance
- **Patient Records**: Comprehensive patient data management

#### 💊 **Pharmacy Portal**
- **Comprehensive Registration**: Pharmacy details, licensing, address verification
- **Blockchain VID**: Unique pharmacy identification system
- **Inventory Management**: 50+ medicine database with real-time stock tracking
- **Order Processing**: Online customer orders with status tracking
- **Stock Monitoring**: In-stock, low-stock, and out-of-stock alerts
- **Analytics Dashboard**: Business performance and inventory analytics

### 🔐 **Advanced Security Features**
- **QR Code Drug Authentication**: Real camera-based QR scanning with ZXing library
- **Blockchain Integration**: Secure VID generation and transaction verification
- **Safe PIN System**: 4-digit PIN authentication across all portals
- **Session Management**: Persistent authentication with secure logout

### 🚀 **Real-time Services**
- **TeleHealth**: Video consultations and remote healthcare
- **BloodChain**: Blood donor network with location-based matching
- **Insurance Integration**: Health and life insurance management
- **Emergency Services**: Urgent care access and emergency contacts

### 🤖 **AI Integration**
- **Patient AI Chatbot**: Health queries, symptom checking, general guidance
- **Doctor AI Assistant**: Clinical decision support, treatment recommendations
- **Smart Analytics**: Predictive health insights and trend analysis

---

## 🏗️ Tech Stack

### **Frontend**
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.19
- **Routing**: React Router DOM v6
- **UI Library**: shadcn-ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4.17
- **State Management**: React Context API + TanStack Query
- **Form Handling**: React Hook Form + Zod validation
- **Notifications**: Sonner

### **Key Libraries**
- **QR Code Scanning**: ZXing library for real camera-based scanning
- **Icons**: Lucide React (100+ icons)
- **Charts**: Recharts for analytics dashboards
- **Date Handling**: date-fns
- **Notifications**: Sonner for toast notifications
- **Utilities**: clsx, tailwind-merge

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- npm or bun

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd p1
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   bun run dev
   ```

4. **Open your browser**
   ```
   http://localhost:8083
   ```

### **Build for Production**
```bash
npm run build
npm run preview
```

---

## 📂 Project Structure

```
MediNation/
├── src/
│   ├── components/
│   │   ├── ui/                     # 50+ shadcn UI components
│   │   ├── AIChatbot.tsx           # Patient AI assistant
│   │   └── DoctorAIChatbot.tsx     # Doctor AI assistant
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Authentication state management
│   │   ├── AppointmentContext.tsx  # Appointment management
│   │   └── BillingContext.tsx      # Payment & billing context
│   ├── pages/
│   │   ├── Auth.tsx                # Patient authentication
│   │   ├── Dashboard.tsx           # Patient dashboard
│   │   ├── Records.tsx             # Medical records
│   │   ├── Wallet.tsx              # Digital wallet & payments
│   │   ├── DrugAuth.tsx            # QR code drug authentication
│   │   ├── BookAppointment.tsx     # Appointment booking
│   │   ├── TeleHealth.tsx          # Video consultations
│   │   ├── BloodChain.tsx          # Blood donor network
│   │   ├── Insurance.tsx           # Insurance management
│   │   ├── Settings.tsx            # User settings
│   │   ├── DoctorAuth.tsx          # Doctor authentication
│   │   ├── DoctorDashboard.tsx     # Doctor portal
│   │   ├── DoctorPatients.tsx      # Patient management
│   │   ├── DoctorSchedule.tsx      # Doctor scheduling
│   │   ├── DoctorBilling.tsx       # Doctor billing
│   │   ├── DoctorRecords.tsx       # Medical records management
│   │   ├── PharmacyAuth.tsx        # Pharmacy authentication
│   │   ├── PharmacyRegistration.tsx # Pharmacy overview
│   │   └── PharmacyDashboard.tsx   # Pharmacy management
│   ├── lib/
│   │   └── utils.ts                # Utility functions
│   ├── App.tsx                     # Main app with routing
│   └── main.tsx                    # Entry point
├── public/                         # Static assets
├── index.html                      # HTML template
├── package.json                    # Dependencies
├── tailwind.config.ts              # Tailwind configuration
└── vite.config.ts                  # Vite configuration
```

---

## 🔑 Key Concepts

### **Blockchain VID System**
Each user receives a unique Virtual ID generated using blockchain-inspired algorithms:

#### **Patient VID**
- Format: `V` + 9-digit unique identifier
- Generated from: phone number + timestamp + hash algorithm
- Used for: Medical records, appointments, payments

#### **Pharmacy VID**
- Format: `PV` + 12-character encoded hash
- Generated from: pharmacy ID + name + timestamp
- Used for: Pharmacy identification, order tracking, inventory

### **Multi-Portal Authentication**
Secure authentication system across all portals:
- **Safe PIN System**: 4-digit PIN for all user types
- **Phone Validation**: Indian mobile number format (10 digits)
- **Session Management**: Persistent login with secure logout
- **Role-based Access**: Separate authentication flows for patients, doctors, pharmacies

### **QR Code Drug Authentication**
Real-time medicine verification system:
- **Camera Integration**: Uses device camera for QR scanning
- **ZXing Library**: Professional-grade QR code recognition
- **Blockchain Verification**: Secure drug authenticity checking
- **Real-time Results**: Instant verification feedback

### **Data Architecture**
Multi-layered data storage system:
- **Patient Data**: Medical records, appointments, wallet transactions
- **Doctor Data**: Patient management, billing, schedules
- **Pharmacy Data**: Inventory, orders, analytics
- **Blockchain Records**: VIDs, transactions, authentications

---

## 🎨 Design Philosophy

- **Mobile-First**: Responsive design for all screen sizes
- **Accessibility**: ARIA labels, keyboard navigation, focus states
- **Modern UI**: Gradient backgrounds, card-based layouts, smooth animations
- **User-Friendly**: Clear error messages, toast notifications, tooltips
- **Indian Context**: Multi-language support, Indian phone format, rupee currency

---

## 🛣️ Routing

### **Patient Portal Routes**
| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Patient Authentication (Sign In/Sign Up) | No |
| `/dashboard` | Patient dashboard | Yes |
| `/records` | Medical records viewer | Yes |
| `/wallet` | Digital wallet & payments | Yes |
| `/drugauth` | QR code drug authentication | Yes |
| `/book-appointment` | Appointment booking | Yes |
| `/telehealth` | Video consultations | Yes |
| `/bloodchain` | Blood donor network | Yes |
| `/insurance` | Insurance management | Yes |
| `/settings` | User settings | Yes |

### **Doctor Portal Routes**
| Route | Description | Protected |
|-------|-------------|-----------|
| `/doctor-auth` | Doctor authentication | No |
| `/doctor-dashboard` | Doctor dashboard | Yes |
| `/doctor-patients` | Patient management | Yes |
| `/doctor-schedule` | Appointment scheduling | Yes |
| `/doctor-billing` | Billing & invoicing | Yes |
| `/doctor-records` | Medical records management | Yes |

### **Pharmacy Portal Routes**
| Route | Description | Protected |
|-------|-------------|-----------|
| `/pharmacy-auth` | Pharmacy authentication | No |
| `/pharmacy-registration` | Pharmacy overview page | Yes |
| `/pharmacy-dashboard` | Pharmacy management | Yes |

---

## 🧪 Demo Credentials

### **Patient Portal**
- Create a new account with any 10-digit phone number
- Set a 4-digit Safe PIN during registration
- Use the same credentials to sign in

### **Doctor Portal**
- **Demo Doctor ID**: `DOC001`
- **Demo Password**: `doctor123`
- Access full doctor dashboard and patient management

### **Pharmacy Portal**
- **Demo Pharmacy ID**: `PH001`
- **Demo Safe PIN**: `1234`
- Complete pharmacy registration to access full features
- View 50+ medicine inventory with real-time stock status

---

## 🤝 Contributing

This is a hackathon project. If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🎯 Use Cases

### **Healthcare Providers**
- **Digital Transformation**: Complete paperless workflow management
- **Patient Management**: Comprehensive patient records and appointment systems
- **Revenue Optimization**: Integrated billing and payment processing
- **Quality Care**: AI-assisted diagnostics and treatment recommendations

### **Patients**
- **Unified Healthcare**: All medical services in one secure platform
- **Secure Records**: Blockchain-protected health data with VID system
- **Convenience**: Online consultations, medicine delivery, appointment booking
- **Transparency**: Clear pricing, treatment tracking, and health analytics

### **Pharmacies**
- **Inventory Management**: Real-time stock monitoring with 50+ medicine database
- **Online Operations**: Digital pharmacy with order processing capabilities
- **Compliance**: Regulatory requirement management and licensing
- **Business Growth**: Analytics dashboard and expanded customer reach

---

## 📝 License

This project is built for educational and demonstration purposes showcasing modern healthcare technology solutions.

---

## 🙏 Acknowledgments

- **UI Framework**: [shadcn-ui](https://ui.shadcn.com) for beautiful, accessible components
- **Icons**: [Lucide](https://lucide.dev) for comprehensive icon library
- **QR Scanning**: [ZXing](https://github.com/zxing-js/library) for professional QR code recognition
- **Inspiration**: India's digital health initiatives and healthcare accessibility challenges

---

## 📧 Contact & Support

For technical questions, feature requests, or collaboration opportunities, please create an issue in the repository.

---

## 🚀 Deployment

### **Development Server**
```bash
npm run dev
# Access at http://localhost:8083
```

### **Production Build**
```bash
npm run build
npm run preview
```

### **Deploy to Vercel/Netlify**
```bash
npm run build
# Upload the dist/ folder to your hosting provider
```

---

## 🔮 Future Roadmap

- **Mobile App**: React Native version for iOS and Android
- **Advanced AI**: Machine learning for predictive health analytics
- **IoT Integration**: Smart device connectivity for health monitoring
- **Blockchain Enhancement**: Full blockchain implementation for data integrity
- **Government Integration**: Direct connection with national health databases

---

**Built with ❤️ for the future of healthcare technology**
