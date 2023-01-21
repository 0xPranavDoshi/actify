import os
from flask import Flask, request, jsonify, make_response
from flask_cors import cross_origin
import json
import certifi
from bson import json_util
from bson.json_util import dumps
from bson.json_util import loads
from pymongo import MongoClient
app = Flask(__name__)
client = MongoClient('mongodb+srv://Actify:Act1fy@cluster0.u87uqzy.mongodb.net/test', tlsCAFile=certifi.where())
db = client["Main"]
orgCollection = db["Organisations"]
initiativeCollection = db["Initiatives"]

def getInitiatives():
    cursor = initiativeCollection.find({})
    # documentArr = []
    # for document in cursor:
    #     documentArr.append(document)
    #     print(document)
    # convert mongodb cursor to json
    return json_util.dumps(cursor)


def insertAccount(name,email):
    insertDict = {"name":name,"email":email}
    inserting = orgCollection.insert_one(insertDict)

def insertInitiative(name,email,title,description,donationGoal,donationAmount,location,petitionVotes,physicalProducts,image,website):
    print(name)
    insertDict = {"name":name,"email":email,"title":title,"description":description,"donationGoal":donationGoal,"donationAmount":donationAmount,"location":location,"petitionVotes":petitionVotes,"physicalProducts":physicalProducts,"image":image,"website":website}
    print(insertDict)
    initiativeCollection.insert_one(insertDict)

#[feasability,technology,implementation, innovation, problem statement ]

@app.route('/signUp', methods=["GET", "POST"])
@cross_origin()
def signUp():
    if request.method == "POST":
        try:
            x = json.loads(request.data)
            json_data = json.loads(x['body'])

            insertAccount(json_data["name"],json_data["email"])
            print ("Account Added")

        except Exception as e:
            print(e)
    response = jsonify(response="SignUp POST URL")
    return (response)

@app.route('/addInitiative', methods=["GET", "POST"])
@cross_origin()
def addInitiative():
    if request.method == "POST":
        try:
            x = json.loads(request.data.decode("utf-8"))
            json_data = json.loads(x["body"])
            print(json_data["name"])
            
            insertInitiative(json_data["name"],json_data["email"],json_data["title"],json_data["description"],json_data["donationGoal"],json_data["donationAmount"],json_data["location"],json_data["petitionVotes"],json_data["physicalProducts"],json_data["image"],json_data["website"])
            return ("InitiatveAdded Added")
        except Exception as e:
            print(e)
    response = jsonify(response="addInitiative POST URL")
    return (response)

@app.route('/fetchInitiatives', methods = ["GET"])
@cross_origin()
def fetchInitiatives():
    cursor = getInitiatives()
    print(cursor)
    return cursor
        

if __name__ == '__main__':
    app.run()