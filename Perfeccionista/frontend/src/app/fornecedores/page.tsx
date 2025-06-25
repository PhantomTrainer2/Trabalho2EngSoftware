'use client'

import { useState } from 'react'
import { useFornecedores } from '../../hooks/useFornecedores'
import { Truck, Edit3, Trash2 } from 'lucide-react'
import Table from '../../components/Table'
import GenericModal, { FieldConfig } from '../../components/GenericModal'

export interface Fornecedor {
  id: number
  nome: string
  contato: string
}

const supplierFields: FieldConfig[] = [
  { name: 'empresa',  label: 'Empresa', type: 'text',     required: true },
  { name: 'contato',  label: 'Contato', type: 'text',     required: true },
]

export default function FornecedoresPage() {
  const {
    fornecedores,
    loading,
    createFornecedor,
    updateFornecedor,
    deleteFornecedor,
  } = useFornecedores()

  const [modalOpen,    setModalOpen]    = useState(false)
  const [editing,      setEditing]      = useState<Fornecedor|null>(null)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [toDelete,    setToDelete]    = useState<Fornecedor|null>(null)


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

  async function handleSave(data: Record<string, any>) {
    if (editing) {
      // atualizar existente
      await updateFornecedor(Number(editing.id), data)

    } else {
      // criar novo
      const newSup: Omit<Fornecedor, 'id'> = {
        nome:  data.nome,
        contato:  data.contato,
      }
      await createFornecedor(newSup)
    }
    setModalOpen(false)
  }

  async function handleDeleteConfirmed() {
    if (toDelete) {
      await deleteFornecedor(Number(toDelete.id))
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
              {f.nome}
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
            ? { empresa: editing.nome, contato: editing.contato }
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
          <strong>{toDelete?.nome}</strong>?
        </p>
      </GenericModal>
    </section>
  )
}
