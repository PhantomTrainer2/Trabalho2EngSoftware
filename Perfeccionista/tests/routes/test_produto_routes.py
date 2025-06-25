import pytest
from app.main import create_app
from infra.db.database import get_connection

app = create_app()

@pytest.fixture(autouse=True)
def client():
    app.config['TESTING'] = True
    with get_connection() as conn:
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS fornecedores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT    NOT NULL,
                contato TEXT NOT NULL
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS produtos (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                nome          TEXT    NOT NULL,
                descricao     TEXT,
                quantidade    INTEGER NOT NULL DEFAULT 0,
                tipo          TEXT    NOT NULL,
                fornecedor_id INTEGER NOT NULL,
                FOREIGN KEY(fornecedor_id) REFERENCES fornecedores(id)
            )
        """)
        # seed a supplier so POST /produtos won’t foreign‐key fail
        cur.execute(
            "INSERT INTO fornecedores (nome, contato) VALUES (?, ?)",
            ('Test Supplier', 'test@sup.com')
        )
        conn.commit()
    with app.test_client() as client:
        yield client

def test_criar_produto(client):
    response = client.post('/produtos', json={
        'nome': 'Água Mineral',
        'descricao': '500ml',
        'quantidade': 10,
        'tipo': 'garrafa',
        'fornecedor_id': 1
    })
    assert response.status_code == 201
    data = response.get_json()
    assert 'id' in data
    assert data['nome'] == 'Água Mineral'
    assert data['fornecedor_id'] == 1
