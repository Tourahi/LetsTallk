const generateMsg = (txt,name) => {
  return {
    txt,
    name,
    createdAt : new Date().getTime()
  };
};

module.exports = {
  generateMsg
};
