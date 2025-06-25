import { useEffect, useState } from 'react'

export interface Fornecedor {
  id: number
  nome: string
  contato: string
}

const API = 'http://127.0.0.1:5000'

export function useFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFornecedores = async () => {
    try {
      const res = await fetch(`${API}/fornecedores`)
      const data = await res.json()
      setFornecedores(data)
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error)
    } finally {
      setLoading(false)
    }
  }

  const createFornecedor = async (novo: Partial<Fornecedor>) => {
    const res = await fetch(`${API}/fornecedores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo)
    })
    await fetchFornecedores()
    return res.ok
  }

  const updateFornecedor = async (id: number, atualizado: Partial<Fornecedor>) => {
    const res = await fetch(`${API}/fornecedores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atualizado)
    })
    await fetchFornecedores()
    return res.ok
  }

  const deleteFornecedor = async (id: number) => {
    const res = await fetch(`${API}/fornecedores/${id}`, { method: 'DELETE' })
    await fetchFornecedores()
    return res.ok
  }

  useEffect(() => {
    fetchFornecedores()
  }, [])

  return { fornecedores, loading, createFornecedor, updateFornecedor, deleteFornecedor }
}