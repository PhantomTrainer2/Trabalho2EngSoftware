import pytest
from domain.produto import Lata, Garrafa, Engradado
from domain.produto_repository import ProdutoRepositoryInterface
from use_cases.produto_use_case import (
    AtualizarProdutoUseCase,
    RemoverProdutoUseCase,
    CriarProdutoUseCase
)

# Fake repository para testes unitários
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
        if id in self.produtos:
            del self.produtos[id]

    def atualizar(self, produto):
        self.produtos[produto.id] = produto


def test_criar_produto_lata():
    repo = FakeProdutoRepository()
    use_case = CriarProdutoUseCase(repo)

    produto = use_case.execute(id=1, tipo="lata", nome="Lata Teste", descricao="350ml", quantidade=10, fornecedor_id=2)
    assert isinstance(produto, Lata)
    assert produto.nome == "Lata Teste"
    assert produto.fornecedor_id == 2


def test_criar_produto_tipo_invalido():
    repo = FakeProdutoRepository()
    use_case = CriarProdutoUseCase(repo)

    with pytest.raises(ValueError, match="Tipo de produto inválido"):
        use_case.execute(id=1, tipo="invalido", nome="X", descricao="Y", quantidade=0, fornecedor_id=None)


def test_atualizar_produto_sucesso():
    repo = FakeProdutoRepository()
    repo.salvar(Lata(id=1, nome="Lata Velha", descricao="330ml", quantidade=100, fornecedor_id=1))

    use_case = AtualizarProdutoUseCase(repo)
    use_case.execute(produto_id=1, novo_nome="Lata Nova", nova_descricao="500ml", novo_fornecedor_id=2)

    produto = repo.buscar_por_id(1)
    assert produto.nome == "Lata Nova"
    assert produto.descricao == "500ml"
    assert produto.fornecedor_id == 2


def test_atualizar_produto_inexistente():
    repo = FakeProdutoRepository()
    use_case = AtualizarProdutoUseCase(repo)

    with pytest.raises(ValueError, match="Produto não encontrado"):
        use_case.execute(produto_id=42, novo_nome="Novo", nova_descricao="Descrição", novo_fornecedor_id=None)


def test_remover_produto_sucesso():
    repo = FakeProdutoRepository()
    produto = Garrafa(id=2, nome="Garrafa", descricao="1L", quantidade=50, fornecedor_id=1)
    repo.salvar(produto)

    use_case = RemoverProdutoUseCase(repo)
    use_case.execute(2)

    assert repo.buscar_por_id(2) is None


def test_remover_produto_inexistente():
    repo = FakeProdutoRepository()
    use_case = RemoverProdutoUseCase(repo)

    with pytest.raises(ValueError, match="Produto não encontrado"):
        use_case.execute(777)
