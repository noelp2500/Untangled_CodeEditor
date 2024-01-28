export const promptExtractInCode = (code) => {
  const pattern = /-->\s*(.*?)\s*<--/;
  const match = code.match(pattern);

  if (match) {
    const result = match[1].trim();
    return result;
  } else {
    return null;
  }
};

export const codeExtractInCode = (code) => {
  const pattern = /-->\s*(.*?)\s*<--/;
  return code.replace(pattern, "");
};
