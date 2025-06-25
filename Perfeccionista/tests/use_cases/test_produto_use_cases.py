import pytest
from domain.produto import Garrafa
from use_cases.produto_use_case import CriarProdutoUseCase

class FakeRepo:
    def __init__(self):
        self._saved = None

    def salvar(self, produto):
        produto.id = 321
        self._saved = produto
        return produto

def test_criar_produto_uc_assigns_id_and_returns():
    fake_repo = FakeRepo()
    uc = CriarProdutoUseCase(fake_repo)
    garrafa = Garrafa(nome='Garrafa Teste', descricao='Teste', quantidade=5, fornecedor_id=1)
    result = uc.execute(garrafa)
    assert result.id == 321
    assert fake_repo._saved.nome == 'Garrafa Teste'
