import React, { useState, useEffect, useRef } from "react";
import { url } from "./files/constants";
import Answers from "./components/Answers";

const App = () => {
  const [question, setquestion] = useState("");

  const [result, setresult] = useState([]);

  const [selectedhistory, setselectedhistory] = useState("");
  const [loader, setloader] = useState(false);

  const scrollToAns = useRef();

  const [recentHistory, setrecentHistory] = useState(
    JSON.parse(localStorage.getItem("history"))
  );

  const isEnter = (e) => {
    if (e.key == "Enter") {
      askQuestion();
    }
  };

  useEffect(() => {
    askQuestion();
  }, [selectedhistory]);

  const clearHistory = () => {
    localStorage.clear();
    setrecentHistory("");
  };

  const askQuestion = async () => {
    if (!question && !selectedhistory) {
      return false;
    }
    if (question) {
      if (localStorage.getItem("history")) {
        let history = JSON.parse(localStorage.getItem("history"));
        history = [question, ...history];
        localStorage.setItem("history", JSON.stringify(history));
        setrecentHistory(history);
      } else {
        localStorage.setItem("history", JSON.stringify([question]));
        setrecentHistory([question]);
      }
    }

    const payloadData = question ? question : selectedhistory;

    const payload = {
      contents: [
        {
          parts: [
            {
              text: payloadData,
            },
          ],
        },
      ],
    };

    setloader(true);
    let response = await fetch(url, {
      method: "POST",

      body: JSON.stringify(payload),
    });

    response = await response.json();

    let dataSting = response.candidates[0].content.parts[0].text;
    dataSting = dataSting.split("* ");
    dataSting = dataSting.map((item) => item.trim());

    setresult([
      ...result,
      { type: "q", text: question ? question : selectedhistory },
      { type: "a", text: dataSting },
    ]);
    setquestion("");
    setTimeout(() => {
      scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
    }, 500);
    setloader(false);
  };
  return (
    <div className="grid grid-cols-5 h-screen text-center">
      <div className="col-span-1 bg-zinc-700">
        <h1 className=" flex justify-center text-xl bg-linear-to-r from-red-500 via-yellow-400 to-purple-600 bg-clip-text text-transparent pt-3 font-bold">
          <span>Recent Questions</span>
          <button className=" cursor-pointer" onClick={clearHistory}>
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="30px"
              viewBox="0 -960 960 960"
              width="20px"
              fill="#EA3323"
            >
              <path d="m400-325 80-80 80 80 51-51-80-80 80-80-51-51-80 80-80-80-51 51 80 80-80 80 51 51Zm-88 181q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480Zm-336 0v480-480Z" />
            </svg>
          </button>
        </h1>

        <ul className=" cursor-pointer text-left overflow-auto   mt-2 ">
          {recentHistory &&
            recentHistory.map((items, index) => (
              <li
                onClick={() => setselectedhistory(items)}
                className="p-1 pl-5 text-white truncate hover:bg-zinc-700 hover:text-zinc-200"
                key={index}
              >
                {items}
              </li>
            ))}
        </ul>
      </div>
      <div className="col-span-4 p-10">
        <h1
          className="text-4xl bg-clip-text text-transparent bg-linear-to-r
 from-pink-700 to-violet-700"
        >
          Welcome To Prashant AI
        </h1>
        {loader ? (
          <div role="status" className="flex justify-center my-4">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 animate-spin text-gray-300 fill-purple-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : null}

        <div ref={scrollToAns} className="container h-150 overflow-auto">
          <div className="text-white">
            <ul>
              {result.map((item, index) => (
                <div
                  key={index + Math.random()}
                  className={item.type == "q" ? "flex justify-end" : ""}
                >
                  {item.type === "q" ? (
                    <li
                      key={index + Math.random()}
                      className="text-right p-1 border-5 bg-zinc-700 border-zinc-700 rounded-br-3xl rounded-bl-3xl rounded-tl-3xl w-fit"
                    >
                      <Answers
                        ans={item.text}
                        totalResult={item.length}
                        index={index}
                        type={item.type}
                      />
                    </li>
                  ) : (
                    item.text.map((ansItem, ansIdex) => (
                      <li key={ansIdex} className="text-left">
                        <Answers
                          ans={ansItem}
                          totalResult={item.length}
                          index={ansIdex}
                          type={item.type}
                        />
                      </li>
                    ))
                  )}
                </div>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex  bg-zinc-800 h-16 w-1/2 p-1 text-white m-auto rounded-tl-3xl  border-zinc-400 border pr-5">
          <input
            onKeyDown={isEnter}
            onChange={(e) => {
              setquestion(e.target.value);
            }}
            value={question}
            className="w-full h-full p-3 outline-none"
            type="text"
            placeholder="Ask me anything"
          />
          <button onClick={askQuestion}>Ask</button>
        </div>
      </div>
    </div>
  );
};

export default App;
