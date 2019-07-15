from flask import Flask, request
from flask_cors import CORS
import requests
import random

app = Flask(__name__)
CORS(app)
API_KEY = 'cm9iZXJ0LmcubGV2eUBnbWFpbC5jb206ZTUyZGE2ZWI0ZDNiODlhZjgyZWJlODk3YzZlMmQ5YWNlYmU1ZTcyNw=='

@app.route('/')
def root():
    return 'Server is listening'

@app.route('/la-data/<la_code>')
def get_local_authority_data(la_code):
    headers = {
        'Authorization': f'Basic {API_KEY}',
        'Accept': 'application/json'
    }
    params = {
        'size': 50,
        'local-authority': la_code
    }
    url = f'https://epc.opendatacommunities.org/api/v1/domestic/search'
    res = requests.get(url, headers=headers, params=params)
    return res.text

@app.route('/postcodes', methods=['POST'])
def lookup_postcodes():
    """ Look up a pipe-separated list of postcodes using postcodes.io """
    url = 'http://api.postcodes.io/postcodes'
    postcodes = sorted(list(set(request.get_json())))
    # if len(postcodes) > 50:
    #     postcodes = random.sample(postcodes, 50)
    data = {
        'postcodes': postcodes
    }
    print(data)
    r = requests.post(url, data=data)
    return r.text
