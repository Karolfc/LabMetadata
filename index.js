import { Socket } from 'socket.io';
import { express, Server, cors, os } from './dependencies.js'
import { request, response } from 'express';
const PORT = 8080; // No cambiar
// Cambiar por la IP del computador
const IPaddress = "192.168.1.8";
const SERVER_IP = IPaddress;

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use('/app', express.static('public-app'));

const httpServer = app.listen(PORT, () => {
    console.log(`Server is running, host http://${SERVER_IP}:${PORT}/`);
    console.table({ 
        'Client Endpoint' : `http://${SERVER_IP}:${PORT}/app`,
    });
});
// Run on terminal: ngrok http 5050;

const io = new Server(httpServer, { path: '/real-time' });

/* Websocket */

io.on('connection', socket => {
    console.log(socket.id);
    socket.on('userData', userData => {
        console.log(userData);
    })
});

/* Post the user info */

app.get('/Forms-Array', (request, response) => {
    response.send(userInfo);
});

let userInfo = [];

app.post('/Forms-Array', (request, response) => {
    const {Name, Email, Phone, Birth_Date, Location, Submission_Date, Interaction_Time, Submission_Time, Duration, Device_Type} = request.body;
    userInfo.push({Name, Email, Phone, Birth_Date, Location, Submission_Date, Interaction_Time, Submission_Time, Duration, Device_Type});
    console.log("User information: ", userInfo);
    response.json({received: request.body});
})
