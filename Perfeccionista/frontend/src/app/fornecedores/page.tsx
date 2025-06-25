'use client'

import { useEffect, useState } from 'react'
import { Truck, Edit3, Trash2 } from 'lucide-react'
import Table from '../../components/Table'
import GenericModal, { FieldConfig } from '../../components/GenericModal'

interface Fornecedor {
  id: string
  empresa: string
  contato: string
}

const supplierFields: FieldConfig[] = [
  { name: 'empresa',  label: 'Empresa', type: 'text',     required: true },
  { name: 'contato',  label: 'Contato', type: 'text',     required: true },
]

export default function FornecedoresPage() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [modalOpen,    setModalOpen]    = useState(false)
  const [editing,      setEditing]      = useState<Fornecedor|null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete,    setToDelete]    = useState<Fornecedor|null>(null)

  useEffect(() => {
    const mock: Fornecedor[] = Array(12).fill(0).map((_, i) => ({
      id:      String(i + 1),
      empresa: `TechGear Inc.`,
      contato: `2199087${6023 + i}`,
    }))
    setFornecedores(mock)
  }, [])

  function openCreateModal() {
    setEditing(null)
    setModalOpen(true)
  }

  function openEditModal(f: Fornecedor) {
    setEditing(f)
    setModalOpen(true)
  }

  function openConfirmModal(f: Fornecedor) {
    setToDelete(f)
    setConfirmOpen(true)
  }

  function handleSave(data: Record<string, any>) {
    if (editing) {
      // atualizar existente
      setFornecedores((prev) =>
        prev.map((f) =>
          f.id === editing.id
            ? { ...f, empresa: data.empresa, contato: data.contato }
            : f
        )
      )
    } else {
      // criar novo
      const nextId = fornecedores.length + 1
      const newSup: Fornecedor = {
        id: String(nextId),
        empresa:  data.empresa,
        contato:  data.contato,
      }
      setFornecedores((prev) => [newSup, ...prev])
    }
    setModalOpen(false)
  }

  function handleDeleteConfirmed() {
    if (toDelete) {
      setFornecedores((prev) => prev.filter((f) => f.id !== toDelete.id))
      if (editing?.id === toDelete.id) setModalOpen(false)
    }
    setConfirmOpen(false)
    setToDelete(null)
  }

  return (
    <section className="p-4 md:p-6 space-y-6">
      <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Total de Fornecedores</p>
          <h2 className="text-2xl font-bold">{fornecedores.length}</h2>
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          <Truck className="text-blue-600" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Lista de Fornecedores</h1>
          <p className="text-sm text-gray-500">
            Gerencie seus fornecedores e seus contatos
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          + Adicionar Fornecedor
        </button>
      </div>

      <Table<Fornecedor>
        columns={['Empresa', 'Contato', 'Ação']}
        data={fornecedores}
        renderRow={(f) => (
          <>
            <td className="px-4 py-3 flex items-center gap-2">
              <div className="bg-orange-100 p-1 rounded">
                <Truck className="text-orange-600" size={16} />
              </div>
              {f.empresa}
            </td>
            <td className="px-4 py-3">{f.contato}</td>
            <td className="px-4 py-3 flex gap-2">
              <button onClick={() => openEditModal(f)}>
                <Edit3 className="text-gray-500 hover:text-gray-700" size={16} />
              </button>
              <button onClick={() => openConfirmModal(f)}>
                <Trash2 className="text-red-500 hover:text-red-700" size={16} />
              </button>
            </td>
          </>
        )}
      />

      <GenericModal
        isOpen={modalOpen}
        title={editing ? 'Editar Fornecedor' : 'Adicionar Fornecedor'}
        fields={supplierFields}
        initialData={
          editing
            ? { empresa: editing.empresa, contato: editing.contato }
            : {}
        }
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        footer={
          editing && (
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
          )
        }
      />

      <GenericModal
        isOpen={confirmOpen}
        title="Confirmar Exclusão"
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
          Deseja realmente excluir o fornecedor{' '}
          <strong>{toDelete?.empresa}</strong>?
        </p>
      </GenericModal>
    </section>
  )
}
