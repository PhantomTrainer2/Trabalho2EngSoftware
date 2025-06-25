from flask import Flask
from flask_cors import CORS
from infra.db.database import criar_banco_de_dados
from app.routes.produto_routes import produto_bp
from app.routes.fornecedor_routes import fornecedor_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(produto_bp)
    app.register_blueprint(fornecedor_bp)
    
    criar_banco_de_dados()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
