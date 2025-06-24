from abc import ABC, abstractmethod

class Produto(ABC):
    def __init__(self, id: int = None,
                       nome: str = "",
                       descricao: str = "",
                       quantidade: int = 0,
                       fornecedor_id: int = None):
        self.id = id
        self.nome = nome
        self.descricao = descricao
        self.quantidade = quantidade
        self.fornecedor_id = fornecedor_id

    @property
    @abstractmethod
    def tipo(self) -> str:
        """Tipo de produto: garrafa, lata ou engradado."""
        pass

    def atualizar_dados(self,
                        nome: str,
                        descricao: str,
                        fornecedor_id: int = None) -> None:
        """Atualiza nome, descrição e fornecedor."""
        self.nome = nome
        self.descricao = descricao
        self.fornecedor_id = fornecedor_id

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
