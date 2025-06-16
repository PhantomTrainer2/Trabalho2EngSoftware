from domain.fornecedor import Fornecedor
from domain.fornecedor_repository import FornecedorRepository
from typing import List, Optional


class CriarFornecedorUseCase:
    def __init__(self, fornecedor_repo: FornecedorRepository):
        self.fornecedor_repo = fornecedor_repo

    def execute(self, fornecedor: Fornecedor) -> Fornecedor:
        return self.fornecedor_repo.salvar(fornecedor)


class ListarFornecedoresUseCase:
    def __init__(self, fornecedor_repo: FornecedorRepository):
        self.fornecedor_repo = fornecedor_repo

    def execute(self) -> List[Fornecedor]:
        return self.fornecedor_repo.listar_todos()


class BuscarFornecedorPorIdUseCase:
    def __init__(self, fornecedor_repo: FornecedorRepository):
        self.fornecedor_repo = fornecedor_repo

    def execute(self, id: int) -> Optional[Fornecedor]:
        return self.fornecedor_repo.buscar_por_id(id)


class RemoverFornecedorUseCase:
    def __init__(self, fornecedor_repo: FornecedorRepository):
        self.fornecedor_repo = fornecedor_repo

    def execute(self, fornecedor_id: int) -> None:
        self.fornecedor_repo.remover(fornecedor_id)


class AtualizarFornecedorUseCase:
    def __init__(self, fornecedor_repo: FornecedorRepository):
        self.fornecedor_repo = fornecedor_repo

    def execute(self, fornecedor_id: int, novo_nome: str, novo_contato: str) -> None:
        fornecedor = self.fornecedor_repo.buscar_por_id(fornecedor_id)
        if not fornecedor:
            raise ValueError("Fornecedor não encontrado.")

        fornecedor.atualizar_dados(novo_nome, novo_contato)
        self.fornecedor_repo.atualizar(fornecedor)
