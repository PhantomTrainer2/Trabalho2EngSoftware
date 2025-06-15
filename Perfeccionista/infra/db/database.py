import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'estoque.db')

def get_connection():
    return sqlite3.connect(DB_PATH)

def criar_banco_de_dados():
    with get_connection() as conn:
        cursor = conn.cursor()

        # Cria tabela de fornecedores
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS fornecedores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                contato TEXT
            );
        """)

        # Cria tabela de produtos
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                tipo TEXT NOT NULL,
                quantidade INTEGER NOT NULL,
                fornecedor_id INTEGER,
                FOREIGN KEY (fornecedor_id) REFERENCES fornecedores(id)
            );
        """)

        conn.commit()


if __name__ == '__main__':
    #Inicializar o banco de dados.
    criar_banco_de_dados()