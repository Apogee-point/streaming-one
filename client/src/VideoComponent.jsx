import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const VideoPlayer = () => {
    const videoRef = useRef(null);
    const socketRef = useRef(null);
    const [timestamp, setTimestamp] = useState(0);

    useEffect(() => {
        // Connect to the socket.io server
        socketRef.current = io('http://localhost:3000');

        socketRef.current.on('currentTimestamp', (serverTimestamp) => {
            setTimestamp(serverTimestamp);
        });

        socketRef.current.on('video', (chunk) => {
            if (videoRef.current) {
                const blob = new Blob([chunk], { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);
                videoRef.current.src = url;
                videoRef.current.currentTime = timestamp;
                videoRef.current.play();
            }
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [timestamp]);

    return (
        <div>
            <video ref={videoRef} controls autoPlay />
        </div>
    );
};

export default VideoPlayer;
