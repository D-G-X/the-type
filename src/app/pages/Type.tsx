"use client";
import { RotateCcw, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function Type() {
  const text = [
    "Lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
    "Ut",
    "enim",
    "ad",
    "minim",
    "veniam",
    "quis",
    "nostrud",
    "exercitation",
    "ullamco",
    "laboris",
    "nisi",
    "ut",
    "aliquip",
    "ex",
    "ea",
    "commodo",
    "consequat",
    "Duis",
    "aute",
    "irure",
    "dolor",
    "in",
    "reprehenderit",
    "in",
    "voluptate",
    "velit",
    "esse",
    "cillum",
    "dolore",
    "eu",
    "fugiat",
    "nulla",
    "pariatur",
    "Excepteur",
    "sint",
    "occaecat",
    "cupidatat",
    "non",
    "proident",
    "sunt",
    "in",
    "culpa",
    "qui",
    "officia",
    "deserunt",
    "mollit",
    "anim",
    "id",
    "est",
    "laborum",
  ];
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
  return (
    <div>
      <div className="flex justify-end  gap-5 text-xl mb-2 pr-5 font-bold">
        <span>WPM: {wpm == -1 ? "XX" : Math.ceil(wpm)}</span>/
        <span>ACC: {acc == -1 ? "XX" : Math.ceil(acc)}</span>
      </div>
      <div className="px-5 py-3 text-justify rounded-[15px] text-2xl dark:bg-[#4f4e4e40] max-w-[72rem]">
        <div>
          {text.map((word, index) => {
            return (
              <span
                key={word + "-" + index}
                className={`inline ${
                  correctInputWordIndex.includes(index)
                    ? "text-green-500"
                    : incorrectInputWordIndex.includes(index)
                    ? "text-red-500"
                    : ""
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
                console.log(
                  value,
                  text[currentIndex].substring(0, value.length),
                  value !== text[currentIndex].substring(0, value.length)
                );
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
          >
            <RotateCcw className="text-white w-8 h-8" />
          </button>
          <button
            className="p-2 bg-[#303030] rounded-md hover:bg-[#3a3a3a] transition"
            title="next"
          >
            <ArrowRight className="text-white w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
