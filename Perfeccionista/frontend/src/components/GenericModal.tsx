'use client'

import { FormEvent, ReactNode, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

export type FieldConfig =
  | {
      name: string
      label: string
      type: 'text' | 'number' | 'textarea' | 'select'
      placeholder?: string
      required?: boolean
      options?: { label: string; value: string }[]  // para select
    }

export interface GenericModalProps {
  isOpen: boolean
  title: string
  fields: FieldConfig[]
  initialData: Record<string, any>
  onClose: () => void
  onSave: (data: Record<string, any>) => void
  footer?: React.ReactNode
  children?: React.ReactNode
}

export default function GenericModal(props: GenericModalProps) {
  const { isOpen, title, fields, initialData = {}, onClose, onSave, footer } = props
  const [mounted, setMounted] = useState(false)

  // Só habilita o portal após montar no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen || !mounted) return null

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fm = new FormData(e.currentTarget)
    const data: Record<string, any> = {}
    fields.forEach(({ name, type }) => {
      let v = fm.get(name)
      data[name] = type === 'number' ? Number(v) : v
    })
    onSave(data)
    onClose()
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl mx-4 md:mx-0 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className={`grid gap-4 ${fields.length > 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {fields.map((f) => {
              const val = initialData[f.name] ?? ''
              if (f.type === 'textarea') {
                return (
                  <div key={f.name}>
                    <label className="block text-sm font-medium mb-1">
                      {f.label}{f.required ? ' *' : ''}
                    </label>
                    <textarea
                      name={f.name}
                      defaultValue={val}
                      placeholder={f.placeholder}
                      required={f.required}
                      rows={3}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
                    />
                  </div>
                )
              }
              if (f.type === 'select') {
                return (
                  <div key={f.name}>
                    <label className="block text-sm font-medium mb-1">
                      {f.label}{f.required ? ' *' : ''}
                    </label>
                    <select
                      name={f.name}
                      defaultValue={val}
                      required={f.required}
                      className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
                    >
                      <option value="">— selecione —</option>
                      {f.options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              }
              return (
                <div key={f.name}>
                  <label className="block text-sm font-medium mb-1">
                    {f.label}{f.required ? ' *' : ''}
                  </label>
                  <input
                    name={f.name}
                    type={f.type}
                    defaultValue={val}
                    placeholder={f.placeholder}
                    required={f.required}
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring"
                  />
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 ">
            {footer ?? (
              <>
                <button
                  type="button"
                  onClick={onClose}
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
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}