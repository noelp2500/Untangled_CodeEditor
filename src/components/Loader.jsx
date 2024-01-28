import React from "react";
import { dotStream } from "ldrs";

const Loader = () => {
  dotStream.register();
  return <l-dot-stream size="200" speed="1.0" color="white"></l-dot-stream>;
};

export default Loader;
