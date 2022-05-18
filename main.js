const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const context = canvas.getContext("2d"); /* per disegnare nella canvas ci serve
                                            un drawing context*/

const car = new Car(100, 100, 30, 50);
car.draw(context);

//animations
animate();

function animate() {
  car.update();
  canvas.height = window.innerHeight;
  car.draw(context);
  requestAnimationFrame(animate); // richiama la funzione animate e fa si che la macchina si muovi
}
