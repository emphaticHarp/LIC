# LIC Insurance Management System

A comprehensive, modern web application for managing Life Insurance Corporation of India (LIC) operations. Built with Next.js 16, TypeScript, and cutting-edge web technologies.

## 🚀 Project Overview

This is a full-featured insurance management system that streamlines the entire insurance lifecycle - from customer onboarding and policy creation to claims processing and commission tracking. The system is designed for insurance agents, administrators, and customers with role-based access control.

## ✨ Key Features

### 🏠 Customer Management
- **Customer Onboarding**: Complete digital KYC process
- **Profile Management**: Comprehensive customer profiles with documents
- **Policy History**: Track all customer policies and renewals
- **Communication**: Integrated messaging and notifications

### 📋 Policy Management
- **Policy Creation**: Multi-step policy application with validation
- **Premium Calculator**: Dynamic premium calculation based on multiple factors
- **Policy Types**: Support for Term Life, Endowment, Whole Life, ULIP, Health Insurance
- **Document Generation**: Automatic policy document generation with PDF export
- **Digital Signatures**: Integrated digital signature capabilities

### 💰 Claims Processing
- **Claim Registration**: Easy claim registration with document upload
- **Claim Tracking**: Real-time claim status updates
- **Document Management**: Secure document storage and retrieval
- **Approval Workflow**: Multi-level claim approval process

### 💳 Payment Management
- **Online Payments**: Secure payment gateway integration
- **Payment History**: Complete payment records and receipts
- **Premium Reminders**: Automated premium due notifications
- **Multiple Payment Modes**: Support for various payment methods

### 📊 Analytics & Reporting
- **Dashboard**: Comprehensive analytics dashboard
- **Sales Reports**: Detailed sales and commission reports
- **Customer Insights**: Advanced customer analytics
- **Performance Metrics**: Agent performance tracking

### 👥 Agent Management
- **Agent Profiles**: Complete agent information management
- **Commission Tracking**: Real-time commission calculations
- **Performance Analytics**: Agent performance metrics
- **Target Management**: Sales target setting and tracking

## 🛠 Technology Stack

### Frontend Framework
- **Next.js 16.0.5** - React framework with App Router
- **React 19.2.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### UI & Styling
- **Tailwind CSS v4** - Modern utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icon library
- **Framer Motion** - Smooth animations and transitions

### State Management
- **Redux Toolkit** - Predictable state container
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### Backend & Database
- **Firebase** - Authentication and real-time database
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time communication

### Additional Libraries
- **jsPDF** - PDF generation
- **html2canvas** - HTML to image conversion
- **QR Code** - QR code generation
- **Recharts** - Data visualization
- **SweetAlert2** - Beautiful alerts
- **Lottie Files** - Animations

## 📁 Project Structure

