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
import json
import sys
import numpy as np
import googlemaps
import os
from ast import literal_eval
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('GOOGLE_APIKEY')
gmaps = googlemaps.Client(key=api_key)  
openai.api_key = "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"
app = Flask(__name__)
client = MongoClient('mongodb+srv://Actify:Act1fy@cluster0.u87uqzy.mongodb.net/test', tlsCAFile=certifi.where())
db = client["Main"]
orgCollection = db["Organisations"]
initiativeCollection = db["Initiatives"]

def filterInitiatives(filterBy,filterFor):
    cursor = initiativeCollection.find({filterBy:filterFor})
    return json_util.dumps(cursor)

def locationCalculator(title):
    threshold = 10000
    location1 = initiativeCollection.find({"title":title})[0]["location"]
    cluster = initiativeCollection.find({"title":{"$not":{"title":"title"}}},{"title":1,"location":1})
    returnArr = []
    for document in cluster: 
        location2 = document["location"]
        googleMapsData = gmaps.distance_matrix(location1,location2)['rows'][0]['elements'][0]
        distance = googleMapsData["distance"]["value"]
        if distance < threshold: 
            returnArr.append({document["title"],distance})
    return returnArr

def rankingFormula(location1,tags):
    cluster = initiativeCollection.find({})
    titleArr = []
    rankArr = []
    documentArr = []
    for document in cluster: 
        rank = 0

        location2 = document["location"]["label"]
        googleMapsData = gmaps.distance_matrix(location1,location2)['rows'][0]['elements'][0]
        distance = googleMapsData["distance"]["value"]
        print('distance:',distance)
        rank_distance = ((distance/1000 + 1)**(-1))
        # normalize the rank to a number between 0 and 1

        print('distance weightage:', ((distance+1)**5))

        duration = googleMapsData["duration"]["value"]
        rank +=0*20 * (2.72**(-duration/(60*(10**14))))
        rank_distance += rank
        print('duration:', 20 * (2.72**(-duration/(60*(10**14)))))

        votes = document["petitionVotes"]
        rank += 0.25 * votes

        a = np.array(tags)
        b = np.array(document["tags"])
        print('tags array:', a, b)
        ans = len(np.intersect1d(a, b))
        print('tags:',ans)
        rank += 1000*(ans**2)

        donationPercentage = document["donationAmount"]/document["donationGoal"]
        rank+= 0.05 * (donationPercentage**0.5)

        titleArr.append(document["title"])
        rankArr.append(rank)
        documentArr.append(json_util.dumps(document))

    documentArr2 = [documentArr for _,documentArr in sorted(zip(rankArr,documentArr),reverse=True)]
    return documentArr2

def getTagsfromMessage(message):
    response = openai.Completion.create(
    model="text-davinci-003",
    prompt="Identify the keywords from the following message from one of the following keywords. Enter the output as an array. \nKey Words: [\"Animals\", \"Education\", \"Environment\", \"Transport\", \"Food\", \"Plastic\", \"Habitat\", \"Sanctuary\", \"Wildlife\", \"Sustainability\", \"Recycling\", \"Health\", \"Plantation\", \"Water\", \"Technology\", \"Women's Rights\"]\nMessage:{} \n".format(message),
    temperature=0.7,
    max_tokens=256,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )
    tags = response["choices"][0]["text"]
    tags = literal_eval(tags)
    # initTag = tags[0].split('Key Words: ')[1]
    # tags[0] = initTag

    print('prinasda',tags)
    for i in range(0,len(tags)): 
        if tags[i][:2] == "\n": 
            tags[i] = tags[i][3:]
        if tags[i][0] == " ":
            tags[i] = tags[i][1:]
        
    return tags

def recommendInitiatives(message): 
    """response = openai.Completion.create(
    model="text-davinci-003",
    prompt="Identify the users interests from the following message from one of the following tags: \nTags: [\"Animals\", \"Education\", \"Environment\", \"Transport\", \"Food\", \"Plastic\", \"Habitat\", \"Sanctuary\", \"Wildlife\", \"Sustainability\", \"Recycling\", \"Health\", \"Plantation\", \"Water\", \"Technology\", \"Women's Rights\"]\nMessage:{} \n".format(message),
    temperature=0.7,
    max_tokens=256,
    top_p=1,
    frequency_penalty=0,
    presence_penalty=0
    )
    tags = response["choices"][0]["text"].split(",")
    """
    tags = ["Animals","Women's Rights"]
    for i in range(0,len(tags)): 
        if tags[i][:2] == "\n": 
            tags[i] = tags[i][3:]
        if tags[i][0] == " ":
            tags[i] = tags[i][1:]
        
    initiativesList = []
    rankingList = []
    print(tags)
    initiatives = initiativeCollection.find({"tags":{"$in":tags}})
    try: 
        for initiative in initiatives: 
            initiativeTags = initiative["tags"]
            a = np.array(tags)
            b = np.array(initiativeTags)
            ans = len(np.intersect1d(a, b))
            if initiative["title"] not in initiativesList:
                initiativesList.append(initiative["title"])
                rankingList.append(ans)
            else: 
                rankingList[initiativesList.index(initiative)] += ans
    except Exception as e: 
        print(e)
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        print(exc_type, fname, exc_tb.tb_lineno)
    
    for (initiative,ranking) in zip(initiativesList,rankingList):
        print(initiative," ",ranking)

recommendInitiatives("I am interested in protecting dogs, and other animals, like cats. I also like helping empower women from rural communities")

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

def insertInitiative(name,email,title,alias,description,donationGoal,donationAmount,location,city,tags,petitionVotes,physicalProducts,image,website):
    print(name)
    insertDict = {"name":name,"email":email,"title":title,"alias":alias,"description":description,"donationGoal":donationGoal,"donationAmount":donationAmount,"location":location,"city":city,"tags":tags,"petitionVotes":petitionVotes,"physicalProducts":physicalProducts,"image":image,"website":website}
    print(insertDict)
    initiativeCollection.insert_one(insertDict)



def createDescription(name,location,needs):
    response = openai.Completion.create(
        model="text-babbage-001",
        prompt="Write an appeal for an initiative called {}, located in {}, that needs{}".format(name,location,needs),
        temperature=0.2,
        max_tokens=110,
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
            
            insertInitiative(json_data["name"],json_data["email"],json_data["title"],json_data["alias"],json_data["description"],json_data["donationGoal"],json_data["donationAmount"],json_data["location"],json_data["city"],json_data["tags"],json_data["petitionVotes"],json_data["physicalProducts"],json_data["image"],json_data["website"])
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
            # print('x', json_data)
            json_data = json.loads(x["body"])
            print('title: ',json_data['title'], 'city: ',json_data['city'], 'needs: ',json_data['needs'])
            to_return = createDescription(json_data["title"],json_data["city"],json_data["needs"])
            print(to_return)
            return ({"description": to_return })
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

@app.route('/getRankedList',methods = ["GET","POST"])
@cross_origin()
def getRankedList():
    if request.method == "POST":
        try: 
            x = json.loads(request.data.decode("utf-8"))
            json_data = json.loads(x["body"])
            tags = getTagsfromMessage(json_data["message"])
            print("tags",tags)
            print(json_data["location"])
            documentsRanked = rankingFormula(json_data["location"],tags)
            # print(documentsRanked)
            return (documentsRanked)

        except Exception as e: 
            print (e)


if __name__ == '__main__':
    app.run()