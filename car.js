class Car {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;

    this.controls = new Controls();
  }

  update() {
    this.#move();
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }

    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      //can't surpass maxSpeed limit
      this.speed = this.maxSpeed;
    }

    if (this.speed < -this.maxSpeed / 2) {
      //can't surpass maxSpeed limit but when going backwards
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      //speed is slowed by the friction
      this.speed -= this.friction;
    }

    if (this.speed < 0) {
      //speed is increased by the friction
      this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      //the car stops
      this.speed = 0;
    }

    if (this.speed != 0) {
      //if the car is still, it won't turn right or left
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed; //moves the car
    this.y -= Math.cos(this.angle) * this.speed;
  }
  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.rotate(-this.angle);
    context.beginPath(); //da chiamare all'inizio di ogni nuova linea
    context.rect(
      //creating a rectangle for the car
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    context.fill();
    context.restore();
  }
}
