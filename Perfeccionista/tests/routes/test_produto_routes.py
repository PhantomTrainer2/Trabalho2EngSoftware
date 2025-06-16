import pytest
from app.main import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_criar_produto(client):
    response = client.post("/produtos", json={
        "id": 1,
        "tipo": "lata",
        "nome": "Coca-Cola",
        "descricao": "350ml",
        "quantidade": 10,
        "fornecedor_id": None
    })
    assert response.status_code == 201
    assert response.get_json()["nome"] == "Coca-Cola"


def test_listar_produtos(client):
    client.post("/produtos", json={
        "id": 2,
        "tipo": "garrafa",
        "nome": "Pepsi",
        "descricao": "1L",
        "quantidade": 5,
        "fornecedor_id": None
    })
    response = client.get("/produtos")
    assert response.status_code == 200
    produtos = response.get_json()
    assert isinstance(produtos, list)
    assert any(p["nome"] == "Pepsi" for p in produtos)


def test_atualizar_produto(client):
    client.post("/produtos", json={
        "id": 3,
        "tipo": "engradado",
        "nome": "Água",
        "descricao": "12 unidades",
        "quantidade": 12,
        "fornecedor_id": None
    })
    response = client.put("/produtos/3", json={
        "nome": "Água Mineral",
        "descricao": "6 unidades",
        "fornecedor_id": 1
    })
    assert response.status_code == 200
    assert response.get_json()["nome"] == "Água Mineral"


def test_remover_produto(client):
    client.post("/produtos", json={
        "id": 4,
        "tipo": "lata",
        "nome": "Fanta",
        "descricao": "350ml",
        "quantidade": 20,
        "fornecedor_id": None
    })
    response = client.delete("/produtos/4")
    assert response.status_code == 204
