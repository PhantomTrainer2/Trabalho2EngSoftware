'use client'

import { useEffect, useState } from 'react'
import { Box, ShoppingCart, Users } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { PieChart, Pie, Cell, ResponsiveContainer as PieContainer } from 'recharts'
import Table from '../components/Table'

interface Produto {
  id: string
  nome: string
  identificador: string
  categoria: 'Engradado' | 'Garrafa' | 'Lata'
  quantidade: number
}

// cores para o pie
const PIE_COLORS = {
  Engradado: '#9D4EDD',
  Garrafa:  '#22C55E',
  Lata:     '#F59E0B',
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([])

  useEffect(() => {
    // mock de dados
    const tipos: Produto['categoria'][] = ['Engradado', 'Garrafa', 'Lata']
    const mock: Produto[] = Array(28).fill(0).map((_, i) => ({
      id: String(i + 1),
      nome: ['Caixa Organizadora','Smartwatch','Perfume','Câmera Digital'][i % 4],
      identificador: `PRD-${(i+1).toString().padStart(3,'0')}`,
      categoria: tipos[i % 3],
      quantidade: [5,12,32,48,20,7,25][i % 7],
    }))
    setProdutos(mock)
  }, [])

  // --- cálculos de dashboard ---
  const totalProdutos = produtos.reduce((sum, p) => sum + p.quantidade, 0)
  const variedadeProdutos = new Set(produtos.map((p) => p.nome)).size
  const totalFornecedores = 32 // mock estático

  // dados para o line chart: exemplo de evolução de estoque
  // aqui adaptamos usando os 7 primeiros produtos
  const lineData = produtos.slice(0, 7).map((p, i) => ({
    name: p.nome,
    'Quant. Atual': p.quantidade,
    'Estoque Ideal': Math.floor(p.quantidade * 1.5),
  }))

  // dados para o pie chart: soma por categoria
  const pieData = Object.entries(
    produtos.reduce<Record<string, number>>((acc, p) => {
      acc[p.categoria] = (acc[p.categoria] || 0) + 1
      return acc
    }, {})
  ).map(([name, value]) => ({ name, value }))

  return (
    <section className="p-6 space-y-6 bg-gray-100 min-h-screen">
      {/* cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Total de Produtos" value={totalProdutos} icon={<Box size={24} />} />
        <MetricCard title="Variedade de Produtos" value={variedadeProdutos} icon={<ShoppingCart size={24} />} />
        <MetricCard title="Fornecedores" value={totalFornecedores} icon={<Users size={24} />} />
      </div>

      {/* gráficos */}
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
                // desativa rótulos sobre o gráfico
                label={false}
                labelLine={false}
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={PIE_COLORS[entry.name as Produto['categoria']]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [`${value}`, name]}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 12 }}
              />
            </PieChart>
          </PieContainer>
        </div>
      </div>
      {/* tabela de status com barra de progresso */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Status do Estoque</h2>
          <a href="/estoque" className="text-sm text-blue-600 hover:underline">Ver todos</a>
        </div>

        <Table<Produto>
          columns={['Produto', 'Código', 'Categoria', 'Estoque Total', 'Status']}
          data={produtos.slice(0, 5)}
          itemsPerPage={2} 
          renderRow={(p) => {
            // lógica de status
            const nível = p.quantidade / 50
            let status, barColor
            if (nível > 0.7) {
              status = 'Estável'; barColor = 'bg-green-500'
            } else if (nível <= 0.69 && nível > 0.3) {
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
                    <span className="text-xs text-gray-500">#{p.identificador}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{p.identificador}</td>
                <td className="px-4 py-3">{p.categoria}</td>
                <td className="px-4 py-3">
                  <div className="w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`${barColor} h-full`}
                      style={{ width: `${Math.min((p.quantidade / 50) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 ml-2">{p.quantidade} unidades</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      status === 'Estável'
                        ? 'bg-green-100 text-green-700'
                        : status === 'Atenção'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
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
