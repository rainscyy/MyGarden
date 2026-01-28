# Forest Garden Plant - Productivity Tracker

## Overview

Forest Garden Plant is a 3-tier productivity tracker web application that visualizes focus sessions using a nature metaphor:
- **Forest** (Tier 1): Life overview dashboard showing system health and monthly summaries
- **Garden** (Tier 2): Category/project management with statistics
- **Plant** (Tier 3): Individual task and focus session tracking

The application is a client-side MVP using local storage for data persistence, built with React and Express.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: React hooks with custom `useData` hook for centralized data operations
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with path aliases (`@/` for client/src, `@shared/` for shared)

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Pattern**: Minimal REST API structure (routes.ts for endpoints)
- **Storage Interface**: Abstract `IStorage` interface with in-memory implementation
- **Static Serving**: Production serves built client from `dist/public`

### Data Model
The application uses browser localStorage for persistence with two main entities:
- **Category**: `{ id, name, color }` - Represents a project or life dimension
- **Session**: `{ id, categoryId, title, minutesFocused, status: "done"|"failed", dateISO }` - Individual focus sessions

### Key Design Decisions

1. **Local Storage First**: Data persists in browser localStorage rather than a database, making the MVP fully functional without backend state. Mock data is generated on first visit.

2. **Shared Schema Pattern**: The `shared/` directory contains schema definitions using Drizzle ORM and Zod, allowing type sharing between frontend and backend. Currently configured for PostgreSQL but not actively used.

3. **Component Library**: Uses shadcn/ui with Radix primitives for accessible, customizable UI components. Components live in `client/src/components/ui/`.

4. **Theme Support**: Dark/light mode toggle with CSS variables defined in `index.css`.

## External Dependencies

### Database
- **Drizzle ORM**: Configured for PostgreSQL (`drizzle.config.ts`)
- **PostgreSQL**: Schema defined but application currently uses localStorage
- **connect-pg-simple**: Available for session storage when database is added

### UI Libraries
- **Radix UI**: Full primitive component set for accessibility
- **Recharts**: Data visualization for monthly focus charts
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel component support

### Development
- **Vite**: Development server with HMR
- **TSX**: TypeScript execution for server
- **Drizzle Kit**: Database migration tooling (`db:push` script)

### Replit-Specific
- `@replit/vite-plugin-runtime-error-modal`: Error overlay in development
- `@replit/vite-plugin-cartographer`: Development tooling
- `@replit/vite-plugin-dev-banner`: Development environment indicator