# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (default port: 3000)
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture

### Local-First Design Pattern
PayChores is built with a local-first architecture using browser localStorage as the primary data store. The app is designed to work offline without any server dependencies, with cloud sync planned as a future opt-in feature.

### Key Data Flow
- **Storage**: All bill data is persisted to `localStorage` via the `useBills` hook
- **State Management**: React hooks for local state, no external state management library
- **Data Structure**: Strongly typed TypeScript interfaces for all bill operations
- **Future-Ready**: Authentication context and cloud sync hooks are prepared but not implemented

### Component Architecture
The app follows a modular component structure:
- **Barrel Exports**: All components exported through `src/components/index.ts`
- **Hook-Based Logic**: Business logic centralized in custom hooks (`useBills`, `useFilteredBills`, `useBillStats`)
- **Type Safety**: Exhaustive checking for enums and sort fields using TypeScript's `never` type
- **Form Handling**: Controlled components with strong typing for form data

### Bill Management System
The core domain is built around the `Bill` interface with:
- **Categories**: Pre-defined set of 12 bill categories (utilities, rent, insurance, etc.)
- **Status Tracking**: Bills can be marked paid/unpaid with automatic timestamp tracking
- **Filtering & Sorting**: Type-safe filtering by category, status, and date ranges
- **Statistics**: Real-time calculated stats for overdue, due soon, and payment totals

### Future-Proofed Features
Several features are architecturally prepared but not yet implemented:
- **Google OAuth**: AuthContext with placeholder methods for authentication
- **Cloud Sync**: Sync status tracking and placeholder methods in useBills hook
- **Premium Features**: User tier checking prepared for future subscription model

### Tech Stack Specifics
- **Next.js 15** with App Router and Turbopack for development
- **TypeScript** with strict mode enabled for all files
- **Tailwind CSS v4** for styling
- **date-fns** for date manipulation
- **Outfit font** from Google Fonts as the primary typeface

### File Structure Patterns
- `src/types/` - TypeScript interfaces and type definitions
- `src/hooks/` - Custom React hooks for business logic
- `src/components/` - Organized by purpose (ui, cards, forms, layout, context)
- `src/app/` - Next.js App Router pages and layouts

When modifying this codebase, maintain the local-first philosophy, strong TypeScript typing, and prepare for future cloud integration without breaking existing localStorage functionality.