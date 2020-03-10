const http = require('http');
var Realm = require('realm');
var constants = require('./constants');



const latencySchema = {
    name: 'latency',
    properties: {
        'positionx': { type: 'float', optional: false, default: 0.0 },
        'positiony': { type: 'float', optional: false, default: 0.0 }
    }
}

const errorCallback = function errorCallback(message, isFatal, category, code) {
    console.log(`Message: ${message} - isFatal: ${isFatal} - category: ${category} - code: ${code}`)
}

const credentials = Realm.Sync.Credentials.usernamePassword(constants.username, constants.password, false);
var realm1 = null;
var realm2 = null;
async function getRealm1() {
    var user = await Realm.Sync.User.login(constants.httpUrl, credentials);
    realm1 = await Realm.open({
        sync: {
            url: `${constants.realmUrl}/pause`,
            user: user,
            error: errorCallback,
            fullSynchronization: true
        },
        schema: [latencySchema],
    });
}
getRealm1();

async function getRealm2() {
    var user = await Realm.Sync.User.login(constants.httpUrl, credentials);

    realm2 = await Realm.open({
        sync: {
            url: `${constants.realmUrl}/pause`,
            user: user,
            error: errorCallback,
            fullSynchronization: true
        },
        schema: [latencySchema],
    });
}
getRealm2();

async function sendPosition(xpos, ypos) {
    if (realm1 === null) {
        setTimeout(function() {
            sendPosition(xpos, ypos);
        }, 1000);
        return;
    }

    await realm1.write(() => {
        realm1.create('latency', {
            positionx: xpos,
            positiony: ypos
        }, true)
    })
}



var offset = {};

async function listener() {

    console.log('listening...')
    let results = realm2.objects('latency')

    results.addListener((objects, changes) => {
        changes.insertions.forEach((index) => {
            let xpos = objects[index].positionx;
            let ypos = objects[index].positiony;
            console.log(xpos + ',' + ypos);
            offset.xpos = xpos;
            offset.ypos = ypos;
            console.log(offset);
        });


    });
}

setTimeout(function() {
    listener();
}, 5000)
const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            sendPosition(result.xpos, result.ypos);
            console.log(result);
            res.end();
        });
    } else if (req.method === 'GET') {
        res.write(JSON.stringify({
            xpos: offset.xpos,
            ypos: offset.ypos
        }));
        res.end();
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