import pytest
from domain.fornecedor import Fornecedor
from use_cases.fornecedor_use_case import AtualizarFornecedorUseCase
from domain.fornecedor_repository import FornecedorRepository

# Fake repository para testes
class FakeFornecedorRepository(FornecedorRepository):
    def __init__(self):
        self.fornecedores = {}

    def salvar(self, fornecedor):
        self.fornecedores[fornecedor.id] = fornecedor

    def listar_todos(self):
        return list(self.fornecedores.values())

    def buscar_por_id(self, id):
        return self.fornecedores.get(id)

    def remover(self, id):
        del self.fornecedores[id]

    def atualizar(self, fornecedor):
        self.fornecedores[fornecedor.id] = fornecedor


def test_atualizar_fornecedor_sucesso():
    repo = FakeFornecedorRepository()
    fornecedor = Fornecedor(id=1, nome="Fornecedor Antigo", contato="(11) 1111-1111")
    repo.salvar(fornecedor)

    use_case = AtualizarFornecedorUseCase(repo)
    use_case.execute(fornecedor_id=1, novo_nome="Novo Nome", novo_contato="(11) 9999-9999")

    atualizado = repo.buscar_por_id(1)
    assert atualizado.nome == "Novo Nome"
    assert atualizado.contato == "(11) 9999-9999"


def test_atualizar_fornecedor_inexistente():
    repo = FakeFornecedorRepository()
    use_case = AtualizarFornecedorUseCase(repo)

    with pytest.raises(ValueError, match="Fornecedor não encontrado"):
        use_case.execute(fornecedor_id=999, novo_nome="X", novo_contato="Y")
