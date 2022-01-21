from pycoingecko import CoinGeckoAPI
import time
import pymongo
import colorsys
import numpy as np


client = pymongo.MongoClient("mongodb+srv://akultra:XL8QY#74.Tuf@test.blu2y.mongodb.net/Test?retryWrites=true&w=majority")
db = client.rgb
col = db.get_collection("price")

p = list(col.find().sort("time",-1).limit(290))
p.reverse()

red=[]
grn=[]
blu=[]

for i in range(len(p)):
    red.append(p[i]["r"])
    grn.append(p[i]["g"])
    blu.append(p[i]["b"])


cg = CoinGeckoAPI()
coins = cg.get_coins_markets('usd')
coins = coins[:50]
now = time.time()
then = time.time() - 86400

tags = ["market_cap_rank", "fully_diluted_valuation", "total_volume", "high_24h", "low_24h", "price_change_24h", "market_cap_change_24h", "market_cap_change_percentage_24h", "circulating_supply", "total_supply", "max_supply", "ath_change_percentage", "ath_date", "ath", "atl", "atl_change_percentage", "atl_date", "roi", "last_updated"]
stables = ['tether', 'usd-coin', 'binance-usd', 'dai']

for i in range(len(coins)):
    id = coins[i]['id']
    prices = cg.get_coin_market_chart_range_by_id(id, 'usd', then, now)
    ps = []
    for j in range(len(prices['prices'])):
        ps.append(prices['prices'][j][1])
    r = np.corrcoef(ps, red[1:len(ps)+1])[0][1]
    rn = r
    if r < 0:
        r = 0
    g = np.corrcoef(ps, grn[1:len(ps)+1])[0][1]
    gn = g
    if g < 0:
        g = 0
    b = np.corrcoef(ps, blu[1:len(ps)+1])[0][1]
    bn = b
    if b < 0:
        b = 0
    h,s,v = colorsys.rgb_to_hsv(r,g,b)
    coins[i]['rgb'] = [rn, gn, bn, h, s, v]

    for tag in tags:
        del coins[i][tag]


db_new = client.coins
db_new.data.insert_one({"data": coins})