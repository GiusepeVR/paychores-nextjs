import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-gray-900 text-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='col-span-1 md:col-span-2'>
            <Link href='/' className='flex items-center space-x-2 text-2xl font-bold text-primary-400'>
              <span className='text-3xl'>💳</span>
              <span className='text-white'>PayChores</span>
            </Link>
            <p className='mt-4 text-gray-300 max-w-md'>
              Never miss a bill payment again. Track, organize, and manage all your recurring expenses in one simple, intuitive dashboard.
            </p>
          </div>

          <div>
            <h3 className='text-white font-semibold mb-4'>Features</h3>
            <ul className='space-y-2 text-gray-300 text-sm'>
              <li>📋 Bill Tracking</li>
              <li>📅 Due Date Reminders</li>
              <li>📊 Payment History</li>
              <li>🏷️ Category Organization</li>
            </ul>
          </div>

          <div>
            <h3 className='text-white font-semibold mb-4'>Account</h3>
            <div className='space-y-2 text-gray-300 text-sm'>
              <p>📱 Local Storage (Current)</p>
              <p className='text-gray-500'>🔐 Google Sync (Coming Soon)</p>
              <p className='text-gray-500'>☁️ Cloud Backup (Coming Soon)</p>
            </div>
          </div>
        </div>

        <div className='mt-8 pt-8 border-t border-gray-700'>
          <div className='flex flex-col md:flex-row justify-between items-center'>
            <p className='text-gray-400 text-sm'>
              © 2025 PayChores. All rights reserved.
            </p>
            <div className='flex space-x-4 mt-4 md:mt-0 text-gray-400 text-sm'>
              <span>Made with ❤️ for better financial organization</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
