const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
app.use(express.static(path.join(__dirname, 'public'))); // can access files in public folder from client side
const socketIo = require('socket.io');
const http = require('http');
const server = http.createServer(app);
const io = socketIo(server,{
  cors: {
    origin: '*',
  }
});

const videoPath = path.join(__dirname, 'public/movie.mp4');

let time = 0;

app.use(cors());

const getDurationOfVideo2 = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => { // ffprobe is a tool that comes with ffmpeg that can be used to analyze media files
      if (err) return reject(err);
      resolve(metadata.format.duration);
    });
  });
};

const getDurationOfVideo = () => {
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const duration = fileSize / 100000; // 100000 is the average size of 1 second of video
  return duration;
}

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.emit('currentTime', time); // send current time to client when connected
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('pause', () => {
    console.log('pause video');
    socket.broadcast.emit('pause');
    // if it is for a specific room, use socket.to(roomId).emit('pause') or io.to(roomId).emit('pause') or socket.broadcast.to(roomId).emit('pause');
  });
  socket.on('play', () => {
    console.log('play video');
    socket.broadcast.emit('play');
  });
  socket.on('seek', (time) => {
    console.log('seek video to', time);
    socket.broadcast.emit('seek', time);
  });
});



app.get('/video', function(req, res) {
  const path = 'movie.mp4';
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
    const chunksize = (end-start)+1;
    const file = fs.createReadStream(path, {start, end});
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };

    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

app.get('/time', function(req, res) {
    res.json({ time });
});

const startStreaming = async () => {
  const duration = await getDurationOfVideo2(videoPath);
  console.log('duration', duration);
  setInterval(() => {
    time += 1;
    if (time >= duration) {
      time = 0; // Restart video
    }
    io.emit('time', time);
  }, 500); // every 500ms, send the current time to all connected clients
};

server.listen(3000, () => {
  console.log('listening on *:3000');
  startStreaming();
});