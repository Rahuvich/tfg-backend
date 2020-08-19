exports.escapeRegex = (text) => {
  if (!text) return text;
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
