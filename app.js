var Realm = require('realm');
var constants = require('./constants');

const errorCallback = function errorCallback(message, isFatal) {
    console.log(`Message:`, message, `- isFatal:`, isFatal)
}


async function main() {

    const credentials = Realm.Sync.Credentials.usernamePassword(constants.username, constants.password, false);
    const adminUser = await Realm.Sync.User.login(constants.httpUrl, credentials);
    Realm.open({
        sync: {
            user: adminUser,
            url: `${constants.realmUrl}/test`,
            fullSynchronization: true,
            error: errorCallback,
        }
    }).then(realm => {
        console.log('listening...')
        let results = realm.objects('latency')

        var i = 0;
        var avg = 0;

        results.addListener((objects, changes) => {
            changes.insertions.forEach((index) => {
                let insertedTimestamp = objects[index].timestamps;
                console.log(insertedTimestamp);
            });


        });


    }).catch(error => {
        console.log(`error while writing : `, error);
    })
}

main();