import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export interface SessionHostFormAnswers {
	sessionPassword: string;
	givenName: string;
	topic: string;
}
interface SessionHostFormProps {
	onComplete: (answers: SessionHostFormAnswers) => void;
	onBack: () => void; // Add the back handler
}

const SessionHostForm: React.FC<SessionHostFormProps> = ({
	onComplete,
	onBack,
}) => {
	const [sessionPassword, setSessionPassword] = useState("");
	const [givenName, setGivenName] = useState("");
	const [topic, setTopic] = useState("");
	// WebSocket

	const handleHost = () => {
		// Add your join logic here
		onComplete({ sessionPassword, givenName, topic });
	};

	return (
		<div>
			<Button
				className="absolute top-4 left-4"
				onClick={onBack}
				size="icon"
				variant="secondary"
			>
				<ChevronLeft />
			</Button>
			<h1 className="text-2xl font-bold mb-4 text-white mx-auto w-full text-center">
				Host Session
			</h1>
			<form onSubmit={handleHost} className="space-y-4">
				<div className="flex items-start space-x-4 max-md:flex-col">
					{/* Input fields */}
					<div className="flex-1 space-y-4 w-full text-start">
						<div>
							<label className="block text-sm font-medium text-white">
								Session Password
							</label>
							<Input
								type="text"
								value={sessionPassword}
								onChange={(e) =>
									setSessionPassword(e.target.value)
								}
								className="mt-1 block w-full"
								placeholder="Enter session password"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-white">
								Given Name
							</label>
							<Input
								type="text"
								value={givenName}
								onChange={(e) => setGivenName(e.target.value)}
								className="mt-1 block w-full"
								placeholder="Enter your name"
								required
							/>
						</div>

						<div>
							<label className="block text-sm font-medium text-white">
								Topic
							</label>
							<Input
								type="text"
								value={topic}
								onChange={(e) => setTopic(e.target.value)}
								className="mt-1 block w-full"
								placeholder="Enter your topic"
								required
							/>
						</div>
					</div>
					{/* <div className="flex-shrink-0">
                        <BeerComponent />
                    </div> */}
				</div>

				<Button type="submit" className="w-full" variant="secondary">
					Host
				</Button>
			</form>
		</div>
	);
};
export { SessionHostForm };
