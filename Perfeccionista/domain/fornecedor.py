class Fornecedor:
    def __init__(self, id: int = None, nome: str = "", contato: str = ""):
        self.id = id
        self.nome = nome
        self.contato = contato

    def __repr__(self):
        return f"<Fornecedor {self.nome} ({self.id})>"

    def atualizar_dados(self, nome: str, contato: str):
        self.nome = nome
        self.contato = contato
