const TriviaQuestion: React.FC<{ question: string }> = ({ question }) => (
    <span
        className="type font-medium"
        style={
            {
                "--n": question.length,
            } as React.CSSProperties
        }
    >
        {question}
    </span>
);

export default TriviaQuestion;
