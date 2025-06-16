from flask import Blueprint, request, jsonify
from use_cases.fornecedor_use_case import AtualizarFornecedorUseCase
from infra.repositories.fornecedor_repository_sqlite import FornecedorRepositorySQLite

fornecedor_bp = Blueprint("fornecedores", __name__)
repo = FornecedorRepositorySQLite()  # ou injete se estiver usando DI

@fornecedor_bp.route("/fornecedores/<int:fornecedor_id>", methods=["PUT"])
def atualizar_fornecedor(fornecedor_id):
    data = request.get_json()
    nome = data.get("nome")
    contato = data.get("contato")

    if not nome or not contato:
        return jsonify({"erro": "Nome e contato são obrigatórios"}), 400

    use_case = AtualizarFornecedorUseCase(repo)

    try:
        use_case.execute(fornecedor_id, nome, contato)
        return jsonify({"mensagem": "Fornecedor atualizado com sucesso"}), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
