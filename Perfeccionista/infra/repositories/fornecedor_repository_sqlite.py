from domain.fornecedor import Fornecedor
from domain.fornecedor_repository import FornecedorRepository
from infra.db.database import get_connection

class FornecedorRepositorySQLite(FornecedorRepository):
    def salvar(self, fornecedor: Fornecedor) -> Fornecedor:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO fornecedores (nome, contato) VALUES (?, ?)",
                (fornecedor.nome, fornecedor.contato)
            )
            fornecedor.id = cursor.lastrowid
            conn.commit()
        return fornecedor

    def listar_todos(self) -> list[Fornecedor]:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, nome, contato FROM fornecedores")
            rows = cursor.fetchall()
        return [Fornecedor(id=r[0], nome=r[1], contato=r[2]) for r in rows]

    def buscar_por_id(self, id: int) -> Fornecedor | None:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, nome, contato FROM fornecedores WHERE id = ?", (id,))
            row = cursor.fetchone()
        return Fornecedor(id=row[0], nome=row[1], contato=row[2]) if row else None

    def atualizar(self, fornecedor: Fornecedor) -> None:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE fornecedores SET nome = ?, contato = ? WHERE id = ?",
                (fornecedor.nome, fornecedor.contato, fornecedor.id)
            )
            conn.commit()

    def remover(self, id: int) -> None:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM fornecedores WHERE id = ?", (id,))
            conn.commit()
