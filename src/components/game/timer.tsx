import { useEffect, useState } from "react";
import { Progress } from "../../components/ui/progress";

interface TimerProps {
    onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ onTimeUp }) => {
    const TIMER_DURATION = 5000; // 15 seconds
    const UPDATE_INTERVAL = 100; // Update every 100ms for smoother progress

    const [progress, setProgress] = useState(100);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime((prev) => {
                const newTime = prev + UPDATE_INTERVAL;
                const newProgress = Math.max(
                    100 - (newTime / TIMER_DURATION) * 100,
                    0
                );

                setProgress(newProgress);

                if (newTime >= TIMER_DURATION) {
                    clearInterval(interval);
                    onTimeUp(); // Trigger the end of the timer
                }

                return newTime;
            });
        }, UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, [onTimeUp]);

    return <Progress value={progress} />;
};

export default Timer;
