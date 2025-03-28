import React, { useRef, useState, useEffect } from "react";

const BeerComponent = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [beerLevel, setBeerLevel] = useState(100); // % full
    const totalFrames = 59; // Adjust this based on your video
    const [videoLoaded, setVideoLoaded] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleLoadedMetadata = () => {
            setVideoLoaded(true);
            updateBeerLevel(100); // Default to full beer
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        return () =>
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    }, []);

    const updateBeerLevel = (percentage: number) => {
        const video = videoRef.current;
        if (!video || !videoLoaded) return;
        video.currentTime = 0;
        const frameIndex = Math.round(((100 - percentage) / 100) * totalFrames);
        const frameTime = (frameIndex / totalFrames) * video.duration;

        // If the current time is less than the frame time, keep playing the video
        if (video.currentTime < frameTime) {
            console.log("its play time");
            video.play();
        }

        // When the video reaches the desired frame, pause it
        video.ontimeupdate = () => {
            if (video.currentTime >= frameTime) {
                video.pause(); // Pause when the frame is reached
                video.ontimeupdate = null; // Remove the event listener
            }
        };

        // Set the time to the frame time, but don't pause yet
        // video.currentTime = frameTime;
    };

    const handleBeerClick = (event: React.MouseEvent<HTMLVideoElement>) => {
        const video = videoRef.current;
        if (!video) return;

        const rect = video.getBoundingClientRect();
        const clickY = event.clientY - rect.top;
        const height = rect.height;

        // Convert click position to beer percentage
        const percentage = Math.round((clickY / height) * 100);
        const clampedPercentage = Math.max(0, Math.min(100, percentage));

        setBeerLevel(clampedPercentage);
        updateBeerLevel(clampedPercentage);
    };

    return (
        <div style={{ textAlign: "center", marginTop: 20 }}>
            <h2>Click to Set Your Beer Level 🍺</h2>

            {/* Video Component */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <video
                    ref={videoRef}
                    src="/beer.mp4" // Place beer.mp4 or beer.webm in /public
                    onClick={handleBeerClick}
                    width={100}
                    height={150}
                    style={{ cursor: "pointer", background: "#000" }}
                />
            </div>

            <p>{100 - beerLevel}% full</p>
        </div>
    );
};

export default BeerComponent;
