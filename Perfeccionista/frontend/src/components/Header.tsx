'use client'
import { Menu, Bell, Search } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {

  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <header className="flex justify-between items-center px-4 md:px-6 py-3 bg-white border-b shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="md:hidden p-2">
          <Menu size={24} />
        </button>

          <div className="hidden md:flex items-center gap-2">
            {isHome && (
              <h1 className="text-sm font-semibold text-gray-700">Dashboard Overview</h1>
            ) }
          </div>
        </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        <div className="relative w-full max-w-[200px] md:max-w-xs">
          <input
            type="text"
            placeholder="Pesquisar em produtos"
            className="w-full pl-10 pr-4 py-1.5 text-sm rounded-md border bg-gray-50 focus:outline-none"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-500" />
        </div>
      </div>
    </header>
  )
}
