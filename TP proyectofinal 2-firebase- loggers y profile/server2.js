const express = require('express')
const app = express()
const port = 8083

app.get('/', (req, res) => {
  res.send('Servidor 2! en puerto 8083')
})

app.listen(port, () => {
  console.log(`App escuchando en http://localhost:${port}`)
})