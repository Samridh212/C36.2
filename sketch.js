var Dog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState,readState;
var bedroomImg, gardenImg,washroomImg,dogImg,dogImg2;
function preload(){
dogImg=loadImage(".images/dogImg.png");
dogImg2=loadImage(".images/dogImg1.png");
bedroomImg = loadImage(".images/Bed Room.png")
gardenImg = loadImage(".images/Garden.png")
washroomImg = loadImage(".images/Wash Room.png")
sadDogImg = loadImage(".images/dogImg")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  Dog=createSprite(800,200,150,150);
  Dog.addImage(dogImg);
  Dog.scale=0.15;
  
  feed=createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState = database.ref('gameState');
  readState.on("value",function(data){
  gameState=data.val();

  });

}

function draw() {
  background(46,139,87);
  foodObj.display();
  if(currentTime==(lastFed+1)){
    update("Playing");
    foodObj.garden();
  }else if(currentTime===(lastFed+2)){
   update("Sleeping")
    foodObj.bedroom();
  }
   else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
      update("Bathing");
        foodObj.washroom();
  }else {
    update("Hungry")
     foodObj.display();
  }
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }
 
  drawSprites();
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    Dog.hide();
  }else{
   feed.show();
   addFood.show();
   dogImg.addImage(dogImg)
  }
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  Dog.addImage(dogImg2);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}