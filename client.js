import net from "node:net";
import readline from "node:readline/promises";
import process from "node:process";
/**
 * TODO
 * 
 * fixes bugs on display message when hit "enter" on message
 */

let id;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const clearLine = (direction) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(direction, () => {
            resolve();
        });
    });
};
const moveCursor = (directionX, directionY) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(directionX, directionY, () => {
            resolve();
        });
    });
};

const ask = async (s) => {
    const message = await rl.question("Enter a message > ");
    //move the cursor one line up
    await moveCursor(0, -1);
    //clear the current line the cursor is in
    await clearLine(0);
    s.write(`${id}-message-${message}`);
};

const socket = net.createConnection(
    { host: "127.0.0.1", port: "3000" },
    async () => {
        console.log("Connected to the server");
        ask(socket);
    }
);
socket.on("data", async (data) => {
    //when we getting message
    console.log();
    //move cursor one line up
    await moveCursor(0, -1);
    //clear line that cursor just moved into
    await clearLine(0);
    if (data.toString('utf-8').substring(0, 2) === 'id') {
        //when we getting id
        id = data.toString('utf-8').substring(3);
        console.log(`Your id is ${id}!\n`)
    } else {

        //display data
        console.log(data.toString("utf-8"));
    }
    //empty line

    //ask for message
    ask(socket);
});
socket.on("end", () => console.log("connection ended"));
