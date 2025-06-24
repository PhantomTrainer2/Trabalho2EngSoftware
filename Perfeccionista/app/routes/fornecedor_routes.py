from flask import Blueprint, request, jsonify
from domain.fornecedor import Fornecedor
from infra.repositories.fornecedor_repository_sqlite import FornecedorRepositorySQLite
from use_cases.fornecedor_use_case import (
    CriarFornecedorUseCase,
    ListarFornecedoresUseCase,
    AtualizarFornecedorUseCase,
    RemoverFornecedorUseCase,
    BuscarFornecedorPorIdUseCase
)

fornecedor_bp = Blueprint("fornecedores", __name__)
repo = FornecedorRepositorySQLite()

@fornecedor_bp.route("/fornecedores", methods=["POST"])
def criar_fornecedor():
    data = request.get_json() or {}
    nome = data.get("nome")
    contato = data.get("contato")
    if not nome or not contato:
        return jsonify({"erro": "nome e contato são obrigatórios"}), 400

    fornecedor = Fornecedor(nome=nome, contato=contato)
    criado = CriarFornecedorUseCase(repo).execute(fornecedor)
    return jsonify({"id": criado.id, "nome": criado.nome, "contato": criado.contato}), 201

@fornecedor_bp.route("/fornecedores", methods=["GET"])
def listar_fornecedores():
    lista = ListarFornecedoresUseCase(repo).execute()
    payload = [{"id": f.id, "nome": f.nome, "contato": f.contato} for f in lista]
    return jsonify(payload), 200

@fornecedor_bp.route("/fornecedores/<int:fornecedor_id>", methods=["GET"])
def buscar_fornecedor(fornecedor_id):
    fornecedor = BuscarFornecedorPorIdUseCase(repo).execute(fornecedor_id)
    if not fornecedor:
        return jsonify({"erro": "Fornecedor não encontrado"}), 404
    return jsonify({"id": fornecedor.id, "nome": fornecedor.nome, "contato": fornecedor.contato}), 200

@fornecedor_bp.route("/fornecedores/<int:fornecedor_id>", methods=["PUT"])
def atualizar_fornecedor(fornecedor_id):
    data = request.get_json() or {}
    nome = data.get("nome")
    contato = data.get("contato")
    if not nome or not contato:
        return jsonify({"erro": "nome e contato são obrigatórios"}), 400

    try:
        AtualizarFornecedorUseCase(repo).execute(fornecedor_id, nome, contato)
        return jsonify({"mensagem": "atualizado com sucesso"}), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404

@fornecedor_bp.route("/fornecedores/<int:fornecedor_id>", methods=["DELETE"])
def remover_fornecedor(fornecedor_id):
    RemoverFornecedorUseCase(repo).execute(fornecedor_id)
    return "", 204
