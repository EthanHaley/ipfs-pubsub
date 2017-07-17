const IPFS = require('ipfs');
const Room = require('ipfs-pubsub-room');

const ipfs = new IPFS({
    repo: repo(),
    EXPERIMENTAL: {
	pubsub: true
    }
});

ipfs.once('ready', () => ipfs.id((err, info) => {
    if(err) { throw err }
    console.log('IPFS node ready with address ' + info.id);
}));

const room = Room(ipfs, 'ipfs-pubsub');

room.on('peer joined', (peer) => console.log('peer ' + peer + ' joined'));
room.on('peer left', (peer) => console.log('peer ' + peer + ' left'));

// Send and receive messages

room.on('peer joined', (peer) => room.sendTo(peer, 'Hello ' + peer + '!'));
room.on('message', (message) => console.log('Got message from ' + message.from + ': ' + message.data.toString()));

// Broadcast message every 2 seconds

//setInterval(() => room.broadcast('Hey everyone!'));

function repo() {
    return 'ipfs/pubsub/' + Math.random();
}
