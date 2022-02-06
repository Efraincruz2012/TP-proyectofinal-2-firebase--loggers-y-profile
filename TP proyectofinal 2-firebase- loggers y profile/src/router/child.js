
console.log('prueba de un hilo fork');

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

process.on("message", function (message) {

  const randoms = [];
  for(let i = 0; i < parseInt(message); i++){
      randoms.push(getRandomArbitrary(1, 1001))
  }

  const reducer = (resultado, item) => {
      if (resultado[item]){
          resultado[item]++;
      } else {
          resultado[item] = 1;
      }
      return resultado;
  };

  const resultado = randoms.reduce(reducer, {});

  process.send(JSON.stringify(resultado));

});






