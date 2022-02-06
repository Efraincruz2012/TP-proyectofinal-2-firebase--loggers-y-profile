const express = require('express')
const compression = require('compression')
const winston = require('winston');
const path = require('path')
const cluster = require('cluster')
require('dotenv').config()

const appDir = path.dirname(require.main.filename);

const yargs = require('yargs/yargs')(process.argv.slice(2))

const argumentosEntrada = yargs
.boolean('debug')
.alias({
  p: 'puerto',
  f: 'FORK',
  c: 'CLUSTER'
})
.default({
  puerto: 8080,
  FORK: 'on',
  CLUSTER: 'off', 
}).argv;

const { routerProducto } = require("./src/router/producto")
 
const { routerCarrito } = require("./src/router/carrito")

const { routerRandoms } = require("./src/router/randoms")

 
const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.set('views', path.join(__dirname, './src/views'))
app.set('view engine', 'ejs');

const ControladorProducto = require('./Daos/ControladorDaoProducto');
const ControladorCarrito = require('./Daos/ControladorDaoCarrito');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'warn.log', level: 'warning' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({ level: 'info' }),
    new winston.transports.Console({ level: 'warn' }),
    new winston.transports.Console({ level: 'error' }),
  ],
});

const loggerBase = req => {
  const { originalUrl, method } = req;
  logger.info(`Route: ${originalUrl} Method: ${method}`);
}

const loggerError = error => {
  logger.error(`Error: ${error}`);
}

const loggerWarning = warning => {
  logger.warn(`${warning}`);
}

app.get('/', async (req, res) => {
    loggerBase(req)
    try {
      const productos = await new ControladorProducto().listarAll();
      const carritos = await new ControladorCarrito().listarAll();
      res.render('index', { productos, carritos } );
    } catch (error) {
      loggerError(error);
    }
});





const infoCallback = (res, consolePrint) => {

  const testCompression = 'testCompression...'
  const longString = testCompression.repeat(10000)

  const resultado = {
    "argumentosEntrada": Object.keys(argumentosEntrada).length,
    "NombrePlataforma": process.platform, 
    "VersionNode": process.version, 
    "MemoriaTotalReservada": process.memoryUsage().rss, 
    "PathDeEjecucion": process.execPath, 
    "ProcessId": process.pid, 
    "CarpetaProyecto": appDir,
    "longString": longString
  };
  if (consolePrint) {
    console.log(resultado);
  }

  res.render('info',{resultado, nroProcesadores: require('os').cpus().length });

}

/* Ruta Info */
app.get('/info', async (req, res) => {
  loggerBase(req)
  infoCallback(res, false);

});

app.get('/infozip', compression(), async (req, res) => {
  loggerBase(req)
  infoCallback(res, true);
  
});



/* ------------------------------------------------------ */
/* Cargo los routers */

const withLogger = (req, res, next) => {
  req.logger = logger;
  req.loggerBase = loggerBase;
  req.loggerError = loggerError;
  req.loggerWarning = loggerWarning;
  next();
}

app.use('/api/productos', withLogger, routerProducto)
 
app.use('/api/carrito', withLogger, routerCarrito)

app.use('/api/randoms', withLogger, routerRandoms)

app.use(function(req, res) {
  // Invalid request
  const { originalUrl, method } = req
  loggerWarning(`Ruta ${method} ${originalUrl} no implementada`);
});

/* ------------------------------------------------------ */
/* Server Listen */

const { puerto, CLUSTER } = argumentosEntrada; 

if(CLUSTER.toLowerCase() === 'on'){
  // modo cluster
  const server = app.listen(puerto, () => {
    console.log(`Servidor escuchando en el puerto ${server.address().port} modo CLUSTER`)
  })
  server.on('error', error => console.log(`Error en servidor ${error}`))
  
  
} else {
  // modo fork

    if (cluster.isPrimary) {

      const numCPUs = require('os').cpus().length;

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
        console.log('creando una instancia nueva...')
      }
    
      cluster.on('exit', worker => {
        console.log(
          'Worker',
          worker.process.pid,
          'died',
          new Date().toLocaleString()
        )
        cluster.fork()
      })

    } else {

      const server = app.listen(puerto, () => {
        console.log(`Servidor escuchando en el puerto ${server.address().port} - PID WORKER ${process.pid}`)
      })
      server.on('error', error => console.log(`Error en servidor ${error}`))

    }

}



if (process.env.DB){
    console.log('Variable de entorno cargada: ', process.env.DB)    
}
