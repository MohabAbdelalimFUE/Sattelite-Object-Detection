import os
try:
    import osr, gdal
except ImportError:
    from osgeo import osr, gdal
from werkzeug.utils import secure_filename
from flask import request, jsonify, send_file
from flask_restplus import Namespace, Resource
from utilis.mapbox_request import mapbox_request

namespace = Namespace('upload-file', 'Upload File')

ALLOWED_EXTENSIONS = set(['img', 'tif', 'tiff', 'gutiff', 'disk'])
upload_path = 'utilis/tmp/uploads'

secret_key = "secret key"
max_size = 16 * 1024 * 1024


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def extract(ras_ds):
    geot = ras_ds.GetGeoTransform()
    width = ras_ds.RasterXSize
    height = ras_ds.RasterYSize

    minx = geot[0]  # lower left x
    miny = geot[3] + width * geot[4] + height * geot[5]  # lower left y
    maxx = geot[0] + width * geot[1] + height * geot[2]  # upper right x
    maxy = geot[3]  # upper right y

    # get CRS from dataset
    crs = osr.SpatialReference()
    crs.ImportFromWkt(ras_ds.GetProjectionRef())
    # create lat/long crs with WGS84 datum
    crsGeo = osr.SpatialReference()
    crsGeo.ImportFromEPSG(4326)  # 4326 is the EPSG id of lat/long crs
    t = osr.CoordinateTransformation(crs, crsGeo)
    latlong = []
    point1 = t.TransformPoint(minx, miny)
    point2 = t.TransformPoint(maxx, maxy)
    latlong.append(point1[0])
    latlong.append(point1[1])
    latlong.append(point2[0])
    latlong.append(point2[1])
    return latlong,width,height


@namespace.route('')
class Upload(Resource):
    @namespace.response(500, 'Internal Server error')
    def post(self):
        print(request.files)
        if 'file' not in request.files:
            resp = jsonify({'message': 'No file part in the request'})
            resp.status_code = 400
            print("first")
            return resp
        file = request.files['file']
        if file.filename == '':
            resp = jsonify({'message': 'No file selected for uploading'})
            resp.status_code = 400
            print("second")
            return resp
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            print("third")
            file.save(os.path.join(upload_path, filename))
            latlong,width,height = extract(gdal.Open(os.path.join(upload_path, filename)))
            print(width,height)
            if width > 1280 or height > 1280:
                response = mapbox_request(latlong,int(width/10),int(height/10),uploaded=True)    #max size for image is 1280x1280 (mapbox standard)
            else:
                response = mapbox_request(latlong,width,height,uploaded=True)
            print(response)
            resp = jsonify({'message': 'File successfully uploaded'},{'bbox':"[["+str(latlong[0])+","+str(latlong[1])+"],["+str(latlong[2])+","+str(latlong[3])+"]]"})
            resp.status_code = 201
            return resp
        else:
            resp = jsonify({'message': 'Allowed file types are txt, pdf, png, jpg, jpeg, gif'})
            resp.status_code = 400
            return resp
    