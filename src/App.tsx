import { useState, useEffect, useRef } from "react";

function App() {
  const sampleText = `console.log("Hello World");`;
  const [text] = useState(sampleText);
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState("0.00");
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(input);
  const finishedRef = useRef(finished);
  const testStarted = () => {
    setStartTime(Date.now());
  };
  useEffect(() => {
    inputRef.current = input;
  }, [input]);
  useEffect(() => {
    finishedRef.current = finished;
  }, [finished]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (finished) return;

      if (e.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
        return;
      }

      if (e.key.length === 1) {
        if (input.length === 0) {
          testStarted();
        }
        setInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, finished]);
  useEffect(() => {
    const inter = setInterval(() => {
      if (startTime === null || finishedRef.current) return;
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 60000; // Convert ms to minutes
      const charactersTyped = inputRef.current.split("").length;
      const wordsTyped = charactersTyped / 5; // Average word length is 5
      setWpm(Math.round(wordsTyped / timeTaken));
      calculateAccuracy();
    }, 1000);
    return () => clearInterval(inter);
  }, [startTime]);
  useEffect(() => {
    if (input.length === text.length && startTime !== null) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 60000; // Convert ms to minutes
      const charactersTyped = input.split("").length;
      const wordsTyped = charactersTyped / 5; // Average word length is 5
      setWpm(Math.round(wordsTyped / timeTaken));
      calculateAccuracy();
      setFinished(true);
    }
  }, [input, startTime]);

  function calculateAccuracy() {
    const correctChars = text
      .split("")
      .filter((char, i) => char === input[i]).length;
    setAccuracy(((correctChars / text.length) * 100).toFixed(2));
  }

  function resetTest() {
    setInput("");
    setStartTime(null);
    setWpm(0);
    setAccuracy("0.00");
    setFinished(false);
  }

  function renderText() {
    return (
      <pre className="text-lg whitespace-pre-wrap text-gray-400">
        {text.split("").map((char, index) => {
          let colorClass = "text-gray-400";
          if (index < input.length) {
            if (input[index] === char) {
              colorClass = "text-green-400";
            } else {
              colorClass = "text-red-500";
            }
          }

          return (
            <span key={index} className={`${colorClass}`}>
              {char}
            </span>
          );
        })}
      </pre>
    );
  }

  return (
    <div className="m-auto flex min-h-screen max-w-3xl flex-col items-center justify-center p-6 text-white">
      <h1 className="mb-4 text-3xl font-bold">CodeFast</h1>

      <div className="w-full max-w-lg rounded-lg bg-gray-800 p-4 leading-relaxed">
        {renderText()}
      </div>

      <div className="mt-4 flex w-full flex-col items-center text-center">
        <div className="flex w-lg justify-between">
          <p className="text-xl font-semibold">WPM: {wpm}</p>
          <p className="text-xl font-semibold">Accuracy: {accuracy}%</p>
        </div>
        {finished && (
          <button
            className="mt-4 w-[300px] rounded bg-blue-500 px-4 py-2"
            onClick={resetTest}
          >
            Restart
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
