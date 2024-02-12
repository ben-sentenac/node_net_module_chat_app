import net from 'node:net';

const server = net.createServer();
//array of client sockets
const clients = [];

server.on('connection', (socket) => {

    const _clientId = clients.length + 1;

    console.log(`Client ${ _clientId } connected to the server`);

     //broadcast message for everyone when somoene joinedth chat
    clients.map(({ clientId,socket}) => {
        socket.write(`User ${clientId} joined!`)
    });
    socket.write(`id-${_clientId}`);

    socket.on('data', (data) => {
        const dataString = data.toString('utf-8');
          //indicate the id of send the message
        const id = dataString.substring(0,dataString.indexOf('-'));
        const message = dataString.substring(dataString.indexOf('-message-') + 9);
        clients.map(({ socket }) => socket.write(`> User ${ id }: ${message}`));
    });
    //broadcast message for everyone when somoene leave th chat
    socket.on('end',() => {
        clients.map(({ clientId,socket}) => {
            socket.write(`User ${clientId} left!`)
        });
    });

    socket.on("error", () => {
        clients.map(({clientId,socket}) => {
            socket.write(`User ${clientId} left!`);
        });
    });
    

    clients.push({clientId:_clientId.toString(),socket});
});

server.on('listening', () => {
    console.log('Server listening on', server.address());
});
server.listen(3000,"127.0.0.1");