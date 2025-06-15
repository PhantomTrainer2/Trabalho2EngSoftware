from domain.fornecedor import Fornecedor
from domain.fornecedor_repository import FornecedorRepository
from infra.db.database import get_connection

class FornecedorRepositorySQLite(FornecedorRepository):
    def salvar(self, fornecedor: Fornecedor):
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO fornecedores (nome, contato) VALUES (?, ?)",
                (fornecedor.nome, fornecedor.contato)
            )
            conn.commit()

    def listar_todos(self):
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, nome, contato FROM fornecedores")
            rows = cursor.fetchall()
            return [Fornecedor(id=row[0], nome=row[1], contato=row[2]) for row in rows]

    def buscar_por_id(self, id):
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, nome, contato FROM fornecedores WHERE id = ?", (id,))
            row = cursor.fetchone()
            if row:
                return Fornecedor(id=row[0], nome=row[1], contato=row[2])
            return None
