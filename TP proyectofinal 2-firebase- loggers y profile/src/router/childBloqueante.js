
console.log('prueba de un hilo fork bloqueante');

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

const randoms = [];
for(let i = 0; i < 500000000; i++){
    randoms.push(getRandomArbitrary(1, 1001))
}


