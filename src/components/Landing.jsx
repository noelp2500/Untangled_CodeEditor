import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import Draggable from "react-draggable";
import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import Loader from "./Loader";
import { ResultFormatter } from "../utils/resultFormatter";
import { promptExtractInCode, codeExtractInCode } from "../utils/codeFormatter";
import { defaultCodeSnippet } from "../constants/defaultCodeSnippet";

const Landing = () => {
  const [code, setCode] = useState(defaultCodeSnippet);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[37]);
  const [loading, setLoading] = useState(false);
  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");
  const [error, setError] = useState(false);

  const onSelectChange = (sl) => {
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };

    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        setError(true);
        setProcessing(false);
        console.log("err", err);
        let error = err.response ? err.response.data : err;
        console.log("error", error);
        let status = err.response.status;
        if (status === 429) {
          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
      });
  };

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    const theme = th;

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }

  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleAICall = async () => {
    try {
      const apiUrl = "https://noelp2500.pythonanywhere.com/api/palmAIHelper";
      const data = {
        code: codeExtractInCode(code),
        prompt: promptExtractInCode(code) || null,
      };
      setCode(null);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();

      setCode(ResultFormatter(result["result"]));
      setLoading(false);
    } catch (error) {
      let errorMessage = error.message || "Unknown error";
      let status = null;
      if (error instanceof Error) {
        status = parseInt(error.message.split(" ")[3], 10) || null;
      }
      console.error("API Error:", errorMessage, "Status:", status);
      setLoading(false);
    }
  };

  const handleAICallClick = () => {
    setLoading(true);
    handleAICall({ code });
  };

  return (
    <div className="h-screen w-full bg-blue-400">
      <div className="flex flex-row bg-blue-400">
        <div className="px-4 py-2">
          <LanguagesDropdown onSelectChange={onSelectChange} />
        </div>
        <div className="px-4 py-2">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-6 bg-blue-400">
        {
          <div className="flex flex-col w-full h-full justify-start items-end flex items-center justify-center">
            <h1 className="font-bold text-xl flex items-center justify-center bg-clip-text text-white bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
              Code Window
            </h1>
            {code && (
              <CodeEditorWindow
                code={code ? code : ""}
                onChange={onChange}
                language={language?.value}
                theme={theme.value}
              />
            )}
            {!loading ? (
              <div className="flex items-center justify-center py-2">
                <button
                  onClick={handleAICallClick}
                  className={classnames(
                    "border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                    !code ? "opacity-50" : ""
                  )}
                >
                  Get AI Help
                </button>
              </div>
            ) : (
              <div className=" flex items-center justify-center py-4">
                <div className="w-full h-full flex items-center justify-center shadow-4xl">
                  <Loader></Loader>
                </div>
              </div>
            )}
          </div>
        }

        <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
            <CustomInput
              customInput={customInput}
              setCustomInput={setCustomInput}
            />
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing
                ? "Processing..."
                : error
                ? "Error"
                : "Compile and Execute"}
            </button>
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
        </div>
      </div>
      {/* <div className="bg-blue-400">
        <Footer />
      </div> */}
    </div>
  );
};

export default Landing;
