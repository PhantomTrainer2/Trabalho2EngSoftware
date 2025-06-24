from flask import Blueprint, request, jsonify
from infra.repositories.produto_repository_sqlite import ProdutoRepositorySQLite
from domain.produto import Garrafa, Lata, Engradado
from use_cases.produto_use_case import (
    CriarProdutoUseCase,
    ListarProdutosUseCase,
    BuscarProdutoPorIdUseCase,
    AtualizarProdutoUseCase,
    AtualizarEstoqueUseCase,
    RemoverProdutoUseCase
)

produto_bp = Blueprint("produtos", __name__)
repo = ProdutoRepositorySQLite()

def _factory_produto(data: dict):
    tipo = data.get("tipo", "").lower()
    cls = {"garrafa": Garrafa, "lata": Lata, "engradado": Engradado}.get(tipo)
    if not cls:
        raise ValueError("tipo de produto inválido")
    return cls(
        id=None,
        nome=data["nome"],
        descricao=data["descricao"],
        quantidade=data.get("quantidade", 0),
        fornecedor_id=data.get("fornecedor_id")
    )

@produto_bp.route("/produtos", methods=["POST"])
def criar_produto():
    data = request.get_json() or {}
    for campo in ("nome", "descricao", "tipo"):
        if campo not in data:
            return jsonify({"erro": f"{campo} é obrigatório"}), 400

    try:
        prod = _factory_produto(data)
        criado = CriarProdutoUseCase(repo).execute(prod)
        resp = {
            "id": criado.id,
            "nome": criado.nome,
            "descricao": criado.descricao,
            "quantidade": criado.quantidade,
            "tipo": criado.tipo,
            "fornecedor_id": criado.fornecedor_id
        }
        return jsonify(resp), 201

    except ValueError as e:
        return jsonify({"erro": str(e)}), 400

@produto_bp.route("/produtos", methods=["GET"])
def listar_produtos():
    lista = ListarProdutosUseCase(repo).execute()
    payload = [{
        "id": p.id,
        "nome": p.nome,
        "descricao": p.descricao,
        "quantidade": p.quantidade,
        "tipo": p.tipo,
        "fornecedor_id": p.fornecedor_id
    } for p in lista]
    return jsonify(payload), 200

@produto_bp.route("/produtos/<int:produto_id>", methods=["GET"])
def buscar_produto(produto_id):
    prod = BuscarProdutoPorIdUseCase(repo).execute(produto_id)
    if not prod:
        return jsonify({"erro": "não encontrado"}), 404
    return jsonify({
        "id": prod.id,
        "nome": prod.nome,
        "descricao": prod.descricao,
        "quantidade": prod.quantidade,
        "tipo": prod.tipo,
        "fornecedor_id": prod.fornecedor_id
    }), 200

@produto_bp.route("/produtos/<int:produto_id>", methods=["PUT"])
def atualizar_produto(produto_id):
    data = request.get_json() or {}
    if not data.get("nome") or not data.get("descricao"):
        return jsonify({"erro": "nome e descrição são obrigatórios"}), 400
    AtualizarProdutoUseCase(repo).execute(
        produto_id,
        data["nome"],
        data["descricao"],
        data.get("fornecedor_id")
    )
    return jsonify({"mensagem": "atualizado com sucesso"}), 200

@produto_bp.route("/produtos/<int:produto_id>/estoque", methods=["PUT"])
def ajustar_estoque(produto_id):
    delta = request.get_json().get("quantidade")
    if delta is None:
        return jsonify({"erro": "quantidade (delta) obrigatória"}), 400
    AtualizarEstoqueUseCase(repo).execute(produto_id, delta)
    return jsonify({"mensagem": "estoque ajustado"}), 200

@produto_bp.route("/produtos/<int:produto_id>", methods=["DELETE"])
def remover_produto(produto_id):
    RemoverProdutoUseCase(repo).execute(produto_id)
    return "", 204
