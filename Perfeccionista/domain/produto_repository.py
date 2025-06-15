from abc import ABC, abstractmethod
from typing import List
from domain.produto import Produto

class ProdutoRepositoryInterface(ABC):
    
    @abstractmethod
    def salvar(self, produto: Produto) -> Produto:
        """Salva um novo produto no repositório."""
        pass

    @abstractmethod
    def listar_todos(self) -> List[Produto]:
        """Retorna uma lista de todos os produtos no estoque."""
        pass
    
    @abstractmethod
    def remover(self, produto_id: int) -> None:
        """Remove um produto do estoque pelo seu ID."""
        pass