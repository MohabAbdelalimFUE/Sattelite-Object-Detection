from flask import Blueprint
from flask_restplus import Api
from endpoints.segmentation import namespace as segmentation_ns

blueprint = Blueprint('api', __name__, url_prefix='/api')
api_extension = Api(blueprint, title='Remote Sensing AI',
                    version='1.0',
                    description='Remote Sensing AI web API using Python Flask',
                    doc='/Swagger')

api_extension.add_namespace(segmentation_ns)
