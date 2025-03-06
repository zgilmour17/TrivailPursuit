const APIURL = process.env.REACT_APP_APIURL;

export const generateQuestion = async (topic: string) => {
    try {
        console.log(`${APIURL}/generate-question`);
        const response = await fetch(`${APIURL}/generate-question`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic }),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch question:", error);
        return null;
    }
};

export const generateSessionQuestions = async (
    topics: string[],
    amount: number
) => {
    try {
        console.log(`${APIURL}/generate-questions`);
        const response = await fetch(`${APIURL}/generate-questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topics, amount }),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch question:", error);
        return null;
    }
};
