import { useEffect, useState } from 'react'

export interface Produto {
  id: number
  nome: string
  descricao: string
  tipo: string
  quantidade: number
  fornecedor_id: number
}

const API = 'http://127.0.0.1:5000'

export function useProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProdutos = async () => {
    try {
      const res = await fetch(`${API}/produtos`)
      const data = await res.json()
      setProdutos(data)
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProduto = async (novo: Partial<Produto>) => {
    const res = await fetch(`${API}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo)
    })
    await fetchProdutos()
    return res.ok
  }

  const updateProduto = async (id: number, atualizado: Partial<Produto>) => {
    const res = await fetch(`${API}/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atualizado)
    })
    await fetchProdutos()
    return res.ok
  }

  const deleteProduto = async (id: number) => {
    const res = await fetch(`${API}/produtos/${id}`, { method: 'DELETE' })
    await fetchProdutos()
    return res.ok
  }

  useEffect(() => {
    fetchProdutos()
  }, [])

  return { produtos, loading, createProduto, updateProduto, deleteProduto }
}