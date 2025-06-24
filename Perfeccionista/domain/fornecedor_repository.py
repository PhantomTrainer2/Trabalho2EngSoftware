from abc import ABC, abstractmethod
from domain.fornecedor import Fornecedor

class FornecedorRepository(ABC):
    @abstractmethod
    def salvar(self, fornecedor): pass

    @abstractmethod
    def listar_todos(self): pass

    @abstractmethod
    def buscar_por_id(self, id): pass


