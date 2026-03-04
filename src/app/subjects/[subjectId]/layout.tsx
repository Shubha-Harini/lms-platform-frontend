import React from 'react';
import { SubjectSidebar } from '@/components/Sidebar/SubjectSidebar';

export default function SubjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse md:flex-row min-h-[calc(100vh-4rem)] border-t border-white/5 relative bg-[#0a0a0c]">
      <SubjectSidebar />
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6 md:py-10 bg-[#0c0c0e] relative custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          {children}
        </div>
      </main>
    </div>
  );
}
