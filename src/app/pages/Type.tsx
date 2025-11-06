"use client";
import { RotateCcw, ArrowRight, Settings } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import generateParagraph from "../utilities/TextGenerator";
import UserChart from "../components/UserChart";

export default function Type() {
  const [text, setText] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("");
  const [paraLength, setParaLength] = useState<number>(0);
  const [wpm, setWpm] = useState<number>(-1);
  const [acc, setAcc] = useState<number>(-1);
  const [userStatsData, setUserStatsData] = useState<UserInputStatsData[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [inputText, setInputText] = useState("");
  const [inputBg, setInputBg] = useState<boolean>(true);
  const [currentIndex, setcurrentIndex] = useState(0);
  const [correctInputWordIndex, setCorrectInputWordIndex] = useState<number[]>(
    []
  );
  const [settingsModalDisplay, setSettingsModalDisplay] =
    useState<boolean>(false);
  const [incorrectInputWordIndex, setIncorrectInputWordIndex] = useState<
    number[]
  >([]);

  useEffect(() => {
    let languageLocalStorage = window.localStorage.getItem("language");
    let paraLengthLocalStorage = window.localStorage.getItem("paraLength");

    if (languageLocalStorage) {
      setLanguage(languageLocalStorage);
    } else {
      setLanguage("english");
      languageLocalStorage = "english";
    }

    if (paraLengthLocalStorage) {
      setParaLength(Number(paraLengthLocalStorage));
    } else {
      setParaLength(50);
      paraLengthLocalStorage = "50";
    }

    setText(Array(Number(paraLengthLocalStorage)).fill("undefined"));
  }, []);

  useEffect(() => {
    getParagraph();
    if (paraLength) {
      window.localStorage.setItem("paraLength", paraLength.toString());
    }
    if (language) {
      window.localStorage.setItem("language", language);
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === "Escape") {
        retry();
      } else if (event.key === "Escape") {
        nextParagraph();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [language, paraLength]);

  const retry = () => {
    setCorrectInputWordIndex([]);
    setIncorrectInputWordIndex([]);
    setcurrentIndex(0);
    setInputText("");
    setStartTime(null);
    setWpm(-1);
    setAcc(-1);
    setUserStatsData([]);
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
      setText(Array(paraLength).fill("0"));
    }
  };

  const userInputHandler = (value: string) => {
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
      const indexAcc = (correctCount * 100) / totalAttempts;
      let indexWpm = 0;
      if (startTime) {
        const endTime = Date.now();
        const timeInMinutes = (endTime - startTime!) / 60000; // milliseconds to minutes
        indexWpm = correctCount / timeInMinutes;
      }

      setUserStatsData([
        ...userStatsData,
        {
          index: currentIndex,
          wpm: indexWpm,
          acc: indexAcc,
          word: text[currentIndex],
        },
      ]);

      setAcc(indexAcc);
      setWpm(indexWpm);
      setcurrentIndex(currentIndex + 1);
      setInputText("");
    } else if (value.endsWith(" ")) {
      setInputText("");
    } else {
      setInputText(value);
      if (
        currentIndex <= paraLength &&
        value !== text[currentIndex].substring(0, value.length)
      ) {
        setInputBg(false);
      } else {
        setInputBg(true);
      }
    }
  };

  return (
    <div className="">
      {currentIndex == text.length ? (
        <div>
          <div className="flex justify-between gap-5 text-3xl mb-10 font-bold">
            <div className="flex items-center ml-5">
              <span className="mr-3">
                WPM: {wpm == -1 ? "XX" : Math.ceil(wpm)}
              </span>
              /
              <span className="ml-3">
                ACC: {acc == -1 ? "XX" : Math.ceil(acc)}
              </span>
            </div>
            <div className="">
              <button
                className="p-2 bg-[#303030] cursor-pointer rounded-md hover:bg-[#3a3a3a] transition mr-5"
                title="retry (Shift + Esc)"
                onClick={retry}
              >
                <RotateCcw className="text-white w-8 h-8" />
              </button>
              <button
                className="p-2 bg-[#303030] cursor-pointer rounded-md hover:bg-[#3a3a3a] transition"
                title="next (Esc)"
                onClick={nextParagraph}
              >
                <ArrowRight className="text-white w-8 h-8" />
              </button>
            </div>
          </div>
          <UserChart userStatsData={userStatsData} paraLength={paraLength} />
        </div>
      ) : (
        <div className="mb-11">
          <div className="flex justify-between items-center gap-5 sm:text-2xl mb-4 pr-5 font-bold">
            <div>
              <button
                onClick={() => setSettingsModalDisplay(true)}
                className="text-xl bg-white rounded-md text-black sm:px-2 sm:py-1 mx-3 cursor-pointer hover:bg-[#7972ff] hover:text-white"
              >
                <Settings className="sm:w-8 sm:h-8" />
              </button>
            </div>
            <div>
              <span className="mr-3">
                WPM: {wpm == -1 ? "XX" : Math.ceil(wpm)}
              </span>
              /
              <span className="ml-3">
                ACC: {acc == -1 ? "XX" : Math.ceil(acc)}
              </span>
            </div>
          </div>
          <div className="px-8 py-3 pt-8 text-justify rounded-[10px] sm:text-2xl dark:bg-[#4f4e4e40] max-w-[72rem] font-semibold">
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
                  userInputHandler(e.target.value);
                }}
                className={`flex-grow bg-[#303030] text-[#FAFAFA] placeholder-gray-400 px-4 py-2 rounded-md focus:outline-none ${
                  inputBg ? "bg-[#3a3a3a]" : "bg-[#ff7d8547]"
                }`}
              />
              <button
                className="p-2 bg-[#303030] cursor-pointer rounded-md hover:bg-[#3a3a3a] transition"
                title="retry (Shift + Esc)"
                onClick={retry}
              >
                <RotateCcw className="text-white w-8 h-8" />
              </button>
              <button
                className="p-2 bg-[#303030] cursor-pointer rounded-md hover:bg-[#3a3a3a] transition"
                title="next (Esc)"
                onClick={nextParagraph}
              >
                <ArrowRight className="text-white w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal Start */}
      {settingsModalDisplay ? (
        <div className="absolute top-0 left-0 z-10 w-full min-h-screen flex justify-center items-center backdrop-blur-xs bg-[#111]/10">
          <div className=" bg-[#000]/80 mt-10 text-2xl rounded-xl pb-10">
            {/* Modal Body */}
            <div className="px-[18vw] flex flex-col justify-around py-5 h-[40vh]">
              {/* Modal title */}
              <h3 className="text-4xl mb-5 text-center font-bold">
                Settings Modal
              </h3>
              {/* Select Language option */}
              <div className="flex justify-around">
                <label
                  htmlFor="language-select"
                  className="p-3 min-w-80 font-bold"
                >
                  Select Language:
                </label>
                <select
                  className="bg-[#7972ff]/90 min-w-80 text-center rounded-lg p-3 text-[#fff]"
                  id="language-select"
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                  }}
                >
                  <option value="english">English</option>
                  <option value="german">German</option>
                </select>
              </div>

              {/* Select Paragraph Length */}
              <div className="flex justify-around">
                <label
                  htmlFor="language-select"
                  className="p-3 min-w-80 font-bold"
                >
                  Select Length:
                </label>
                <select
                  className="bg-[#7972ff]/90 min-w-80 text-center rounded-lg p-3 text-[#fff]"
                  id="word-select"
                  value={paraLength}
                  onChange={(e) => {
                    setParaLength(Number(e.target.value));
                  }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={250}>250</option>
                </select>
              </div>
            </div>

            {/* Modal close button */}
            <div className="flex justify-end px-[4vw]">
              <button
                className="px-5 py-2 rounded-lg cursor-pointer text-[#7972ff] border-1"
                onClick={() => {
                  setSettingsModalDisplay(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Settings Modal End */}
    </div>
  );
}
