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
