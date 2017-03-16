//console.log("Circle javascript is loaded");

var canvas = document.getElementById("cvs");
var context = canvas.getContext("2d");
var rect = canvas.getBoundingClientRect();

function printCordinates(event){
	xpos = event.clientX-rect.left; ypos = event.clientY-rect.top;
	console.log(xpos+","+ypos);
	console.log("--->"+rect.left+","+rect.top);
	context.fillStyle = "#000";
	context.beginPath();
	context.arc(xpos,ypos,10,0,2*Math.PI);
	context.fill();
	
}


document.addEventListener("click",printCordinates);