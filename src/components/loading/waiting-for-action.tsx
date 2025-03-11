import Spinner from "./spinner";

export default function WaitingForUser() {
    return (
        <div className="flex flex-col items-center justify-center mt-8">
            <Spinner></Spinner>
            <h2 className="text-2xl font-bold mb-4 mt-8">
                Waiting for a players...
            </h2>
        </div>
    );
}
