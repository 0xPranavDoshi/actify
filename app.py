import os
from flask import Flask, request, jsonify, make_response
from flask_cors import cross_origin
import json
import certifi
from pymongo import MongoClient
import os
import openai
from bson import json_util
from bson.json_util import dumps
from bson.json_util import loads

openai.api_key = "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"

app = Flask(__name__)
client = MongoClient('mongodb+srv://Actify:Act1fy@cluster0.u87uqzy.mongodb.net/test', tlsCAFile=certifi.where())
db = client["Main"]
orgCollection = db["Organisations"]
initiativeCollection = db["Initiatives"]

def filterInitiatives(filterBy,filterFor):
    cursor = initiativeCollection.find({filterBy:filterFor})
    return json_util.dumps(cursor)

def recommendInitiatives(message): 
    response = openai.Completion.create(
    model="text-davinci-003",
    prompt="Identify the users interests from the following message from one of the following tags: \nTags: [\"Animals\", \"Criminal Justice\", \"Disability\", \"Economic Justice\", \"Education\", \"Entertainment\", \"Environment\", \"Family\", \"Food\", \"Health\", \"Human Rights\", \"Immigration\", \"LGBT Rights\", \"Politics\", \"Technology\", \"Women's Rights\"]\nMessage:{} \n".format(message),
    temperature=0.7,
    max_tokens=110,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )
    tags = response["choices"][0]["text"].split(",")
    initiativesList = []
    rankingList = []

    for tag in tags: 
        initiatives = filterInitiatives("tags",tag)
        print(initiatives)
        for initiative in initiatives: 
            print(initiative)
            if initiative["title"] not in initiativesList:
                initiativesList.append(initiative["title"])
                rankingList.append(1)
            else: 
                rankingList[initiativesList.index(initiative)] +=1 
    
    for (initiative,ranking) in zip(initiativesList,rankingList):
        print(initiative," ",ranking)

# recommendInitiatives("I am interested in protecting dogs, and other animals, like cats. I also like helping empower women from rural communities")

def addPetition(title, petitionCount):
    initiativeCollection.update_one({"title":title},{"$set":{"petitionVotes":petitionCount}})
    # petitionVotes = initiativeCollection.find_one({"title":title})["petitionVotes"]
    return 0

def getInitiatives():
    cursor = initiativeCollection.find({})
    return json_util.dumps(cursor)

def insertAccount(name,email):
    insertDict = {"name":name,"email":email}
    inserting = orgCollection.insert_one(insertDict)

def insertInitiative(name,email,title,alias,description,donationGoal,donationAmount,location,tags,petitionVotes,physicalProducts,image,website):
    print(name)
    insertDict = {"name":name,"email":email,"title":title,"alias":alias,"description":description,"donationGoal":donationGoal,"donationAmount":donationAmount,"location":location,"tags":tags,"petitionVotes":petitionVotes,"physicalProducts":physicalProducts,"image":image,"website":website}
    print(insertDict)
    initiativeCollection.insert_one(insertDict)

def createDescription(name,location,needs):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt="Write an appeal for an initiative called {}, located in {}, that needs{}".format(name,location,needs),
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
            
            insertInitiative(json_data["name"],json_data["email"],json_data["title"],json_data["alias"],json_data["description"],json_data["donationGoal"],json_data["donationAmount"],json_data["location"],json_data["tags"],json_data["petitionVotes"],json_data["physicalProducts"],json_data["image"],json_data["website"])
            return ("InitiatveAdded Added")
        except Exception as e:
            print(e)
    response = jsonify(response="addInitiative POST URL")
    return (response)

@app.route('/fetchInitiatives', methods = ["GET"])
@cross_origin()
def fetchInitiatives():
    try: 
        cursor = getInitiatives()
        return (cursor)
    except Exception as e:
        print(e)

@app.route('/fetchfromAlias', methods = ["GET","POST"])
@cross_origin()
def fetchfromAlias():
    if request.method == "POST":
        try:
            x = json.loads(request.data)
            json_data = json.loads(x['body'])

            alias = json_data["alias"]
            
            cursor = initiativeCollection.find({"alias":alias})
            return json_util.dumps(cursor)
        except Exception as e:
            print(e)

@app.route('/filter',methods = ["GET","POST"])
@cross_origin()
def filterInitiatives():
    if request.method == "POST":
        try:
            x = json.loads(request.data)
            json_data = json.loads(x['body'])

            filterBy = json_data["filterBy"]
            filterFor = json_data["filterFor"]
            
            cursor = initiativeCollection.find({filterBy:filterFor})
            return json_util.dumps(cursor)
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

@app.route('/addPetitionVote',methods = ["GET","POST"])
@cross_origin()
def addPetitionVote():
    if request.method == "POST":
        try: 
            x = json.loads(request.data.decode("utf-8"))
            json_data = json.loads(x["body"])
            print(json_data['title'])
            petitionVotes = addPetition(json_data["title"], json_data["petitionCount"])
            print(petitionVotes)
            return ({"petitionVotes":petitionVotes})
        except Exception as e: 
            print (e)

if __name__ == '__main__':
    app.run()