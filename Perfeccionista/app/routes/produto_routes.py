from flask import Blueprint, request, jsonify
from use_cases.produto_use_case import AtualizarProdutoUseCase
from infra.repositories.produto_repository_sqlite import ProdutoRepositorySQLite

produto_bp = Blueprint("produtos", __name__)
repo = ProdutoRepositorySQLite()

@produto_bp.route("/produtos/<int:produto_id>", methods=["PUT"])
def atualizar_produto(produto_id):
    data = request.get_json()
    nome = data.get("nome")
    descricao = data.get("descricao")
    fornecedor_id = data.get("fornecedor_id")  # pode ser None

    if not nome or not descricao:
        return jsonify({"erro": "Nome e descrição são obrigatórios"}), 400

    use_case = AtualizarProdutoUseCase(repo)

    try:
        use_case.execute(produto_id, nome, descricao, fornecedor_id)
        return jsonify({"mensagem": "Produto atualizado com sucesso"}), 200
    except ValueError as e:
        return jsonify({"erro": str(e)}), 404
