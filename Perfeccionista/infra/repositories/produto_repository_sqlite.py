from domain.produto import Garrafa, Lata, Engradado, Produto
from domain.produto_repository import ProdutoRepositoryInterface
from infra.db.database import get_connection

class ProdutoRepositorySQLite(ProdutoRepositoryInterface):
    def _ensure_table(self):
        """Ensure the produtos table exists with proper schema (AUTOINCREMENT id)."""
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("PRAGMA foreign_keys = ON")
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS produtos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nome TEXT NOT NULL,
                    descricao TEXT,
                    quantidade INTEGER NOT NULL DEFAULT 0,
                    tipo TEXT NOT NULL,
                    fornecedor_id INTEGER NOT NULL,
                    FOREIGN KEY(fornecedor_id) REFERENCES fornecedores(id)
                )
                """
            )
            conn.commit()

    def _ensure_columns(self):
        """Adds missing columns 'descricao' and 'fornecedor_id' if not present."""
        with get_connection() as conn:
            conn.execute("PRAGMA foreign_keys = ON")
            cursor = conn.cursor()
            cursor.execute("PRAGMA table_info(produtos)")
            cols = [c[1] for c in cursor.fetchall()]
            if "descricao" not in cols:
                cursor.execute("ALTER TABLE produtos ADD COLUMN descricao TEXT")
            if "fornecedor_id" not in cols:
                cursor.execute("ALTER TABLE produtos ADD COLUMN fornecedor_id INTEGER")
            conn.commit()

    def __init__(self):
        # Create or migrate the table schema
        self._ensure_table()
        self._ensure_columns()

    def salvar(self, produto: Produto) -> Produto:
        """Inserts a produto, verifying the fornecedor exists and letting SQLite generate id."""
        with get_connection() as conn:
            conn.execute("PRAGMA foreign_keys = ON")
            cursor = conn.cursor()
            # validate foreign key
            cursor.execute(
                "SELECT 1 FROM fornecedores WHERE id = ?", (produto.fornecedor_id,)
            )
            if cursor.fetchone() is None:
                raise ValueError(f"Fornecedor id {produto.fornecedor_id} não existe")

            cursor.execute(
                "INSERT INTO produtos (nome, descricao, quantidade, tipo, fornecedor_id)"
                " VALUES (?, ?, ?, ?, ?)",
                (
                    produto.nome,
                    produto.descricao,
                    produto.quantidade,
                    produto.tipo,
                    produto.fornecedor_id
                )
            )
            # SQLite will automatically assign id
            produto.id = cursor.lastrowid
            conn.commit()
        return produto

    def listar_todos(self) -> list[Produto]:
        with get_connection() as conn:
            conn.execute("PRAGMA foreign_keys = ON")
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, nome, descricao, quantidade, tipo, fornecedor_id"
                " FROM produtos"
            )
            rows = cursor.fetchall()

        produtos: list[Produto] = []
        for pid, nome, descricao, quantidade, tipo, fornecedor_id in rows:
            if tipo == "garrafa":
                prod = Garrafa(
                    id=pid,
                    nome=nome,
                    descricao=descricao,
                    quantidade=quantidade,
                    fornecedor_id=fornecedor_id
                )
            elif tipo == "lata":
                prod = Lata(
                    id=pid,
                    nome=nome,
                    descricao=descricao,
                    quantidade=quantidade,
                    fornecedor_id=fornecedor_id
                )
            elif tipo == "engradado":
                prod = Engradado(
                    id=pid,
                    nome=nome,
                    descricao=descricao,
                    quantidade=quantidade,
                    fornecedor_id=fornecedor_id
                )
            else:
                continue
            produtos.append(prod)
        return produtos

    def buscar_por_id(self, id: int) -> Produto | None:
        with get_connection() as conn:
            conn.execute("PRAGMA foreign_keys = ON")
            cursor = conn.cursor()
            cursor.execute(
                "SELECT id, nome, descricao, quantidade, tipo, fornecedor_id"
                " FROM produtos WHERE id = ?", (id,)
            )
            row = cursor.fetchone()
        if not row:
            return None

        pid, nome, descricao, quantidade, tipo, fornecedor_id = row
        if tipo == "garrafa":
            return Garrafa(
                id=pid,
                nome=nome,
                descricao=descricao,
                quantidade=quantidade,
                fornecedor_id=fornecedor_id
            )
        if tipo == "lata":
            return Lata(
                id=pid,
                nome=nome,
                descricao=descricao,
                quantidade=quantidade,
                fornecedor_id=fornecedor_id
            )
        if tipo == "engradado":
            return Engradado(
                id=pid,
                nome=nome,
                descricao=descricao,
                quantidade=quantidade,
                fornecedor_id=fornecedor_id
            )
        return None

    def atualizar(self, produto: Produto) -> None:
        with get_connection() as conn:
            conn.execute("PRAGMA foreign_keys = ON")
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE produtos SET nome = ?, descricao = ?, quantidade = ?,"
                " tipo = ?, fornecedor_id = ? WHERE id = ?",
                (
                    produto.nome,
                    produto.descricao,
                    produto.quantidade,
                    produto.tipo,
                    produto.fornecedor_id,
                    produto.id
                )
            )
            conn.commit()

    def remover(self, id: int) -> None:
        with get_connection() as conn:
            conn.execute("PRAGMA foreign_keys = ON")
            cursor = conn.cursor()
            cursor.execute("DELETE FROM produtos WHERE id = ?", (id,))
            conn.commit()
