'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="h-screen relative flex flex-col md:flex-row">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className="flex-1 flex flex-col relative z-10">
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
                  {children}
                </main>
            </div>
        </div>
    )
}
