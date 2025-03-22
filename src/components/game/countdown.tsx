import React, { useEffect, useState } from "react";

interface CountdownOverlayProps {
    onComplete: () => void;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
    const [countdown, setCountdown] = useState(3); // Change 5 to any countdown duration

    useEffect(() => {
        if (countdown === 0) {
            onComplete(); // Call the parent function when countdown reaches 0
            return;
        }

        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [countdown, onComplete]);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white text-6xl font-bold">
            <div key={countdown} className="animate-countdownFade">
                {countdown}
            </div>
        </div>
    );
};

export default CountdownOverlay;
