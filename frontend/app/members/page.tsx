import React from 'react'
import Sidebar from '@/components/layout/Sidebar'

export default function MembersPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Registered Members</h1>
        {/* Add members page content here */}
        <div>
            
        </div>
      </main>
    </div>
  )
}