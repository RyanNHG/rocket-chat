module.exports = ({SECRET, users}) => (req, res, next) => {
  console.log(req.signedCookies)
  next()
}