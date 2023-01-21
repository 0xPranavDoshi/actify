import pymongo
client = pymongo.MongoClient("mongodb+srv://TestUser:<Act1fy>@cluster0.u87uqzy.mongodb.net/?retryWrites=true&w=majority")
db = client["Main"]
collection = db["Initiatives"]
cursor = collection.find({})
print(collection)
for document in cursor:
    print(document)
mydict = { "Name":"TestName" }

x = collection.insert_one(mydict)

print(x)