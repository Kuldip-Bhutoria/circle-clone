const http = require('http');
const { parse } = require('querystring');

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
var realm = Realm.Sync.User.login(constants.httpUrl, credentials)
    .then((user) => {
        return Realm.open({
            sync: {
                url: `${constants.realmUrl}/pause`,
                user: user,
                error: errorCallback,
                fullSynchronization: true
            },
            schema: [latencySchema],
        }).then((realm) => {
            return realm;
        })
    });

function sendPosition(xpos, ypos) {
    realm.write(() => {
        realm.create('latency', {
            positionx: xpos,
            positiony: ypos
        }, true)
    })
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(realm);
            sendPosition(result.xpos, result.ypos);
            console.log(result);
            res.end();
        });
    } else {
        res.end();
    }
});
server.listen(8000);
console.log(`server listening on port 8000`);

function collectRequestData(request, callback) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        callback(JSON.parse(body));
    });

}