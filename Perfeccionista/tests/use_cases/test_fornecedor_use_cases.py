import pytest
from domain.fornecedor import Fornecedor
from use_cases.fornecedor_use_case import CriarFornecedorUseCase

class FakeRepo:
    def __init__(self):
        self._saved = None

    def salvar(self, fornecedor: Fornecedor) -> Fornecedor:
        fornecedor.id = 123
        self._saved = fornecedor
        return fornecedor

def test_criar_fornecedor_uc_assigns_id_and_returns():
    fake_repo = FakeRepo()
    uc = CriarFornecedorUseCase(fake_repo)
    fornecedor = Fornecedor(nome='X', contato='Y')
    result = uc.execute(fornecedor)
    assert result.id == 123
    assert fake_repo._saved.nome == 'X'
