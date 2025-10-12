# PayChores 💳

A simple, privacy-focused bill tracking application to help you never miss a payment again.

## Features ✨

### Current Features (v1.0.0)
- **📋 Bill Management**: Add, edit, and delete bills with ease
- **📅 Due Date Tracking**: Automatic detection of overdue and due-soon bills  
- **🏷️ Category Organization**: Organize bills by type (utilities, rent, insurance, etc.)
- **💰 Payment Tracking**: Mark bills as paid/unpaid with timestamps
- **📊 Statistics Overview**: Dashboard with bill counts and total amounts
- **🔍 Filtering & Sorting**: Filter by category and payment status
- **📱 Responsive Design**: Works on desktop and mobile devices
- **💾 Data Export/Import**: Backup and restore your bill data
- **🔒 Privacy-First**: All data stored locally, no server required

### Coming Soon 🚀
- **☁️ Google Account Sync**: Sync bills across devices
- **🔔 Notifications**: Email and push reminders for due bills
- **📈 Analytics**: Spending insights and payment history
- **🔄 Recurring Bills**: Automatic bill generation for monthly expenses
- **👥 Shared Bills**: Split bills with roommates or family

## Tech Stack 🛠️

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **Storage**: Browser localStorage (Cloud sync coming soon)

## Getting Started 🚀

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage 📖

### Adding Your First Bill
1. Click the "Add Bill" button on the dashboard
2. Fill in the bill details:
   - **Name**: e.g., "Electric Bill"
   - **Amount**: Monthly amount in dollars
   - **Due Date**: When the bill is due
   - **Category**: Select from predefined categories
   - **Description**: Optional notes about the bill

### Managing Bills
- **Mark as Paid**: Click the green "Mark Paid" button
- **Edit**: Click "Edit" to modify bill details
- **Delete**: Click "Delete" to remove a bill
- **Filter**: Use the dropdown menus to filter by category or status

### Data Management
- **Export**: Download a backup of your bills as JSON
- **Import**: Restore bills from a backup file

## Architecture 🏗️

### Local-First Approach
- Bills are stored in browser localStorage for privacy and offline access
- No server required for basic functionality
- Future cloud sync will be opt-in

### Type Safety
- Full TypeScript implementation with strict typing
- Exhaustive checking for sort fields and categories
- Strong validation for all bill operations

### Future-Ready
- Authentication context prepared for Google OAuth
- Cloud sync hooks ready for implementation  
- Settings panel prepared for advanced features

## Privacy & Security 🔐

- **Local Storage**: All data stays on your device
- **No Tracking**: No analytics or user tracking
- **No Account Required**: Works offline without signup
- **Future Auth**: Google login will be optional for cloud sync

---

Made with ❤️ for better financial organization