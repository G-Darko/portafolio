	

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