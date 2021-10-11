//@desc Logs request to console
const logger = (req, res, next) => {
  req.hello = "Hello World";
  //HDP request
  console.log(
    `${req.method} ${req.protocol}: //${req.get("host")}${req.originalUrl}`
  );
  next();
};

module.exports = logger;
