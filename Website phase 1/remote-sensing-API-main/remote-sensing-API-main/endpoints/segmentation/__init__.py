from http.client import HTTPResponse
from socket import socket
from flask import request, Response, send_file, jsonify
from flask_restplus import Namespace, Resource, fields
from http import HTTPStatus
from numpy import require
from utilis.inference import inference, fake_img_resp
from utilis.mapbox_request import mapbox_request
namespace = Namespace('segmentation-model', 'Segmentation APIs')

segmentation_model = namespace.model('SegModel', {
    'Bbox': fields.List(
        fields.Float,
        required=True,
        description="List of Lat/long bounding box(min point and max point)"
    ),
    'Width': fields.Integer(required=True,
                            description="Width of the required image"),
    'Height': fields.Integer(required=True,
                             description="Height of the required image"),
    'Algorithm': fields.String(
        required=True,
        description="Machine Learning Algorithm"
    ),
    'PostProcessing': fields.String(
        required=True,
        description="Choose from two options (download output mask or show the mask on the map"
    )
})


@namespace.route('')
class Segmentaion(Resource):
    @namespace.response(500, 'Internal Server error')
    @namespace.expect(segmentation_model)
    @namespace.marshal_with(segmentation_model, code=HTTPStatus.CREATED)
    def post(self):
        '''Post method for segmentation of an given lat/long bounding box'''
        data = request.json
        bbox = data['Bbox']
        width = data['Width']
        height = data['Height']
        algorithm = data['Algorithm']
        postProcessing = data['PostProcessing']
        print(bbox, width, height)
        response = mapbox_request(bbox, width, height)
        print(response)
        prediction_img = inference(classifier=algorithm)
        return jsonify({'status': str("testtt")})

    def get(self):
        return send_file(
            'utilis/tmp/mask.jpg',
            as_attachment=True,
            attachment_filename='mask.jpg',
            mimetype='image/jpeg'
        )
