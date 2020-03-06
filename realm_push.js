// import { Sync, open } from 'realm';
// import { username, password, httpUrl, realmUrl } from './constants';

var Realm = require('realm');
var constants = require('./constants');

const latencySchema = {
    name: 'latency',
    properties: {
        'positionx': { type: 'float', optional: false, default: 0.0 },
        'positiony': { type: 'float', opyional: false, default: 0.0 }
    }
}

const errorCallback = function errorCallback(message, isFatal, category, code) {
    console.log(`Message: ${message} - isFatal: ${isFatal} - category: ${category} - code: ${code}`)
}

const credentials = Realm.Sync.Credentials.usernamePassword(constants.username, constants.password, false);

export function sendPostion(xpos, ypos) {

    Realm.Sync.User.login(constants.httpUrl, credentials)
        .then((user) => {
            open({
                    sync: {
                        url: `${constants.realmUrl}/pause`,
                        user: user,
                        error: errorCallback,
                        fullSynchronization: true
                    },
                    schema: [latencySchema],
                })
                .then((realm) => {
                    realm.write(() => {
                            realm.create('latency', {
                                positionx: xpos,
                                positiony: ypos
                            }, true)
                        })
                        // }, 10, index)
                        // realm.close();
                }).catch((err) => {
                    console.log(err);
                });
            return 0;
        }).catch((err) => {
            console.log(err);
        })

}