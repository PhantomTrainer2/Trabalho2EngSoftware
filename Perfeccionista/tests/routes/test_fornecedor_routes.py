import pytest
from app.main import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_criar_fornecedor(client):
    response = client.post("/fornecedores", json={
        "id": 1,
        "nome": "Fornecedor Teste",
        "contato": "12345678"
    })
    assert response.status_code == 201
    assert response.get_json()["nome"] == "Fornecedor Teste"


def test_listar_fornecedores(client):
    client.post("/fornecedores", json={
        "id": 2,
        "nome": "Fornecedor B",
        "contato": "2222222"
    })
    response = client.get("/fornecedores")
    assert response.status_code == 200
    fornecedores = response.get_json()
    assert isinstance(fornecedores, list)
    assert any(f["nome"] == "Fornecedor B" for f in fornecedores)


def test_atualizar_fornecedor(client):
    client.post("/fornecedores", json={
        "id": 3,
        "nome": "Fornecedor Antigo",
        "contato": "3333"
    })
    response = client.put("/fornecedores/3", json={
        "nome": "Fornecedor Novo",
        "contato": "9999"
    })
    assert response.status_code == 200
    assert response.get_json()["nome"] == "Fornecedor Novo"


def test_remover_fornecedor(client):
    client.post("/fornecedores", json={
        "id": 4,
        "nome": "Fornecedor X",
        "contato": "4444"
    })
    response = client.delete("/fornecedores/4")
    assert response.status_code == 204
