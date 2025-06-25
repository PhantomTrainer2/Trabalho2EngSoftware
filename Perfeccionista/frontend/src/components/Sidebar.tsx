import { Home, Package, Warehouse, Truck } from 'lucide-react'
import Link from 'next/link'
import clsx from 'clsx'

export default function Sidebar({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed md:static top-0 left-0 z-40 h-full w-64 bg-white border-r shadow-md p-4 transform transition-transform duration-300 ease-in-out',
          {
            'translate-x-0': open,
            '-translate-x-full': !open,
            'md:translate-x-0 md:transition-none': true,
          }
        )}
      >
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.png" alt="Logo" className="w-8 h-8" />
          <h1 className="text-2xl font-bold text-orange-600">Estocaê</h1>
        </div>
        <h2 className="text-xs text-gray-500 font-semibold mb-2">MENU PRINCIPAL</h2>
        <nav className="flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm" onClick={() => setOpen(false)}>
            <Home size={18} /> Dashboard
          </Link>
          <Link href="/estoque" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm" onClick={() => setOpen(false)}>
            <Warehouse size={18} /> Estoque
          </Link>
          <Link href="/fornecedores" className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 text-sm" onClick={() => setOpen(false)}>
            <Truck size={18} /> Fornecedores
          </Link>
        </nav>
      </aside>
    </>
  )
}
