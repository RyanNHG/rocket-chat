module.exports = (users) => (req, res) => {
  const body = req.body

  console.log(body)

  res.json({
    error: true,
    message: 'Not yet implemented',
    data: []
  })
}