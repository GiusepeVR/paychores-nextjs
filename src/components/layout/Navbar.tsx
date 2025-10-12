'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className='bg-white shadow-md border-b border-gray-200 sticky top-0 z-100000'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex-shrink-0'>
            <Link href='/' className='text-2xl font-bold text-primary-600 flex items-center space-x-2'>
              <span className='text-2xl'>💳</span>
              <span className='font-bold text-xl'>PayChores</span>
            </Link>
          </div>

          <div className='hidden md:block'>
            <div className='ml-10 flex items-baseline space-x-4'>
              <Link
                href='/'
                className='text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
              >
                Dashboard
              </Link>
              <button
                onClick={() => {/* TODO: Open settings modal */}}
                className='text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors'
                title='Settings'
              >
                ⚙️
              </button>
            </div>
          </div>

          <div className='md:hidden'>
            <button
              onClick={toggleMenu}
              className='text-gray-700 hover:text-primary-600 p-2 rounded-md'
              aria-label='Toggle menu'
            >
              <svg
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                ) : (
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200'>
              <Link
                href='/'
                className='text-gray-700 hover:text-primary-600 block px-3 py-2 rounded-md text-sm font-medium transition-colors'
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
