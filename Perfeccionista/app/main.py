from flask import Flask
from infra.db.database import init_db
from Perfeccionista.app.routes.produto_routes import produto_bp

def create_app():
    app = Flask(__name__)
    app.register_blueprint(produto_bp)
    
    init_db()  # Inicializa/cria o banco se não existir
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
