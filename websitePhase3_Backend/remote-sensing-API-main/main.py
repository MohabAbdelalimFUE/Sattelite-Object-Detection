from flask import Flask, request
from endpoints import blueprint as segmentation_endpoint
from flask_ngrok import run_with_ngrok
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
run_with_ngrok(app)
app.register_blueprint(segmentation_endpoint)

if __name__ == '__main__':
    app.run()
