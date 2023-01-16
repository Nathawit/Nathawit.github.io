document.getElementById("Approach").addEventListener("click", Approach);
document.getElementById("CalculateFever").addEventListener("click", CalculateFever);
document.getElementById("CalculateRash").addEventListener("click", CalculateRash);
document.getElementById("CalculateDyspnea").addEventListener("click", CalculateDyspnea);
document.getElementById("CalculateHypo").addEventListener("click", CalculateHypo);
document.getElementById("Reset").addEventListener("click", PageReset);

document.getElementById("Dyspnea").addEventListener("click", ShowSat);
document.getElementById("Hypotension").addEventListener("click", ShowSat);
document.getElementById("Fever_NAHTRy").addEventListener("click", ShowDAT);
document.getElementById("Fever_NAHTRn").addEventListener("click", ShowDAT);

document.getElementById("Hypotension").addEventListener("change", ShowHypo);
document.getElementById("Recov").addEventListener("change", function(){if(Recov.checked){SatDrop.disabled = true;}else{SatDrop.disabled = false;}});
document.getElementById("SatDrop").addEventListener("change", function(){if(SatDrop.checked){Recov.disabled = true;}else{Recov.disabled = false;}});

var Diagnosis = ""
var Confidence = ""
var Severity = ""
var Duration = 0

/************************ Approach *********************************/

function Approach() {
	PageReset();
	Duration = document.getElementById("Duration").value;
	if(Dyspnea.checked && Hypotension.checked) {
		if(SatDrop.checked) page_Dyspnea.style.display = 'block';
		else page_Hypotension.style.display = 'block';
	}
	else if(Dyspnea.checked && Fever.checked) {
		if(SatDrop.checked) page_Dyspnea.style.display = 'block';
		else page_Fever.style.display = 'block';
	}
	else if(Dyspnea.checked) page_Dyspnea.style.display = 'block';
	else if(Fever.checked) page_Fever.style.display = 'block';
	else if(Hypotension.checked) {
		if(Duration>4){page_Fever.style.display = 'block';}
		else {page_Hypotension.style.display = 'block'; page_Fever.style.display = 'block';}
		}
	else if(Rash.checked) {
		if(Duration<=4) page_Hypotension.style.display = 'block';
	}
	
	
}	

function ShowHypo(){
	Duration = document.getElementById("Duration").value;
	if(Duration<1 && Hypotension.checked){lbRecov.style.display = 'block'}
	else {
		lbRecov.style.display = 'none';
		Recov.checked = false;SatDrop.disabled = false;Recov.disabled = false
	}
}
function ShowSat() {
	if(Dyspnea.checked && (Hypotension.checked || Fever.checked)) {
		lbSatDrop.style.display = 'block';
	} else {
		lbSatDrop.style.display = 'none';
		SatDrop.checked = false;
	}
}

/************************ FEVER *********************************/

var AHTR = document.querySelectorAll('input[name^="Fever_AHTR"]');
AHTR.forEach(checkbox => {
	checkbox.addEventListener("change", ShowAHTR);
});

function ShowAHTR() {
	var b = false;
	for (var i = 0; i < AHTR.length; i++) {
		if(AHTR[i].checked) { b = true; break; }
	}
	if(b) {
		lbFever_NAHTR.style.display = 'block';
	} else {
		lbFever_NAHTR.style.display = 'none';
		Fever_NAHTRy.checked = false;
		Fever_NAHTRn.checked = false;
		clear_ABO_DAT();
	}
}

function ShowDAT() {
	if(Fever_NAHTRn.checked) {
		lbFever_ABO.style.display = 'block';
		lbFever_DAT.style.display = 'block';
	} else {
		clear_ABO_DAT();
	}
}

function clear_ABO_DAT() {
	lbFever_ABO.style.display = 'none';
	lbFever_DAT.style.display = 'none';
	Fever_ABOy.checked = false;
	Fever_ABOn.checked = false;
	Fever_DATy.checked = false;
	Fever_DATn.checked = false;
}

function CalculateFever() {
	var AHTRc = 0;
	
	//count Hemolysis evidence
	for(var i = 0; i < AHTR.length; i++) if (AHTR[i].checked) AHTRc++;
	
	if(AHTRc >= 1 && Duration < 24) { 
		if(Fever_NAHTRy.checked) { Diagnosis = "NiAHTR"; Confidence = "Definite"; }
		else if(Fever_NAHTRn.checked) {
			Diagnosis = "iAHTR";
			if(Fever_ABOy.checked || Fever_DATy.checked) Confidence = "Definite";
			else Confidence = "Probable";
		}
	} else {
		if(Duration < 4 && Hypotension.checked) {Diagnosis = "TTI if evidence C/S positive";Comment ="Please consider C/S, if positive likely TTI";}
	else if (Duration < 4) {Diagnosis = "FNHTR or TTI"; Comment ="Please consider C/S, if positive likely TTI";}
		else Diagnosis = "FNHTR & AHTR & TTI are not likely";
	}
	
	page_Result.style.display = 'block';
	document.getElementById("Diagnosis").innerHTML = Diagnosis;
	document.getElementById("Confidence").innerHTML = Confidence;
	document.getElementById("Comment").innerHTML = Comment;
}


