export const ResultFormatter = (result) => {
  return result.replace(/```python/g, "").replace(/```/g, "");
};
