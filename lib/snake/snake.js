


//-------------------------------initialize----------------------------

var ht = 16; //height
var wh = 24; //width
var sz = 30; //pixel size

var reg_wh = wh;
var reg_ht = ht;

var extendLength = 3; // amount snake body will extend after eat

var cnt = 1; //key limit
var clickBool= false;

var fstate = "NO";
var state = "START";

var sn = 
{
  vx: 0,
  vy: 0,
  bod: [{x: ht/2, y: wh/2}],
  len: 0
};

var food = 
{
  x: 0,
  y: 0
};

function dr(x,y) {
 
  rect(x,y,sz,sz);
}



//------------------------------events and listeners--------------------

function mouseClicked()
{
  if((mouseX >= 0 && mouseX <= wh*sz && mouseY >=0 && mouseY <=ht*sz ) && clickBool === false) 
  {
    clickBool = true;
  }
  else if((mouseX <= 0 || mouseX >= wh*sz || mouseY <=0 || mouseY >=ht*sz ) && clickBool === true)
  {
    clickBool = false;
  }

  if((state === "START")&& clickBool === true)
  {
    sn.len = 0;
    sn.bod[0].x = wh/2;
    sn.bod[0].y = ht/2;
    sn.vx = 0;
    sn.vy = 0;
    state = "ON";
  }

  else if((state === "OFF" || state === "ON") && clickBool === false)
  {
    state = "IDLE";
  }

  else if(state === "IDLE" && clickBool === true)
  {
    state = "OFF";
  }
}

function keyPressed()
{
  if(clickBool)
  {
    if(cnt === 1 && state === "ON")
    {
      if(keyCode === UP_ARROW && sn.vy === 0)
      {
          sn.vx = 0; 
          sn.vy = -1;
          cnt = 0;
      }
      else if(keyCode === DOWN_ARROW && sn.vy === 0)
      {
          sn.vx = 0; 
          sn.vy = 1;
          cnt = 0;
      }  
      else if(keyCode === LEFT_ARROW && sn.vx === 0)
      {
          sn.vx = -1; 
          sn.vy = 0;
          cnt = 0;
      }   
      else if(keyCode === RIGHT_ARROW && sn.vx === 0)
      { 
          sn.vx = 1;
          sn.vy = 0;
          cnt = 0;
      } 
    }

    else if(state === "OFF" && keyCode == 32)
    {
      sn.len = 0;
      sn.bod[0].x = wh/2;
      sn.bod[0].y = ht/2;
      sn.vx = 0;
      sn.vy = 0;
      state = "ON";
    }
  }
}

window.addEventListener("keydown", function(e) {
  // space and arrow keys
  if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) && clickBool === true) {
      e.preventDefault();
  }
}, false);



//------------------------------functions----------------------------

function foodGenerate()
{ 
  if(fstate === "NO")                 
  {
    food.x = Math.round(random(wh-1));
    food.y = Math.round(random(ht-1));
    fstate = "YES";
  }

}

function eat()
{
  if(fstate === "YES")
  {
    if(sn.bod[0].x === food.x && sn.bod[0].y === food.y)
    {
      extend(extendLength); 
      fstate = "NO";
    }
  }
}

function extend(length)
{
  var i;
  for(i=0;i<length;i++)
  {
    sn.len++;
    addBody();     
  }
}

function limit()
{
  if(sn.bod[0].x <0)state = "OFF";         //limit
  else if(sn.bod[0].y < 0)state = "OFF";
  else if(sn.bod[0].x > wh-1)state = "OFF";
  else if(sn.bod[0].y > ht-1)state = "OFF";
}

function newPos()
{
  sn.bod[0].x = (sn.bod[0].x + sn.vx) // new pos
  sn.bod[0].y = (sn.bod[0].y + sn.vy)
}

function death()
{
  var n;
  for(n=1;n<=sn.len;n++)
  {
    if(sn.bod[0].x === sn.bod[n].x && sn.bod[0].y === sn.bod[n].y)
    {
      state = "OFF";
    }
  }
}

function addBody()
{
  sn.bod[sn.len] = {x: (sn.bod[sn.len-1].x), y: (sn.bod[sn.len-1].y)}; 
}



function update()
{
  cnt = 1;// cant input

  foodGenerate();

  newPos();


  limit();

  death();

  fill(79,201,17);
  dr(food.x*sz,food.y*sz);

  var i;
  for(i=sn.len;i>=0;i--)
  {
    fill(255);
    dr(((sn.bod[i]).x)*sz,((sn.bod[i]).y)*sz);

    if(i>0)
    {
      (sn.bod[i]).x = (sn.bod[i-1]).x;
      (sn.bod[i]).y = (sn.bod[i-1]).y;
    }
  }
  
  eat();
}



//--------------------------------setup and draw----------------------------      

function setup() {
  frameRate(10);
  var newCanvas = createCanvas(wh*sz,ht*sz);
  newCanvas.parent("snakeCanvas");
}
 

function draw() {
  background(0);

  if(state === "START")
  {
    textSize(36);
    textAlign(CENTER,CENTER);
    fill(255);
    text('WELCOME TO\nSNAKE\n \nClick to start!\n\n by: Brian Chiu',windowWidth/6+wh*sz/5 ,ht*sz/2);
  }

  else if(state === "ON")
  {
    update();
  }
  
  else if(state === "OFF")
  {
    textSize(36);
    textAlign(CENTER,CENTER);
    fill(255);
    text('GAME OVER\n\n Your score is: ' + windowWidth + '\n Hit "Space" to restart!',windowWidth/6+wh*sz/5,ht*sz/2);
  }

  else if(state === "IDLE")
  {

    textSize(36);
    textAlign(CENTER,CENTER);
    fill(255);
    text('Oops you clicked out of the window\n\nClick back in to continue!',windowWidth/6+wh*sz/5,ht*sz/2);

  }
}

function windowResized() {
  resizeCanvas(wh*sz, ht*sz);
}