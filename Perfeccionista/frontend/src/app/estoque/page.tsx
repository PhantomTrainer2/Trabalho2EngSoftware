'use client'

import { useEffect, useState } from 'react'
import { Package, Pencil, Trash2 } from 'lucide-react'
import Table from '../../components/Table'

interface Produto {
  id: string
  nome: string
  identificador: string
  descricao: string
  fornecedor: string
  apelido: string
  quantidade: number
}

function getStatus(quantidade: number): {
  label: string
  color: string
  bg: string
} {
  const valor = quantidade * 0.25
  if (valor > 10) return { label: 'Acima', color: 'text-green-700', bg: 'bg-green-100' }
  if (valor === 10) return { label: 'Na Medida', color: 'text-yellow-700', bg: 'bg-yellow-100' }
  return { label: 'Abaixo', color: 'text-red-700', bg: 'bg-red-100' }
}

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([])

  useEffect(() => {
    const mock = Array(28).fill(0).map((_, i) => ({
      id: String(i),
      nome: ['Câmera Digital', 'Smartwatch', 'Perfume'][i % 3],
      identificador: `PRD-${(i + 1).toString().padStart(3, '0')}`,
      descricao: 'Caixa plástica de 20L com tampa e alças laterais',
      fornecedor: 'Distribuidora Alfa',
      apelido: ['Água', 'Biscoito'][i % 2],
      quantidade: [20, 30, 40, 45][i % 4]
    }))
    setProdutos(mock)
  }, [])

  return (
    <section className="p-4 md:p-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total de Produtos</p>
          <h2 className="text-2xl font-bold">{produtos.length.toLocaleString()}</h2>
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          <Package className="text-blue-600" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Inventário de produtos</h1>
          <p className="text-sm text-gray-500">Gerencie seus itens de estoque e níveis de inventário</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md">
          + Adicionar Produto
        </button>
      </div>

      <Table
        columns={[
          'Produto',
          'Identificador',
          'Descrição',
          'Fornecedor',
          'Quantidade',
          'Status',
          'Ação'
        ]}
        data={produtos}
        renderRow={(produto) => {
          const status = getStatus(produto.quantidade)
          return (
            <>
              <td className="p-3 flex items-center gap-2">
                <div className="bg-orange-100 text-orange-600 p-1 rounded">
                  <Package size={16} />
                </div>
                {produto.nome}
              </td>
              <td className="p-3">{produto.identificador}</td>
              <td className="p-3">{produto.descricao}</td>
              <td className="p-3">{produto.fornecedor}</td>
              <td className="p-3">{produto.quantidade}</td>
              <td className="p-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                  {status.label}
                </span>
              </td>
              <td className="p-3 flex gap-2">
                <button><Pencil size={16} className="text-gray-500 hover:text-gray-700" /></button>
                <button><Trash2 size={16} className="text-red-500 hover:text-red-700" /></button>
              </td>
            </>
          )
        }}
      />
    </section>
  )
}
