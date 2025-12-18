import { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component with header and content area
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 -right-40 w-80 h-80 bg-primary-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-accent-100 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;
