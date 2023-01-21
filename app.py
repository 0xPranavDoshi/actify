import os
from flask import Flask, request, jsonify, make_response
from flask_cors import cross_origin
import json
import certifi
from pymongo import MongoClient
import os
import openai
openai.api_key = "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"

app = Flask(__name__)
client = MongoClient('mongodb+srv://Actify:Act1fy@cluster0.u87uqzy.mongodb.net/test', tlsCAFile=certifi.where())
db = client["Main"]
orgCollection = db["Organisations"]
initiativeCollection = db["Initiatives"]

def updatePetition(title):
    initiativeCollection.update_one({"title":title},{"$inc":{"petitionVotes":1}})
    petitionVotes = initiativeCollection.find_one({"title":title})["petitionVotes"]
    return petitionVotes

def getInitiatives():
    cursor = initiativeCollection.find({})
    documentArr = []
    for document in cursor:
        documentArr.append(document)
        print(document)
    return documentArr

def insertAccount(name,email):
    insertDict = {"name":name,"email":email}
    inserting = orgCollection.insert_one(insertDict)

def insertInitiative(name,email,title,description,donationGoal,donationAmount,location,petitionVotes,physicalProducts,image,website):
    print(name)
    insertDict = {"name":name,"email":email,"title":title,"description":description,"donationGoal":donationGoal,"donationAmount":donationAmount,"location":location,"petitionVotes":petitionVotes,"physicalProducts":physicalProducts,"image":image,"website":website}
    print(insertDict)
    initiativeCollection.insert_one(insertDict)

def createDescription(name,location,needs):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt="Write an appeal for an initiative called {}, located in {}, that needs{}".format(name,location,needs)
        temperature=0.7,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0
    )
    return response["choices"][0]["text"]
#[feasability,technology,implementation, innovation, problem statement ]

@app.route('/signUp', methods=["GET", "POST"])
# @cross_origin()
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

@app.route('/fetchInitiatives', methods = ["GET", "POST"])
@cross_origin()
def fetchInitiatives():
    if request.method == "POST":
        try: 
            cursor = getInitiatives()
            return (cursor)
        except Exception as e:
            print(e)
        
@app.route('/generateDescription',methods = ["GET","POST"])
@cross_origin()
def generateDescription():
    if request.method == "POST":
        try: 
            x = json.loads(request.data.decode("utf-8"))
            json_data = json.loads(x["body"])
            to_return = createDescription(json_data["title"],json_data["city"],json_data["needs"])
            return ({"description":to_return})
        except Exception as e: 
            print (e)

@app.route('/updatePetitionVotes',methods = ["GET","POST"])
@cross_origin()
def updatePetitionVotes():
    if request.method == "POST":
        try: 
            x = json.loads(request.data.decode("utf-8"))
            json_data = json.loads(x["body"])
            petitionVotes = updatePetitionVotes(json_data["title"])
            return ({"petitionVotes":petitionVotes})
        except Exception as e: 
            print (e)

if __name__ == '__main__':
    app.run()





