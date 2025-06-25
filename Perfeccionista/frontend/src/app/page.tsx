'use client'

import { Box, ShoppingCart, Users } from 'lucide-react'
import { useProdutos } from '../hooks/useProdutos'
import type { Produto } from '../hooks/useProdutos'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, ResponsiveContainer as PieContainer
} from 'recharts'
import Table from '../components/Table'

const PIE_COLORS = {
  engradado: '#9D4EDD',
  garrafa:  '#22C55E',
  lata:     '#F59E0B',
}

export default function Home() {
  const { produtos, loading } = useProdutos()

  // Adaptar para identificador (não vem da API)
  const produtosAdaptados = produtos.map((p) => ({
    ...p,
    identificador: `PRD-${String(p.id).padStart(3, '0')}`
  }))

  const totalProdutos = produtos.reduce((sum, p) => sum + p.quantidade, 0)
  const variedadeProdutos = new Set(produtos.map((p) => p.nome)).size
  const totalFornecedores = new Set(produtos.map(p => p.fornecedor_id)).size

  const lineData = produtos.slice(0, 7).map((p) => ({
    name: p.nome,
    'Quant. Atual': p.quantidade,
    'Estoque Ideal': Math.floor(p.quantidade * 1.5),
  }))

  const pieData = Object.entries(
    produtos.reduce<Record<string, number>>((acc, p) => {
      acc[p.tipo] = (acc[p.tipo] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  return (
    <section className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Total de Produtos" value={totalProdutos} icon={<Box size={24} />} />
        <MetricCard title="Variedade de Produtos" value={variedadeProdutos} icon={<ShoppingCart size={24} />} />
        <MetricCard title="Fornecedores" value={totalFornecedores} icon={<Users size={24} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Controle de Estoque</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="Quant. Atual" stroke="#2563EB" strokeWidth={2} />
              <Line type="monotone" dataKey="Estoque Ideal" stroke="#16A34A" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Categorias</h2>
          <PieContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                label={false}
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={PIE_COLORS[entry.name as keyof typeof PIE_COLORS]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value}`, name]} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </PieContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Status do Estoque</h2>
          <a href="/estoque" className="text-sm text-blue-600 hover:underline">Ver todos</a>
        </div>

        <Table<Produto>
          columns={['Produto', 'Código', 'Categoria', 'Estoque Total', 'Status']}
          data={produtosAdaptados.slice(0, 5)}
          itemsPerPage={2}
          renderRow={(p) => {
            const nivel = p.quantidade / 50
            let status, barColor
            if (nivel > 0.7) {
              status = 'Estável'; barColor = 'bg-green-500'
            } else if (nivel <= 0.69 && nivel > 0.3) {
              status = 'Atenção'; barColor = 'bg-yellow-500'
            } else {
              status = 'Crítico'; barColor = 'bg-red-500'
            }

            return (
              <>
                <td className="px-4 py-3 flex items-center gap-2">
                  <div className="bg-gray-100 p-1 rounded"><Box size={16} /></div>
                  <div className="flex flex-col text-sm">
                    <span>{p.nome}</span>
                    <span className="text-xs text-gray-500">#{p.id}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3">{p.tipo}</td>
                <td className="px-4 py-3">
                  <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`${barColor} h-full`} style={{ width: `${Math.min(nivel * 100, 100)}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{p.quantidade} unidades</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status === 'Estável' ? 'bg-green-100 text-green-700'
                    : status === 'Atenção' ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                    {status}
                  </span>
                </td>
              </>
            )
          }}
        />
      </div>
    </section>
  )
}

function MetricCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
      <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
    </div>
  )
}