```
lic/
├── app/                    # Next.js App Router pages
│   ├── agents/            # Agent management
│   ├── analysis/          # Data analytics
│   ├── claims/            # Claims processing
│   ├── collections/       # Payment collections
│   ├── commission/        # Commission tracking
│   ├── customers/         # Customer management
│   ├── dashboard/         # Main dashboard
│   ├── new-policy/        # Policy creation
│   ├── payments/          # Payment processing
│   ├── policies/          # Policy management
│   ├── reports/           # Reporting system
│   └── settings/          # Application settings
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── providers/        # Context providers
│   └── certificate/      # Certificate generator
├── lib/                   # Utility functions
├── store/                 # Redux store
│   └── slices/           # Redux slices
└── public/               # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/emphaticHarp/LIC.git
   cd LIC
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following environment variables:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # MongoDB Configuration
   MONGODB_URI=your_mongodb_connection_string

   # Additional Configuration
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Build & Deployment

### Build for Production
```bash
npm run build
npm start
```

### Deployment Options

#### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/emphaticHarp/LIC.git)

#### Docker
```bash
docker build -t lic-insurance .
docker run -p 3000:3000 lic-insurance
```

#### Static Export
```bash
npm run build
npm run export
```

## 📱 Features in Detail

### Policy Creation Process
1. **Applicant Information**: Complete personal and professional details
2. **Policy Selection**: Choose from various insurance products
3. **Nominee Details**: Add nominee information
4. **Medical Information**: Health details and medical history
5. **Document Upload**: Secure document submission
6. **Premium Calculation**: Real-time premium calculation
7. **Digital Signature**: Secure digital signing
8. **PDF Generation**: Instant policy document generation

### Dashboard Analytics
- **Real-time Statistics**: Live policy and customer metrics
- **Revenue Tracking**: Premium collection and revenue analytics
- **Performance Charts**: Visual representation of key metrics
- **Agent Leaderboard**: Top performing agents
- **Claim Statistics**: Claims processing metrics

### Security Features
- **Firebase Authentication**: Secure user authentication
- **Role-Based Access**: Different access levels for different roles
- **Data Encryption**: Encrypted data storage and transmission
- **Audit Logs**: Complete activity tracking
- **Secure File Upload**: Safe document handling

## 🎨 UI/UX Highlights

### Design System
- **Modern Design**: Clean, professional interface
- **Dark Mode**: Complete dark theme support
- **Responsive Design**: Mobile-first approach
- **Accessible Components**: WCAG compliant UI
- **Smooth Animations**: Delightful micro-interactions
- **Loading States**: Beautiful loading animations

### User Experience
- **Intuitive Navigation**: Easy-to-use interface
- **Progress Indicators**: Clear step-by-step processes
- **Form Validation**: Real-time validation feedback
- **Error Handling**: Graceful error management
- **Success Feedback**: Positive reinforcement messages

## 🔧 Configuration

### Tailwind CSS Configuration
The project uses Tailwind CSS v4 with custom configuration:
- Custom color palette with OKLCH color space
- Responsive breakpoints
- Custom animations and transitions
- Component-specific utilities

### Redux Store Structure
```typescript
store/
├── agentSlice.ts      # Agent management state
├── authSlice.ts       # Authentication state
├── claimSlice.ts      # Claims processing state
├── customerSlice.ts   # Customer management state
├── notificationSlice.ts # Notification system
├── paymentSlice.ts    # Payment processing state
├── policySlice.ts     # Policy management state
└── uiSlice.ts         # UI state management
```

## 📊 Database Schema

### Key Collections
- **Users**: User profiles and authentication
- **Policies**: Insurance policy details
- **Claims**: Claims information and status
- **Payments**: Payment records and transactions
- **Agents**: Agent profiles and performance
- **Customers**: Customer information and policies

## 🧪 Testing

### Running Tests
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and database integration
- **E2E Tests**: Complete user journey testing
- **Performance Tests**: Load and stress testing

## 📈 Performance

### Optimization Features
- **Code Splitting**: Automatic code splitting
- **Image Optimization**: Next.js image optimization
- **Caching Strategy**: Intelligent caching mechanisms
- **Bundle Optimization**: Optimized bundle sizes
- **Lazy Loading**: Component and route lazy loading

### Performance Metrics
- **Lighthouse Score**: 95+ across all categories
- **Core Web Vitals**: Optimized user experience
- **Bundle Size**: Optimized for fast loading
- **SEO**: Search engine optimized

## 🔒 Security

### Security Measures
- **Authentication**: Firebase Auth with social providers
- **Authorization**: Role-based access control
- **Data Validation**: Comprehensive input validation
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery prevention
- **Secure Headers**: Security headers implementation

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: iOS 14+
- **Chrome Mobile**: Android 10+

## 📝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

### Getting Help
- **Documentation**: [Project Documentation](https://github.com/emphaticHarp/LIC/wiki)
- **Issues**: [GitHub Issues](https://github.com/emphaticHarp/LIC/issues)
- **Discussions**: [GitHub Discussions](https://github.com/emphaticHarp/LIC/discussions)

### Contact
- **Email**: support@lic-insurance.com
- **Website**: [lic-insurance.com](https://lic-insurance.com)
- **Twitter**: [@lic_insurance](https://twitter.com/lic_insurance)

## 🗺 Roadmap

### Upcoming Features
- [ ] **Mobile App**: React Native mobile application
- [ ] **AI Integration**: Smart recommendations and predictions
- [ ] **Blockchain**: Smart contracts for policy management
- [ ] **Voice Assistant**: Voice-activated features
- [ ] **Advanced Analytics**: Machine learning insights
- [ ] **Multi-language Support**: International language support
- [ ] **API Gateway**: RESTful API for third-party integrations

### Version History
- **v1.0.0** - Initial release with core features
- **v1.1.0** - Enhanced dashboard and analytics
- **v1.2.0** - Mobile responsiveness improvements
- **v2.0.0** - Major architecture overhaul with Next.js 16

## 🏆 Acknowledgments

- **LIC India** - For the inspiration and opportunity
- **Open Source Community** - For the amazing tools and libraries
- **Contributors** - Everyone who has contributed to this project

---

**Built with ❤️ by the LIC Development Team**

*"Securing futures, one policy at a time"*
