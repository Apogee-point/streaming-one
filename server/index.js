const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const cors = require('cors');

const app = express(); 
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowHeaders: ['my-custom-header'],
        credentials: true
    }

});
const videoPath = path.join(__dirname,'movie.mp4');
console.log(videoPath);
const PORT = 3000;

let currentTimestamp = 0;
let clients = [];

const startStreaming = () => {
    const stream = ffmpeg(videoPath)
        .format('flv')
        .on('start', () => {
            console.log('Streaming started');
        })
        .on('codecData', (data) => {
            console.log('Input is ' + data.audio + ' audio ' +
                'with ' + data.video + ' video');
        })
        .on('end', () => {
            console.log('Streaming ended');
        })
        .on('error', (err) => {
            console.log('Error: ' + err.message);
        });
    
    stream.pipe() // Pipe the output of the ffmpeg stream to the response object with the correct headers
        .on('data', (chunk) => { // chunk is a Buffer that contains the encoded video data for the current frame
            currentTimestamp += 1;
            io.emit('video', chunk);
        });

    setInterval(() => {
        currentTimestamp += 1; // Increment the current timestamp every second
        io.emit('currentTimestamp', currentTimestamp);
    }, 1000);
};

io.on('connection', (socket) => {
    console.log('New client connected');
    clients.push(socket);
    
    socket.emit('currentTimestamp', currentTimestamp);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        clients = clients.filter(client => client !== socket);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    startStreaming();
});