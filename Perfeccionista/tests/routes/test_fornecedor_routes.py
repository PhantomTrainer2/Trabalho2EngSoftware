import pytest
from app.main import create_app
from infra.db.database import get_connection

# Build a fresh app for testing
app = create_app()

@pytest.fixture(autouse=True)
def client():
    app.config['TESTING'] = True
    # Ensure a clean in‐memory schema
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS fornecedores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT    NOT NULL,
                contato TEXT NOT NULL
            )
        """)
        conn.commit()
    with app.test_client() as client:
        yield client

def test_criar_fornecedor(client):
    response = client.post('/fornecedores', json={
        'nome': 'Acme Distribuidora',
        'contato': '+55 21 99999-0000'
    })
    assert response.status_code == 201
    data = response.get_json()
    assert 'id' in data
    assert data['nome'] == 'Acme Distribuidora'
    assert data['contato'] == '+55 21 99999-0000'
