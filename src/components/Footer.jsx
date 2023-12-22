import React from "react";

const Footer = () => {
  return (
    <div className="fixed h-8 bottom-0 px-2 py-1 flex items-center justify-center w-full text-xs text-gray-500">
      <span>
        Built by{" "}
        <a
          href="https://noel-vs-code-resume-public-version-pereiranoel1225-gmailcom.vercel.app/#/"
          target="__blank"
          className="text-gray-700  hover:bg-blue-500 hover:text-white font-medium"
        >
          Noel Pereira.{" "}
        </a>
        Code can be found at my{" "}
        <a
          href="https://github.com/noelp2500"
          target="__blank"
          className="text-gray-700  hover:bg-blue-500 hover:text-white font-medium"
        >
          GitHub.{" "}
        </a>
      </span>
    </div>
  );
};

export default Footer;
