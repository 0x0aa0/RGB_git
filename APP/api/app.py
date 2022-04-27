from flask import Flask, request
import pymongo
from bson import json_util
import json
import numpy as np

app = Flask(__name__)

client = pymongo.MongoClient("mongodb+srv://akultra:XL8QY#74.Tuf@test.blu2y.mongodb.net/Test?retryWrites=true&w=majority")

db = client.coins
col = db.get_collection("data")

db2 = client.rgb
col2 = db2.get_collection("price")


@app.route('/rgb')
def get_rgb():
    rgb = list(col2.find().sort("_id",-1).limit(1))
    return json.dumps({'data': rgb}, indent=4, default=json_util.default)

@app.route('/place')
def get_place():
    rgb = list(col2.find().sort("_id",-1).limit(288))
    rc = ((rgb[0]['r'] - rgb[-1]['r']) / rgb[0]['r']) * 100
    if rc > 0:
        rc = "+" + str(rc)
    gc = ((rgb[0]['g'] - rgb[-1]['g']) / rgb[0]['g']) * 100
    if gc > 0:
        gc = "+" + str(gc)
    bc = ((rgb[0]['b'] - rgb[-1]['b']) / rgb[0]['b']) * 100
    if bc > 0:
        bc = "+" + str(bc)
    ret = {
        'rc': rc,
        'gc': gc,
        'bc': bc
    }
    return json.dumps({'data': ret}, indent=4, default=json_util.default)

@app.route('/coins')
def get_coins():
    coins = list(col.find().sort("_id",-1).limit(1))
    return json.dumps({'data': coins}, indent=4, default=json_util.default)

@app.route('/line',methods = ['POST'])
def getbyidtest():
    id = request.get_json(force=True) 
    print(id)
    test = list(col.find().sort("_id",-1).limit(288))
    prices = []
    rgbs = []
    name = 0
    image = 0
    tick = 0
    price = 0
    change = 0
    r = 0
    g = 0
    b = 0
    n = 0
    for i in test:
        for j in i['data']:
            if j['id'] == id:
                prices.append(j['current_price'])
                rgbs.append(j['rgb'])
                if n == 0:
                    name = j['name']
                    image = j['image']
                    tick = j['symbol']
                    price = j['current_price']
                    change = j['price_change_percentage_24h']
                    r = j['rgb'][0]
                    g = j['rgb'][1]
                    b = j['rgb'][2]
                    n += 1
    times = np.arange(len(prices))
    times = times.tolist()
    prices.reverse()
    rgbs.reverse()
    ret = {
        'times': times,
        'prices': prices,
        'rgbs': rgbs,
        'name': name,
        'image': image,
        'tick': tick,
        'price': price,
        'change': change,
        'r': r,
        'g': g,
        'b': b
    }
    return json.dumps({'data': ret}, indent=4, default=json_util.default)