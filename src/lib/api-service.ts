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
export const generateRules = async (amount: number) => {
    try {
        console.log(`${APIURL}/generate-rules`);
        const response = await fetch(`${APIURL}/generate-rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Failed to fetch rules:", error);
        return null;
    }
};

export const writeTriviaQuestions = async (res: any) => {
    try {
        console.log(`${APIURL}/write-trivia-questions`);
        const response = await fetch(`${APIURL}/write-trivia-questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ questions: res }),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Failed to write trivia questions:", error);
        return null;
    }
};

export const writeRules = async (rulesres: any) => {
    try {
        console.log(`${APIURL}/write-rules`);
        const response = await fetch(`${APIURL}/write-rules`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rules: rulesres }),
        });
        console.log(response);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("Failed to write rules:", error);
        return null;
    }
};
