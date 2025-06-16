from domain.produto_repository import ProdutoRepositoryInterface
from domain.produto import Produto

class CriarProdutoUseCase:
    def __init__(self, produto_repo: ProdutoRepositoryInterface):
        self.produto_repo = produto_repo

    def execute(self, produto: Produto) -> Produto:
        return self.produto_repo.salvar(produto)


class ListarProdutosUseCase:
    def __init__(self, produto_repo: ProdutoRepositoryInterface):
        self.produto_repo = produto_repo

    def execute(self) -> list[Produto]:
        return self.produto_repo.listar_todos()


class RemoverProdutoUseCase:
    def __init__(self, produto_repo: ProdutoRepositoryInterface):
        self.produto_repo = produto_repo

    def execute(self, produto_id: int) -> None:
        self.produto_repo.remover(produto_id)


class BuscarProdutoPorIdUseCase:
    def __init__(self, produto_repo: ProdutoRepositoryInterface):
        self.produto_repo = produto_repo

    def execute(self, produto_id: int) -> Produto:
        return self.produto_repo.buscar_por_id(produto_id)


class AtualizarEstoqueUseCase:
    def __init__(self, produto_repo: ProdutoRepositoryInterface):
        self.produto_repo = produto_repo

    def execute(self, produto_id: int, quantidade: int, operacao: str):
        """
        operacao: 'entrada' para adicionar ou 'saida' para remover do estoque
        """
        produto = self.produto_repo.buscar_por_id(produto_id)
        if not produto:
            raise ValueError("Produto não encontrado.")

        if operacao == "entrada":
            produto.adicionar_estoque(quantidade)
        elif operacao == "saida":
            produto.remover_estoque(quantidade)
        else:
            raise ValueError("Operação inválida. Use 'entrada' ou 'saida'.")

        self.produto_repo.atualizar(produto)
