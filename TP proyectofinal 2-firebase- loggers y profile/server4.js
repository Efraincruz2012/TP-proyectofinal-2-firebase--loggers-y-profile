const express = require('express')
const app = express()
const port = 8085

app.get('/', (req, res) => {
  res.send('Servidor 4! en puerto 8085')
})

app.listen(port, () => {
  console.log(`App escuchando en http://localhost:${port}`)
})