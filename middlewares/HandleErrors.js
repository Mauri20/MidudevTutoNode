module.exports = (error, req, res, next) => {
  console.log(error.name);
  console.log(req.path);
  if (error.name === "CastError") {
    res.status(400).end();
  } else {
    res.status(500).json({
      error: "Error interno",
    });
  }
};
