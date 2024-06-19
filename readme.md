Start streaming the video with ffmpeg options -> 
- format('flv') - to stream in flv format
- on('start') - to log a message when streaming starts
- on('codecData') - to log the audio and video codec data
- on('end') - to log a message when streaming ends
- on('error') - to log an error message if streaming fails