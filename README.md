# ItemSeek2 - Mobile-First Inventory Management System

A comprehensive, industry-agnostic inventory management system built with a mobile-first approach and microservices architecture.

## 🚀 Key Features

- **Mobile-First Design**: Touch-optimized UI with 48px minimum targets
- **Industry Agnostic**: Adaptable to hotels, restaurants, healthcare, retail, etc.
- **Multi-Tenant**: Complete organization isolation
- **AI Integration**: Workflow automation with multiple AI providers
- **Microservices**: 6 specialized apps working together
- **Real-time Updates**: Live inventory tracking
- **Role-Based Access**: Granular permission system

## 🏗️ Architecture

### Frontend Apps (Mobile-First)
- **Main App** (Port 3000): Login and app launcher
- **Inventory** (Port 3002): Core inventory management
- **Admin** (Port 3003): System administration
- **AI Connector** (Port 3004): Workflow automation
- **User Manager** (Port 3005): User and role management

### Backend
- **API Server** (Port 3100): RESTful API with JWT auth
- **Database**: PostgreSQL with Drizzle ORM
- **Security**: Rate limiting, CORS, Helmet

### Shared Packages
- **@itemseek2/ui-mobile**: Touch-optimized components
- **@itemseek2/api-client**: API client with hooks
- **@itemseek2/shared**: Types, schemas, utilities

## 📱 Mobile-First Features

- **Stack Navigation**: No floating modals, easy back navigation
- **Touch Gestures**: Swipeable lists with haptic feedback
- **Bottom Sheets**: Mobile-friendly interactions
- **Offline Support**: Progressive Web App ready
- **Responsive**: Adapts from mobile to tablet

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Express.js, PostgreSQL, Drizzle ORM
- **Monorepo**: TurboRepo with pnpm workspaces
- **Authentication**: JWT with refresh tokens
- **Validation**: Zod schemas
- **State**: Zustand for local, SWR for server

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pnpm 8+ (`npm install -g pnpm`)

### 1. Clone Repositories

```bash
# Frontend
git clone https://github.com/opentimejapan/itemseek2.git
cd itemseek2

# Backend (in separate terminal)
git clone https://github.com/opentimejapan/itemseek2-backend.git
cd itemseek2-backend
```

### 2. Backend Setup

```bash
cd itemseek2-backend
npm install
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npm run db:push
npm run db:seed  # Creates demo users

# Start backend
npm run dev
```

### 3. Frontend Setup

```bash
cd itemseek2
pnpm install

# Start all apps
pnpm dev
```

### 4. Access Apps

- Main App: http://localhost:3000
- Backend API: http://localhost:3100

**Demo Credentials:**
- Admin: `admin@demo.com` / `demo123456`
- Manager: `manager@demo.com` / `demo123456`

## 📋 Development Scripts

```bash
# Frontend
pnpm dev           # Start all apps in dev mode
pnpm build         # Build all apps
pnpm test:integration  # Run integration tests

# Backend
npm run dev        # Start dev server
npm run build      # Build for production
npm run db:studio  # Open Drizzle Studio
```

## 🏢 Multi-Tenancy

Each organization has complete data isolation:
- Separate inventory items
- Independent user management
- Custom settings and AI providers
- Industry-specific configurations

## 👥 Role Hierarchy

1. **Organization Admin**: Full organization control
2. **Manager**: Inventory and team management
3. **User**: Standard inventory operations
4. **Viewer**: Read-only access

## 🤖 AI Integration

Supports multiple providers:
- OpenAI (GPT-4)
- Anthropic (Claude)
- Google AI
- Custom endpoints

## 🔒 Security

- Password hashing with bcrypt
- JWT with secure refresh tokens
- Rate limiting on all endpoints
- CORS protection
- SQL injection prevention
- XSS protection

## 📱 PWA Support

The apps are Progressive Web App ready:
- Installable on mobile devices
- Offline support (coming soon)
- Push notifications (coming soon)

## 🚢 Production Deployment

See individual README files:
- [Frontend Deployment](./docs/frontend-deployment.md)
- [Backend Deployment](../itemseek2-backend/README.md)

## 📄 License

Private - ItemSeek2 © 2024

## 🤝 Contributing

This is a private repository. Please contact the team for access.

---

Built with ❤️ using modern web technologies