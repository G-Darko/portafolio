const year = document.getElementById("year");
const date = new Date();
const thisYear = date.getFullYear();

year.innerText = thisYear;

function showModal(id){
	document.getElementById(id).style.opacity=1;
	document.getElementById(id).style.visibility="visible";
	document.getElementById(id).classList.add('open');
}
function hideModal(id){
	document.getElementById(id).style.opacity=0;
	document.getElementById(id).style.visibility="hidden";
	document.getElementById(id).classList.remove('open');
}

function responsive(){
	let nav = document.getElementById('nav');
	nav.classList.toggle('responsive');
}

function selected(link){
	let opcion = document.querySelectorAll('#nav a');	
	opcion[0].className = "";
	opcion[1].className = "";
	opcion[2].className = "";

	link.className = "selected";

	let nav = document.getElementById('nav');
	nav.className = "";
}