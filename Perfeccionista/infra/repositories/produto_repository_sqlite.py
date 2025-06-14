# infra/repositories/produto_repository_sqlite.py

import sqlite3
from typing import List
from domain.produto import Produto, Garrafa, Lata, Engradado
from domain.repositories.produto_repository import ProdutoRepositoryInterface

# Mapeamento de tipo para classe para facilitar a criação de objetos
TIPO_CLASSE_MAP = {
    "garrafa": Garrafa,
    "lata": Lata,
    "engradado": Engradado,
}

class ProdutoRepositorySQLite(ProdutoRepositoryInterface):

    def __init__(self, db_path: str = 'estoque.db'):
        self.db_path = db_path

    def _get_conexao(self):
        """Retorna uma conexão com o banco de dados."""
        return sqlite3.connect(self.db_path)

    def _mapear_linha_para_objeto(self, linha: tuple) -> Produto:
        """Converte uma linha do banco de dados em um objeto de produto."""
        id, nome, descricao, quantidade, tipo_str = linha
        classe_produto = TIPO_CLASSE_MAP.get(tipo_str)
        if not classe_produto:
            raise ValueError(f"Tipo de produto desconhecido: {tipo_str}")
        return classe_produto(id=id, nome=nome, descricao=descricao, quantidade=quantidade)

    def salvar(self, produto: Produto) -> Produto:
        conn = self._get_conexao()
        cursor = conn.cursor()
        
        cursor.execute(
            "INSERT INTO produtos (nome, descricao, quantidade, tipo) VALUES (?, ?, ?, ?, ?)",
            (produto.nome, produto.descricao, produto.quantidade, produto.tipo, produto.fornecedor_id)
        )
        produto.id = cursor.lastrowid # Atribui o ID gerado pelo banco ao objeto
        
        conn.commit()
        return produto

    def listar_todos(self) -> List[Produto]:
        conn = self._get_conexao()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id, nome, descricao, quantidade, tipo FROM produtos, fornecedor_id FROM produtos")
        linhas = cursor.fetchall()
        
        produtos = [self._mapear_linha_para_objeto(linha) for linha in linhas]
        
        return produtos

    def remover(self, produto_id: int) -> None:
        conn = self._get_conexao()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM produtos WHERE id = ?", (produto_id,))

        conn.commit()
