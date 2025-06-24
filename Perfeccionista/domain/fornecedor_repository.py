from abc import ABC, abstractmethod
from domain.fornecedor import Fornecedor

class FornecedorRepository(ABC):
    @abstractmethod
    def salvar(self, fornecedor: Fornecedor) -> Fornecedor:
        """Salva um novo fornecedor e retorna com ID."""
        pass

    @abstractmethod
    def listar_todos(self) -> list[Fornecedor]:
        """Retorna lista de todos os fornecedores."""
        pass

    @abstractmethod
    def buscar_por_id(self, id: int) -> Fornecedor | None:
        """Busca um fornecedor pelo ID."""
        pass

    @abstractmethod
    def atualizar(self, fornecedor: Fornecedor) -> None:
        """Atualiza dados de um fornecedor existente."""
        pass

    @abstractmethod
    def remover(self, id: int) -> None:
        """Remove um fornecedor pelo ID."""
        pass
