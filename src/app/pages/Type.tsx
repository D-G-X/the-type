"use client";
import { RotateCcw, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import generateParagraph from "../utilities/TextGenerator";

export default function Type() {
  const [text, setText] = useState<string[]>([]);
  const [language, setLanguage] = useState("english");
  const [paraLength, setParaLength] = useState(50);
  const [wpm, setWpm] = useState<number>(-1);
  const [acc, setAcc] = useState<number>(-1);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [inputText, setInputText] = useState("");
  const [inputBg, setInputBg] = useState<boolean>(true);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [correctInputWordIndex, setCorrectInputWordIndex] = useState<number[]>(
    []
  );
  const [incorrectInputWordIndex, setIncorrectInputWordIndex] = useState<
    number[]
  >([]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && event.shiftKey) {
        retry();
      } else if (event.key === "Escape") {
        nextParagraph();
      }
    };

    document.addEventListener("keydown", handleEscape);
    getParagraph();

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const retry = () => {
    setCorrectInputWordIndex([]);
    setIncorrectInputWordIndex([]);
    setcurrentIndex(0);
    setInputText("");
    setStartTime(null);
    setWpm(-1);
    setAcc(-1);
  };

  const nextParagraph = () => {
    retry();
    getParagraph();
  };

  const getParagraph = () => {
    const paragraph = generateParagraph(language, paraLength);
    if (paragraph["status"] == 200) {
      setText(paragraph["text_array"]);
    } else {
      setText([]);
    }
  };
  return (
    <div>
      <div className="flex justify-end  gap-5 text-2xl mb-2 pr-5 font-bold">
        <span>WPM: {wpm == -1 ? "XX" : Math.ceil(wpm)}</span>/
        <span>ACC: {acc == -1 ? "XX" : Math.ceil(acc)}</span>
      </div>
      <div className="px-8 py-3 pt-8 text-justify rounded-[10px] text-2xl dark:bg-[#4f4e4e40] max-w-[72rem] font-semibold">
        <div>
          {text.map((word, index) => {
            return (
              <span
                key={word + "-" + index}
                className={`inline ${
                  correctInputWordIndex.includes(index)
                    ? "text-[#34D399]"
                    : incorrectInputWordIndex.includes(index)
                    ? "text-[#F87171]"
                    : currentIndex == index
                    ? "text-[#7972ff]"
                    : "#fff"
                }`}
              >
                {word}
                {index !== text.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
        <div className="flex items-center gap-4 my-5">
          <input
            type="text"
            placeholder={text[currentIndex]}
            value={inputText}
            onChange={(e) => {
              const value = e.target.value;
              const trimmed = value.trimEnd();
              if (startTime == null && currentIndex == 0) {
                setStartTime(Date.now());
              }
              if (
                trimmed.length != 0 &&
                value.endsWith(" ") &&
                currentIndex < text.length
              ) {
                setInputBg(true);
                const isCorrect = text[currentIndex] === trimmed;

                const newCorrect = [...correctInputWordIndex];
                const newIncorrect = [...incorrectInputWordIndex];

                if (isCorrect) {
                  newCorrect.push(currentIndex);
                  setCorrectInputWordIndex(newCorrect);
                } else {
                  newIncorrect.push(currentIndex);
                  setIncorrectInputWordIndex(newIncorrect);
                }

                const totalAttempts = currentIndex + 1;
                const correctCount = newCorrect.length;

                setAcc((correctCount * 100) / totalAttempts);
                setcurrentIndex(currentIndex + 1);
                setInputText("");
                if (startTime) {
                  const endTime = Date.now();
                  const timeInMinutes = (endTime - startTime!) / 60000; // milliseconds to minutes
                  setWpm(correctCount / timeInMinutes);
                }
              } else if (value.endsWith(" ")) {
                setInputText("");
              } else {
                setInputText(value);
                if (value !== text[currentIndex].substring(0, value.length)) {
                  setInputBg(false);
                } else {
                  setInputBg(true);
                }
              }
            }}
            className={`flex-grow bg-[#303030] text-[#FAFAFA] placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none ${
              inputBg ? "bg-[#3a3a3a]" : "bg-[#ff7d8547]"
            }`}
          />
          <button
            className="p-2 bg-[#303030] rounded-md hover:bg-[#3a3a3a] transition"
            title="retry"
            onClick={retry}
          >
            <RotateCcw className="text-white w-8 h-8" />
          </button>
          <button
            className="p-2 bg-[#303030] rounded-md hover:bg-[#3a3a3a] transition"
            title="next"
            onClick={nextParagraph}
          >
            <ArrowRight className="text-white w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
