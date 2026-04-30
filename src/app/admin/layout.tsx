import React from 'react';

export const metadata = {
  title: 'Admin Dashboard - Pheonix Gifts',
  description: 'Advanced admin dashboard for Pheonix Gifts',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
