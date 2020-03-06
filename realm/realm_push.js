const faker = require('faker');
const Realm = require('realm');
const fs = require('fs');
const constants = require('./constants');

var totallatencys = 5000;

const latencySchema = {
    name: 'latency',
    primaryKey: 'uuid',
    properties: {
        'uuid': { type: 'int', optional: false, default: 0 },
        'timestamps': { type: 'int', optional: false, default: '' },
    }
}

const errorCallback = function errorCallback(message, isFatal, category, code) {
    console.log(`Message: ${message} - isFatal: ${isFatal} - category: ${category} - code: ${code}`)
}

const credentials = Realm.Sync.Credentials.usernamePassword(constants.username, constants.password, false);
Realm.Sync.User.login(constants.httpUrl, credentials)
    .then((user) => {
        Realm.open({
            sync: {
                url: `${constants.realmUrl}/test`,
                user: user,
                error: errorCallback,
                fullSynchronization: true
            },
            schema: [latencySchema],
        })
            .then((realm) => {
                //write to the realm
                let tickerResults = realm.objects('latency');
                for (let index = 0; index < totallatencys; index++) {
                    // setTimeout(function (index) {
                    realm.write(() => {
                        realm.create('latency', {
                            uuid: index+tickerResults.length,
                            timestamps: Date.now(),
                        }, true)
                    })
                    // }, 10, index)
                }

                // realm.close();
                return 0;
            }).catch((err)=>{
                console.log(err);
            });
            return 0;
    }).catch((err)=>{
        console.log(err);
    })