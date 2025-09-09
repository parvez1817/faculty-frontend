# ReIDentify Frontend

A React-based faculty dashboard for managing student ID card requests at Sona College of Technology.

## Features

- Faculty authentication with database validation
- Student ID card request management
- Approve/reject functionality with confirmation dialogs
- Real-time status updates
- Responsive design with mobile support
- Glass morphism UI design

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:8080](http://localhost:8080) in your browser

### Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── Dashboard.tsx   # Main dashboard component
│   │   ├── LoginPage.tsx   # Faculty login page
│   │   └── RequestCard.tsx # Student request card component
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── main.tsx           # Application entry point
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

The frontend connects to the backend API running on `http://localhost:5000`. Make sure the backend server is running before starting the frontend.

## API Integration

The frontend communicates with the backend through REST API endpoints:

- `GET /api/pending` - Fetch pending requests
- `GET /api/acchistoryid` - Fetch approved history
- `GET /api/rejhistoryids` - Fetch rejected history
- `PATCH /api/requests/:id/status` - Update request status
- `GET /api/check-faculty/:id` - Validate faculty ID