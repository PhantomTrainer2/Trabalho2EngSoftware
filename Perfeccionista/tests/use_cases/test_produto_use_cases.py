import pytest
from domain.produto import Lata
from use_cases.produto_use_case import AtualizarProdutoUseCase
from domain.produto_repository import ProdutoRepositoryInterface

class FakeProdutoRepository(ProdutoRepositoryInterface):
    def __init__(self):
        self.produtos = {}

    def salvar(self, produto):
        self.produtos[produto.id] = produto
        return produto

    def listar_todos(self):
        return list(self.produtos.values())

    def buscar_por_id(self, id):
        return self.produtos.get(id)

    def remover(self, id):
        del self.produtos[id]

    def atualizar(self, produto):
        self.produtos[produto.id] = produto


def test_atualizar_produto_sucesso():
    repo = FakeProdutoRepository()
    produto = Lata(id=1, nome="Lata Antiga", descricao="330ml", quantidade=100, fornecedor_id=1)
    repo.salvar(produto)

    use_case = AtualizarProdutoUseCase(repo)
    use_case.execute(produto_id=1, novo_nome="Lata Nova", nova_descricao="350ml", novo_fornecedor_id=2)

    atualizado = repo.buscar_por_id(1)
    assert atualizado.nome == "Lata Nova"
    assert atualizado.descricao == "350ml"
    assert atualizado.fornecedor_id == 2


def test_atualizar_produto_inexistente():
    repo = FakeProdutoRepository()
    use_case = AtualizarProdutoUseCase(repo)

    with pytest.raises(ValueError, match="Produto não encontrado"):
        use_case.execute(produto_id=999, novo_nome="X", nova_descricao="Y", novo_fornecedor_id=1)
