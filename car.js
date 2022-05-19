class Car {
  constructor(x, y, width, height, controlType, maxSpeed = 3) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;
    this.damaged = false;

    if (controlType != "DUMMY") {
      this.sensor = new Sensor(this);
    }

    this.controls = new Controls(controlType);
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    if (this.sensor) this.sensor.update(roadBorders, traffic);
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }
    return false;
  }

  #createPolygon() {
    const points = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
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
  draw(context, color) {
    if (this.damaged) {
      context.fillStyle = "gray";
    } else {
      context.fillStyle = color;
    }
    context.beginPath();
    context.moveTo(this.polygon[0].x, this.polygon[0].y);
    for (let i = 1; i < this.polygon.length; i++) {
      context.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    context.fill();
    if (this.sensor) this.sensor.draw(context);
  }
}
