const express = require('express')
const app = express()
const cluster = require('cluster');
const port = 8081

app.get('/', (req, res) => {
  res.send('Servidor MODO CLUSTER! en puerto 8083 y process id: '+ process.pid)
})


if (cluster.isWorker) {
  console.log('Proceso worker');
  app.listen(port, () => {
    console.log(`App escuchando en http://localhost:${port}`)
  })
} else {
  console.log('Proceso maestro');
  const numCPUs = require('os').cpus().length;

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork()
    console.log('creando una instancia nueva...')
  }
}