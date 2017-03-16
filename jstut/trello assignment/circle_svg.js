var svgNS = "http://www.w3.org/2000/svg";  
var rect = document.getElementById("mySVG").getBoundingClientRect();
var obs = [];
var num = 0;
var docClick=true;

function editPage(event){
	var xpos = event.clientX; var ypos = event.clientY;
	xpos = xpos - rect.left; ypos = ypos - rect.top;
	var idStr = "id"+" "+ num.toString();
	num = num+1;

	checkCircle(xpos,ypos);
	
	if(docClick){
		var myCircle = document.createElementNS(svgNS,"circle");
		myCircle.setAttributeNS(null,"id",idStr);
		myCircle.setAttributeNS(null,"cx",xpos);
		myCircle.setAttributeNS(null,"cy",ypos);
		myCircle.setAttributeNS(null,"r",10);
		myCircle.setAttributeNS(null,"fill","black");
		myCircle.setAttributeNS(null,"stroke","none");

		document.getElementById("mySVG").appendChild(myCircle);
		obs.push(
			{
				"id":idStr,
				"x":xpos,
				"y":ypos
			}
		);
	}

	reCircum();
	docClick=true;
}

function checkCircle(xpos,ypos){
	for(var i=0; i<obs.length; i++){

		console.log((obs[i].x-5)+" "+(obs[i].y-5));

		if(((obs[i].x-5)<=xpos)&&(xpos<=(obs[i].x+5)) && ((obs[i].y-5)<=ypos)&&(ypos<=(obs[i].y+5))){
			console.log(obs[i].id);
			var idStr = obs[i].id;
			var elem = document.getElementById(idStr);
			elem.parentNode.removeChild(elem);

			remElem(idStr);//removing element with a particular id in object array

			docClick = false;
			return;
		}
	}
}

function remElem(idStr){
	for(var i=0; i<obs.length; i++){
		if(obs[i].id === idStr){
			obs.splice(i,1);
			console.log(obs.length);
			return
		}
	}
}

function reCircum(){

	var out = document.getElementById("outerCircle");
	if(out != null){
		out.parentNode.removeChild(out);
	}

	var xcen=0;var ycen=0;
	console.log(xcen+" "+ ycen);
	

	var xmax=0; var ymax =0; var xmin=2000; var ymin=2000;
	var xtemp,ytemp;

	for(var j=0; j<obs.length; j++){
		xtemp = parseInt(obs[j].x);
		ytemp = parseInt(obs[j].y);

		if(xmin>xtemp){xmin=xtemp;}
		if(xmax<xtemp){xmax=xtemp;}

		if(ymin>ytemp){ymin=ytemp;}
		if(ymax<ytemp){ymax=ytemp;}
	}

	xcen = (xmax+xmin)/2; ycen = (ymax+ymin)/2;

	var rad = 0;
	
	rad = Math.sqrt(Math.pow((xcen-xmin),2)+Math.pow((ycen-ymin),2));

	var myOuterCircle = document.createElementNS(svgNS,"circle");
	myOuterCircle.setAttributeNS(null,"id","outerCircle");
	myOuterCircle.setAttributeNS(null,"cx",xcen);
	myOuterCircle.setAttributeNS(null,"cy",ycen);
	myOuterCircle.setAttributeNS(null,"r",rad);
	myOuterCircle.setAttributeNS(null,"fill","none");
	myOuterCircle.setAttributeNS(null,"stroke","black");

	document.getElementById("mySVG").appendChild(myOuterCircle);

	document.getElementById("outerCircle").addEventListener("click",function(){
		alert("Clicked on outer circle");
	});

}

document.addEventListener("click",editPage);