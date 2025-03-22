import techno from "../../lib/techno.gif";
import Spinner from "./spinner";

const GenerateGame = () => {
    return (
        <div className="flex items-center flex-col">
            <div role="status" className="flex items-center mt-8">
                <Spinner></Spinner>
            </div>
            <span className=" text-white mt-8">Creating Your Game...</span>
            <img src={techno} alt="Description of GIF" />
        </div>
    );
};

export { GenerateGame };
