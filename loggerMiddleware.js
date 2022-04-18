const logger = (req, res, next) => {
  console.log(req.body);
  res.status(200);
  console.log("Pasó por el middleware");
  next();
};
module.exports = logger;
