'use client'
import { useEffect, useState } from 'react'
import { Package, Pencil, Trash2 } from 'lucide-react'
import Table from '../../components/Table'
import GenericModal, { FieldConfig } from '../../components/GenericModal'

interface Produto {
  id: string
  nome: string
  identificador: string
  descricao: string
  fornecedor: string
  quantidade: number
}

// Campos do formulário de criação/edição
const productFields: FieldConfig[] = [
  { name: 'nome', label: 'Nome do Produto', type: 'text', required: true },
  { name: 'fornecedor', label: 'Identificador do Fornecedor', type: 'text' },
  { name: 'descricao', label: 'Descrição', type: 'textarea' },
  { name: 'quantidade', label: 'Quantidade', type: 'number', required: true },
]

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Produto | null>(null)

  // Estados para confirmação de delete
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete, setToDelete] = useState<Produto | null>(null)

  useEffect(() => {
    // mock inicial
    const mock = Array(28)
      .fill(0)
      .map((_, i) => ({
        id: String(i + 1),
        nome: ['Câmera Digital', 'Smartwatch', 'Perfume'][i % 3],
        identificador: `PRD-${(i + 1).toString().padStart(3, '0')}`,
        descricao: 'Caixa plástica de 20L com tampa e alças laterais',
        fornecedor: 'Distribuidora Alfa',
        quantidade: [20, 30, 40, 45][i % 4],
      }))
    setProdutos(mock)
  }, [])

  function openCreateModal() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEditModal(prod: Produto) {
    setEditing(prod)
    setModalOpen(true)
  }

  function openConfirmModal(prod: Produto) {
    setToDelete(prod)
    setConfirmOpen(true)
  }

  function handleSave(data: Record<string, any>) {
    if (editing) {
      // edição
      setProdutos((prev) =>
        prev.map((p) => (p.id === editing.id ? { ...p, ...data } : p))
      )
    } else {
      // criação
      const nextId = produtos.length + 1
      const newProd: Produto = {
        id: String(nextId),
        identificador: `PRD-${nextId.toString().padStart(3, '0')}`,
        nome: data.nome,
        descricao: data.descricao,
        fornecedor: data.fornecedor,
        quantidade: Number(data.quantidade),
      }
      setProdutos((prev) => [newProd, ...prev])
    }
    setModalOpen(false)
  }

  function handleDeleteConfirmed() {
    if (toDelete) {
      setProdutos((prev) => prev.filter((p) => p.id !== toDelete.id))
      // fecha modais caso estivesse editando esse item
      if (editing?.id === toDelete.id) setModalOpen(false)
    }
    setConfirmOpen(false)
    setToDelete(null)
  }

  return (
    <section className="p-4">
      {/* Card de Total */}
      <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total de Produtos</p>
          <h2 className="text-2xl font-bold">{produtos.length}</h2>
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          <Package className="text-blue-600" />
        </div>
      </div>

      {/* Cabeçalho + botão */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold mt-4">Inventário de produtos</h1>
          <p className="text-sm text-gray-500 mb-4">
            Gerencie seus itens de estoque e níveis de inventário
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + Adicionar Produto
        </button>
      </div>

      {/* Tabela */}
      <Table<Produto>
        columns={[
          'Produto',
          'Identificador',
          'Descrição',
          'Fornecedor',
          'Quantidade',
          'Status',
          'Ação',
        ]}
        data={produtos}
        renderRow={(prod) => {
          const status = (() => {
            const v = prod.quantidade * 0.25
            if (v > 10) return { label: 'Acima', color: 'bg-green-100 text-green-700' }
            if (v === 10) return { label: 'Na Medida', color: 'bg-yellow-100 text-yellow-700' }
            return { label: 'Abaixo', color: 'bg-red-100 text-red-700' }
          })()

          return (
            <>
              <td className="px-4 py-3 flex items-center gap-2">
                <div className="bg-orange-100 p-1 rounded">
                  <Package className="text-orange-600" size={16} />
                </div>
                {prod.nome}
              </td>
              <td className="px-4 py-3">{prod.identificador}</td>
              <td className="px-4 py-3">{prod.descricao}</td>
              <td className="px-4 py-3">{prod.fornecedor}</td>
              <td className="px-4 py-3">{prod.quantidade}</td>
              <td className="px-4 py-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </td>
              <td className="px-4 py-3 flex gap-2">
                <button onClick={() => openEditModal(prod)}>
                  <Pencil className="text-gray-500 hover:text-gray-700" size={16} />
                </button>
                <button onClick={() => openConfirmModal(prod)}>
                  <Trash2 className="text-red-500 hover:text-red-700" size={16} />
                </button>
              </td>
            </>
          )
        }}
      />

      {/* Modal de criação/edição */}
      <GenericModal
        isOpen={modalOpen}
        title={editing ? 'Editar Produto' : 'Adicionar Produto'}
        fields={productFields}
        initialData={
          editing
            ? {
                nome: editing.nome,
                fornecedor: editing.fornecedor,
                descricao: editing.descricao,
                quantidade: editing.quantidade,
              }
            : {}
        }
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        footer={
          editing ? (
            <div className="flex justify-between items-center w-full">
              <button
                onClick={() => {
                  openConfirmModal(editing)
                  setModalOpen(false)
                }}
                className="text-red-600 hover:underline text-sm"
              >
                Excluir
              </button>
              <div className="space-x-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          ) : undefined
        }
      />

      {/* Modal de confirmação de exclusão */}
      <GenericModal
        isOpen={confirmOpen}
        title="Confirmar Exclusão"
        // não passamos fields, vai usar body customizado
        fields={[]}
        initialData={{}}
        onClose={() => setConfirmOpen(false)}
        onSave={handleDeleteConfirmed}
        footer={
          <div className="flex justify-end items-center w-full space-x-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleDeleteConfirmed}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        }
      >
        <p className="py-4 text-center">
          Deseja realmente excluir o produto{' '}
          <strong>{toDelete?.nome}</strong>?
        </p>
      </GenericModal>
    </section>
  )
}
