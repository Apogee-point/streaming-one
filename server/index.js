const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const fs = require('fs');
app.use(express.static(path.join(__dirname, 'public'))); // can access files in public folder from client side

const videoPath = path.join(__dirname, 'public/movie.mp4');

let time = 0;

app.use(cors());

const getDurationOfVideo = () => {
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const duration = fileSize / 100000; // 100000 is the average size of 1 second of video
  return duration;
}



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

app.listen(3000, function () {
  // call every 1 second to increment global time variable and exit after duration of video
  const duration = getDurationOfVideo();
  console.log('duration', duration);
  const interval = setInterval(() => {
    time += 1;
    console.log(time);
    if (time >= duration) {
      console.log('Movie ended');
      clearInterval(interval);
    }
  }, 1000);
  console.log('Listening on port 3000!');
});