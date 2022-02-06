const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
  res.send('Servidor Individual! en 8080')
})

app.listen(port, () => {
  console.log(`App escuchando en http://localhost:${port}`)
})