/************************* RASH *********************************/

function CalculateRash() {

	var Allergy = document.querySelectorAll('input[name^="Allergic"]');
	var AllergyC = 0
	
	for (var i = 0; i < Allergy.length; i++) {
		if (Allergy[i].checked && Allergy[i].value == 'yes') {
			AllergyC++;
		}
	}

	if ((AllergyC >= 2) && (Duration <= 2)) {
		Diagnosis = "Allergic Reaction";
		Confidence = "Definite";
	}
	else if ((AllergyC >= 1) && (Duration <= 4)) {
		Diagnosis = "Allergic Reaction";
		Confidence = "Probable";
	} else {
		Diagnosis = "Allergic reaction is not likely";
	}
	
	page_Result.style.display = 'block';
	document.getElementById("Diagnosis").innerHTML = Diagnosis;
	document.getElementById("Confidence").innerHTML = Confidence;

}

/************************* Dyspnea *********************************/

function CalculateDyspnea() {
	
	if(Dys_Q1.checked && Duration < 12) {
		if(Dys_Q2.checked || Dys_Q3.checked) {Diagnosis="TACO"}
		else{Diagnosis="TRALI"}
	}
	else if(Duration < 24) {Diagnosis = "TAD"}
	else{Diagnosis="Others"}
	
	if(Dys_Sev1.checked){Severity="Non-Severe"}
	else if(Dys_Sev2.checked){Severity="Severe"}
	else if(Dys_Sev3.checked){Severity="Life-Threatening"}
	
	page_Result.style.display = 'block';
	document.getElementById("Diagnosis").innerHTML = Diagnosis;
	document.getElementById("Confidence").innerHTML = Confidence;
	document.getElementById("Comment").innerHTML = Severity;
}

/************************ Hypotension ****************************/

var SkinM = document.querySelectorAll('input[name^="Hypo_Skin"]');
SkinM.forEach(checkbox => {
	checkbox.addEventListener("change", ShowSkin);
});

function ShowSkin() {
	if(Hypotension.checked){
	var b = false;
	for (var i = 0; i < SkinM.length; i++) {
		if(SkinM[i].checked) { b = true; break; }
	}
	if(b) page_Fever.style.display = 'none';
	else page_Fever.style.display = 'block'; 
	}
}

function CalculateHypo(){
	var Skinc = 0
	for(var i = 0; i < SkinM.length; i++) if (SkinM[i].checked) Skinc++;
	
	if(Hypotension.checked){
		if(Skinc>=1 && Duration<=2){Diagnosis = "Anaphylaxis"; Confidence="Definite";}
		else if(Skinc>=1 && Duration>2){Diagnosis = "Anaphylaxis";Confidence="Possible";}
		else CalculateFever();
	}
	else{
		if(Skinc>=1 && Duration<=2){Diagnosis = "Allergic reaction"; Confidence="Definite";}
		else if(Skinc>=1 && Duration>2){Diagnosis = "Allergic reaction"; Confidence="Possible";}
		else Diagnosis = "Allergic reaction not likely";
	}
	page_Result.style.display = 'block';
	document.getElementById("Diagnosis").innerHTML = Diagnosis;
	document.getElementById("Confidence").innerHTML = Confidence;
}

/*****************************************************************/


function PageReset() {
	page_Fever.style.display   = 'none';
	page_Dyspnea.style.display = 'none';
	page_Rash.style.display    = 'none';
	page_Hypotension.style.display = 'none';
	page_Result.style.display  = 'none';
	document.getElementById("Comment").innerHTML = "";
	document.getElementById("Diagnosis").innerHTML = "";
}

function addData() {
    google.script.run
    .addRow([
      document.getElementById("fname").value,
      document.getElementById("lname").value,
      document.getElementById("transdate").value,
      document.getElementById("Hospital").value,
      document.getElementById("BlGr").value,
      document.getElementById("Symptom1").checked,
      document.getElementById("Symptom2").checked,
      document.getElementById("Symptom3").checked,
      Diagnosis
    ]);
  }