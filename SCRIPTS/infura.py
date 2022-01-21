import pymongo
from web3 import Web3
import json
import time
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

def get_price(contract):
  w3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/54eff31fb0204e86816078598d81abbd'))
  ABI = json.loads('[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf", "outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]')
  sample_transport=RequestsHTTPTransport(
    url='https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    verify=True,
    retries=5,
  )
  client = Client(
      transport=sample_transport
  )
  query = gql('''
  query {
  pair(id: "''' + contract + '''"){
      reserve0
      reserve1
  }
  }
  ''')
  response = client.execute(query)
  pair = response['pair']
  eth_value = float(pair['reserve1']) / float(pair['reserve0'])
  eth_value2 = float(pair['reserve0']) / float(pair['reserve1'])
  query = gql('''
  query {
  pair(id: "0xa478c2975ab1ea89e8196811f51a7b7ade33eb11"){
      reserve0
      reserve1
  }
  }
  ''')
  response = client.execute(query)
  eth_dai_pair = response['pair']
  dai_value = float(eth_dai_pair['reserve0']) / float(eth_dai_pair['reserve1'])
  if eth_value2 > eth_value:
    return eth_value * dai_value
  else:
    return eth_value2 * dai_value


client = pymongo.MongoClient("mongodb+srv://akultra:XL8QY#74.Tuf@test.blu2y.mongodb.net/Test?retryWrites=true&w=majority")
db = client.rgb

r = get_price("0xd3d2e2692501a5c9ca623199d38826e513033a17")
g = get_price("0x55d5c232d921b9eaa6b37b5845e439acd04b4dba")
b = get_price("0x7937619a9bd1234a303e4fe752b8d4f37d40e20c")
t = time.time()

ins = {
    'time' : t,
    'r' : r,
    'g' : g,
    'b' : b
}

db.price.insert_one(ins)

print(r)
print(g)
print(b)
print(time.time())
