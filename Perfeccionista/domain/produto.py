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

    def atualizar_dados(self, nome: str, descricao: str, fornecedor_id: int = None):
        self.nome = nome
        self.descricao = descricao
        self.fornecedor_id = fornecedor_id

    def adicionar_estoque(self, quantidade: int):
        if quantidade <= 0:
            raise ValueError("Quantidade deve ser positiva.")
        self.quantidade += quantidade

    def remover_estoque(self, quantidade: int):
        if quantidade <= 0:
            raise ValueError("Quantidade deve ser positiva.")
        if quantidade > self.quantidade:
            raise ValueError("Estoque insuficiente.")
        self.quantidade -= quantidade

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
