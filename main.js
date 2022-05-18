const canvas = document.getElementById("myCanvas");
canvas.width = 200;

const context = canvas.getContext("2d"); /* per disegnare nella canvas ci serve
                                            un drawing context*/
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);

//animations
animate();

function animate() {
  car.update(road.borders);
  canvas.height = window.innerHeight;

  //following camera
  context.save();
  context.translate(0, -car.y + canvas.height * 0.7); //position the car in the center

  road.draw(context);
  car.draw(context);

  context.restore();
  requestAnimationFrame(animate); // richiama la funzione animate e fa si che la macchina si muovi
}
