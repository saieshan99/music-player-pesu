const mongoDBClient = require("../db-client/MongoDBClient");
const collectionConstants = require("../constant/CollectionConstants");

const client = mongoDBClient.getClient();

function getAudios(audioIDs, callback) {
    client.connect().then(
        (client) => {
            const coll = client.db(mongoDBClient.connectedDB).collection(collectionConstants.COLL_AUDIOS);

            const query = audioIDs.reduce(
                (prevObj, audioID) => {
                    prevObj._id.$in.push(new mongoDBClient.ObjectId(audioID));

                    return prevObj;
                }, {_id: {$in: []}}
            );

            coll.find(query).toArray().then(
                (docs) => {
                    callback(docs);
                }
            ).catch(
                (err) => {
                    console.error(`Error while getting the audios: ${audioIDs} ${err}`);

                    callback(null);
                }
            );
        }
    ).catch(
        (err) => {
            console.error(`Error while connecting to server: ${err}`);

            callback(null);
        }
    );
}

function getAllAudios(callback) {
    client.connect().then(
        (client) => {
            const coll = client.db(mongoDBClient.connectedDB).collection(collectionConstants.COLL_AUDIOS);

            coll.find({}).toArray().then(
                (docs) => {
                    callback(docs);
                }
            ).catch(
                (err) => {
                    console.error(`Error while getting all audios: ${err}`);

                    callback(null);
                }
            );
        }
    ).catch(
        (err) => {
            console.error(`Error while connecting to server: ${err}`);

            callback(null);
        }
    );
}

module.exports = {
    getAllAudios: getAllAudios,
    getAudios: getAudios
};
