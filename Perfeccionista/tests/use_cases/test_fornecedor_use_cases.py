import pytest
from domain.fornecedor import Fornecedor
from domain.fornecedor_repository import FornecedorRepository
from use_cases.fornecedor_use_case import (
    AtualizarFornecedorUseCase,
    RemoverFornecedorUseCase,
    CriarFornecedorUseCase
)

# Fake repository para testes unitários
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
        if id in self.fornecedores:
            del self.fornecedores[id]

    def atualizar(self, fornecedor):
        self.fornecedores[fornecedor.id] = fornecedor


def test_criar_fornecedor():
    repo = FakeFornecedorRepository()
    use_case = CriarFornecedorUseCase(repo)

    fornecedor = use_case.execute(id=1, nome="Fornecedor Teste", contato="(11) 1111-1111")
    assert fornecedor.nome == "Fornecedor Teste"
    assert fornecedor.contato == "(11) 1111-1111"
    assert repo.buscar_por_id(1) == fornecedor


def test_atualizar_fornecedor_sucesso():
    repo = FakeFornecedorRepository()
    repo.salvar(Fornecedor(id=1, nome="Antigo", contato="(11) 0000-0000"))

    use_case = AtualizarFornecedorUseCase(repo)
    use_case.execute(fornecedor_id=1, novo_nome="Novo", novo_contato="(11) 9999-9999")

    atualizado = repo.buscar_por_id(1)
    assert atualizado.nome == "Novo"
    assert atualizado.contato == "(11) 9999-9999"


def test_atualizar_fornecedor_inexistente():
    repo = FakeFornecedorRepository()
    use_case = AtualizarFornecedorUseCase(repo)

    with pytest.raises(ValueError, match="Fornecedor não encontrado"):
        use_case.execute(fornecedor_id=99, novo_nome="X", novo_contato="Y")


def test_remover_fornecedor_sucesso():
    repo = FakeFornecedorRepository()
    repo.salvar(Fornecedor(id=1, nome="Fornecedor A", contato="(11) 1111-1111"))

    use_case = RemoverFornecedorUseCase(repo)
    use_case.execute(1)

    assert repo.buscar_por_id(1) is None


def test_remover_fornecedor_inexistente():
    repo = FakeFornecedorRepository()
    use_case = RemoverFornecedorUseCase(repo)

    with pytest.raises(ValueError, match="Fornecedor não encontrado"):
        use_case.execute(123)


def test_listar_todos_fornecedores():
    repo = FakeFornecedorRepository()
    repo.salvar(Fornecedor(id=1, nome="F1", contato="1"))
    repo.salvar(Fornecedor(id=2, nome="F2", contato="2"))

    fornecedores = repo.listar_todos()
    assert len(fornecedores) == 2
    nomes = [f.nome for f in fornecedores]
    assert "F1" in nomes
    assert "F2" in nomes


def test_buscar_fornecedor_por_id():
    repo = FakeFornecedorRepository()
    fornecedor = Fornecedor(id=10, nome="F10", contato="(00) 0000-0000")
    repo.salvar(fornecedor)

    buscado = repo.buscar_por_id(10)
    assert buscado is not None
    assert buscado.nome == "F10"
    assert buscado.contato == "(00) 0000-0000"


def test_buscar_fornecedor_por_id_inexistente():
    repo = FakeFornecedorRepository()
    assert repo.buscar_por_id(999) is None
