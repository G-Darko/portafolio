	function solveEquation(u) {
      let procedure = [];

      const y = Math.pow(u, u / (u - 1));
      const x = Math.pow(u, 1 / (u - 1));

      let uM1 = u-1;
      let r;
      let sr;
      let uPot = Math.pow(u, u);

      if (uM1 > 2) {
        r = uM1;
      }else{
        r = "";
      }

      if (uM1 >= 2) {
        sr = '√';
      }else{
        sr = '';
      }

      if (uM1 == 1) {

      }

      procedure.push(`Calcular y utilizando la fórmula: y = u<sup><sup>u</sup>/<sub>(u-1)</sub></sup>`);
      procedure.push(`   y = ${u}<sup><sup>${u}</sup>/<sub>${u}-1</sub></sup>`);
      procedure.push(`   y = ${u}<sup><sup>${u}</sup>/<sub>${uM1}</sub></sup>`);
      procedure.push(`   y = <sup>${r}</sup>${sr}${uPot}`);
      if (uM1 != 1) {
      	procedure.push(`   y = ${u}<sup>${r}</sup>${sr}${u}`);
      }

      procedure.push(`Calcular x utilizando la fórmula: x = u<sup><sup>1</sup>/<sub>(u-1)</sub></sup>`);
      procedure.push(`   x = ${u}<sup><sup>1</sup>/<sub>${uM1}</sub></sup>`);
      procedure.push(`   x = <sup>${r}</sup>${sr}${u}`);
      let xr = `<sup>${r}</sup>${sr}${u}`;
      let yr = `${u}<sup>${r}</sup>${sr}${u}`;
      procedure.push(`Sustituir en x <sup>y</sup> = y <sup>x</sup>`);
      if (uM1 != 1) {
      	procedure.push(`${xr} <sup>${yr}</sup> = ${yr} <sup>${xr}</sup>`);
      }else{
      	procedure.push(`${xr} <sup>${uPot}</sup> = ${uPot} <sup>${xr}</sup>`);
      }
      return { x, y, procedure, u, xr, yr };
    }
    calculate();
  	function calculate(){
	    let uIn = document.getElementById('u').value;
	    const u = uIn;
	    const result = solveEquation(u);

	    const procedimientoElement = document.getElementById("procedimiento");
	    procedimientoElement.innerHTML = '';

	    let procedimientoHTML = `<h1>Resultado de la ecuación</h1><h1>Procedimiento cuando u = ${result.u}:</h1>`;
	    result.procedure.forEach((step, index) => {
	      procedimientoHTML += `<p>${index + 1}. ${step}</p>`;
	    });
	    procedimientoElement.innerHTML += procedimientoHTML;

	    let resultadoHTML = `<h1>Resultado cuando u = ${result.u} en decimal:</h1>`;
	    resultadoHTML += `<p>x = ${result.x}</p>`;
	    resultadoHTML += `<p>y = ${result.y}</p>`;
	    procedimientoElement.innerHTML += resultadoHTML;
  	}

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