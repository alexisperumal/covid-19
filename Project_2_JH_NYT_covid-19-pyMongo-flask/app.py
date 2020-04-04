from flask import Flask
from flask import render_template
from pymongo import MongoClient
import json
from bson import json_util
from bson.json_util import dumps

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/confirmed_db/confirmed_data")
def confirmed_db_confirmed_data():
    client = MongoClient('localhost', 27017)
    db = client['confirmed_db']
    collection_confirmed = db['confirmed']
    confirmed_data = collection_confirmed.find()
    json_confirmed = []
    for c in confirmed_data:
        json_confirmed.append(c)
    json_confirmed = json.dumps(json_confirmed, default=json_util.default)
    client.close()
    return json_confirmed


@app.route("/deaths_db/deaths_data")
def deaths_db_deaths_data():
    client = MongoClient('localhost', 27017)
    db = client['deaths_db']
    collection_deaths = db['deaths']
    deaths_data = collection_deaths.find()
    json_deaths = []
    for d in deaths_data:
        json_deaths.append(d)
    json_deaths = json.dumps(json_deaths, default=json_util.default)
    client.close()
    return json_deaths


@app.route("/recovered_db/recovered_data")
def recovered_db_recovered_data():
    client = MongoClient('localhost', 27017)
    db = client['recovered_db']
    collection_recovered = db['recovered']
    recovered_data = collection_recovered.find()
    json_recovered = []
    for r in recovered_data:
        json_recovered.append(r)
    json_recovered = json.dumps(json_recovered, default=json_util.default)
    client.close()
    return json_recovered

if __name__ == "__main__":
    app.run(host='0.0.0.0',port=5000,debug=True)