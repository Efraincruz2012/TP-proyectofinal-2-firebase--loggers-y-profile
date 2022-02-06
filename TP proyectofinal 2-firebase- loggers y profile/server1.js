const express = require('express')
const app = express()
const port = 8082

app.get('/', (req, res) => {
  res.send('Servidor 1!!!! en puerto 8082')
})

app.listen(port, () => {
  console.log(`App escuchando en http://localhost:${port}`)
})