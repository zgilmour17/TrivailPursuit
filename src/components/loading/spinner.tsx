export default function Spinner() {
    return (
        <div className="relative flex items-center justify-center">
            <span className="absolute h-16 w-16 border-4 border-transparent border-t-neon-yellow rounded-full animate-spin"></span>
            <span className="absolute h-12 w-12 border-4 border-transparent border-t-neon-pink rounded-full animate-spin-slow"></span>
            <span className="absolute h-8 w-8 border-4 border-transparent border-t-neon-blue rounded-full animate-spin-reverse"></span>
            <style>
                {`
			@keyframes spin-slow {
			  0% { transform: rotate(0deg); }
			  100% { transform: rotate(360deg); }
			}
  
			@keyframes spin-reverse {
			  0% { transform: rotate(0deg); }
			  100% { transform: rotate(-360deg); }
			}
  
			.animate-spin-slow {
			  animation: spin-slow 2s linear infinite;
			}
  
			.animate-spin-reverse {
			  animation: spin-reverse 1.5s linear infinite;
			}
  
			.glow {
			  text-shadow: 0 0 5px #ff0, 0 0 10px #ff0, 0 0 20px #ff0;
			}
  
			.border-t-neon-yellow {
			  border-top-color: #ffea00;
			}
  
			.border-t-neon-pink {
			  border-top-color: #ff00ff;
			}
  
			.border-t-neon-blue {
			  border-top-color: #00ffff;
			}
  
			.text-neon-yellow {
			  color: #ffea00;
			}
		  `}
            </style>
        </div>
    );
}
