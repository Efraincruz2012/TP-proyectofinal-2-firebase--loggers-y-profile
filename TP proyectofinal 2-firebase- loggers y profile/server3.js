const express = require('express')
const app = express()
const port = 8084

app.get('/', (req, res) => {
  res.send('Servidor 3! en puerto 8084')
})

app.listen(port, () => {
  console.log(`App escuchando en http://localhost:${port}`)
})