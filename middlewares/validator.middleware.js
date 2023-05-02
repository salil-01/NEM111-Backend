const validator = (req, res, next) => {
  let data = req.body;
  if (
    data.device == "PC" ||
    data.device == "MOBILE" ||
    data.device == "TABLET"
  ) {
    next();
  } else {
    res.status(200).send({ msg: "Please provide correct Device Name" });
  }
};
module.exports = { validator };
