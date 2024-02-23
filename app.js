var interval;
var ctx = document.getElementById("canvas").getContext("2d");

function GameObject(x, y, img) {
  this.x = x;
  this.y = y;
  this.img = img;
  this.active = true;
}

GameObject.prototype.draw = function (ctx) {
  this.active && ctx.drawImage(this.img, this.x, this.y, 40, 40);
};
GameObject.prototype.move = function (dx, dy) {
  this.x += dx;
  this.y += dy;
};

GameObject.prototype.fire = function (dy) {
  return new Shot(this.x + 20, this.y + 20, dy);
};

GameObject.prototype.isHitby = function (shot) {
  function between(x, a, b) {
    return a < x && x < b;
  }
  return (
    this.active &&
    between(shot.x, this.x, this.x + 40) &&
    between(shot.y + 10, this.y, this.y + 20)
  );
};

function Shot(x, y, dy) {
  this.x = x;
  this.y = y;
  this.dy = dy;
}

Shot.prototype.move = function () {
  this.y += this.dy;
  return this.y > 0 && this.y < 800;
};
Shot.prototype.draw = function (ctx) {
  ctx.fillStyle = "#000";
  ctx.fillRect(this.x - 1, this.y, 3, 20);
};

var invaderDx = -5;
var invaders = [];
var cannon = new GameObject(230, 750, document.getElementById("cannon"));
var invaderShot, cannonShot;

function init() {
  var img = document.getElementById("invader");
  for (let y = 0; y < 7; y++) {
    for (let x = 0; x < 7; x++) {
      invaders.push(new GameObject(50 + x * 50, 20 + y * 50, img));
    }
  }
}
function draw() {
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, 500, 800);
  invaders.forEach((inv) => inv.draw(ctx));
  cannon.draw(ctx);

  invaderShot && invaderShot.draw(ctx);
  cannonShot && cannonShot.draw(ctx);
}

function move() {
  var leftX = invaders[0].x;
  var rightX = invaders[invaders.length - 1].x;

  if (leftX <= 20 || rightX >= 440) invaderDx = -invaderDx;
  invaders.forEach((inv) => inv.move(invaderDx, 0.5));

  if (invaderShot && !invaderShot.move()) {
    invaderShot = null;
  }
  if (!invaderShot) {
    var active = invaders.filter((i) => i.active);
    var r = active[Math.floor(Math.random() * active.length)];
    invaderShot = r.fire(20);
  }
  if (cannonShot) {
    var hit = invaders.find((inv) => inv.isHitby(cannonShot));
    if (hit) {
      hit.active = false;
      cannonShot = null;
    } else {
      if (!cannonShot.move()) cannonShot = null;
    }
  }
}

function isGameOver() {
  return (
    cannon.isHitby(invaderShot) ||
    invaders.find((inv) => inv.active && inv.y > 730)
  );
}

function game() {
  move();
  draw();
  if (isGameOver()) {
    alert("Game Over");
    clearInterval(interval);
  }
}
function start() {
  init();
  document.addEventListener("keydown", function (e) {
    if (e.keyCode === 37 && cannon.x > 40) cannon.move(-20, 0);
    if (e.keyCode === 39 && cannon.x < 420) cannon.move(20, 0);
    if (e.keyCode === 32 && !cannonShot) cannonShot = cannon.fire(-30);
  });
  interval = setInterval(game, 50);
}

window.onload = start;

console.log("Все работает... нет");
