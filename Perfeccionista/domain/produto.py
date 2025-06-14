# domain/produto.py

from abc import ABC, abstractmethod

# Classe base abstrata para todos os produtos
class Produto(ABC):
    def __init__(self, id: int, nome: str, descricao: str, quantidade: int, fornecedor_id: int = None):
        self.id = id
        self.nome = nome
        self.descricao = descricao
        self.quantidade = quantidade
        self.fornecedor_id = fornecedor_id  # FK para Fornecedor

    @property
    @abstractmethod
    def tipo(self) -> str:
        """Propriedade abstrata para retornar o tipo do produto."""
        pass

# Classes concretas que herdam de Produto
class Garrafa(Produto):
    @property
    def tipo(self) -> str:
        return "garrafa"

class Lata(Produto):
    @property
    def tipo(self) -> str:
        return "lata"

class Engradado(Produto):
    @property
    def tipo(self) -> str:
        return "engradado"