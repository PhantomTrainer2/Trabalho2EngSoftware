'use client'

import { ReactNode, useState } from 'react'

interface TableProps<T> {
  columns: string[]
  data: T[]
  renderRow: (item: T) => ReactNode
  /** Quantos itens por página (fixo) */
  itemsPerPage?: number
}

export default function Table<T>({
  columns,
  data,
  renderRow,
  itemsPerPage = 4
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const paginatedData = data.slice(start, start + itemsPerPage)

  return (
    <div className="space-y-4 w-full">
      <div className="rounded-lg shadow border border-gray-200 bg-white overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm text-left">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedData.map((item, i) => (
                <tr key={i}>
                  {renderRow(item)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center py-4">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="text-gray-500 hover:text-black disabled:opacity-40"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                    page === currentPage
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-gray-500 hover:text-black disabled:opacity-40"
              >
                ›
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}
