import { useEffect, useState } from "react";
import { Progress } from "../../components/ui/progress";

interface TimerProps {
    onTimeUp: (remainingTime: number) => void;
    stopTimer?: boolean;
}

const Timer: React.FC<TimerProps> = ({ onTimeUp, stopTimer = false }) => {
    const TIMER_DURATION = 5000; // 5 seconds
    const UPDATE_INTERVAL = 100; // Update every 100ms for smoother progress

    const [progress, setProgress] = useState(100);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isStopped, setIsStopped] = useState(false);

    useEffect(() => {
        if (isStopped) return;

        const interval = setInterval(() => {
            setElapsedTime((prev) => {
                const newTime = prev + UPDATE_INTERVAL;
                const remainingTime = Math.max(TIMER_DURATION - newTime, 0);
                const newProgress = Math.max(
                    100 - (newTime / TIMER_DURATION) * 100,
                    0
                );

                setProgress(newProgress);

                if (newTime >= TIMER_DURATION) {
                    clearInterval(interval);
                    onTimeUp(remainingTime); // Send remaining time (should be 0)
                }

                return newTime;
            });
        }, UPDATE_INTERVAL);

        return () => clearInterval(interval);
    }, [onTimeUp, isStopped]);

    useEffect(() => {
        if (stopTimer && !isStopped) {
            setIsStopped(true);
            onTimeUp(Math.max(TIMER_DURATION - elapsedTime, 0));
        }
    }, [stopTimer, elapsedTime, onTimeUp, isStopped]);

    return <Progress value={progress} />;
};

export default Timer;
