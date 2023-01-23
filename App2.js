document.getElementById("Approach").addEventListener("click", Approach);
document.getElementById("CalculateFever").addEventListener("click", CalculateFever);
document.getElementById("CalculateDyspnea").addEventListener("click", CalculateDyspnea);
document.getElementById("CalculateHypo").addEventListener("click", CalculateHypo);
document.getElementById("CalculateHTR").addEventListener("click", CalculateHTR);
document.getElementById("Reset").addEventListener("click", PageReset);

document.getElementById("Dyspnea").addEventListener("click", ShowSat);
document.getElementById("Hypotension").addEventListener("click", ShowSat);
document.getElementById("Fever").addEventListener("click", ShowSat);
document.getElementById("Fever_NAHTRy").addEventListener("click", ShowDAT);
document.getElementById("Fever_NAHTRn").addEventListener("click", ShowDAT);

document.getElementById("Hypo_None").addEventListener("change", function(){DisableCheckbox(this,"Hypo_Skin")});
document.getElementById("Fever_None").addEventListener("change", function(){DisableCheckbox(this,"Fever_AHTR")});

document.getElementById("Hypotension").addEventListener("change", ShowHypo);
document.getElementById("SatDropy").addEventListener("click", function(){Dys_Sat.checked = true; Dys_Sat.disabled= true;});

var Diagnosis = ""
var Confidence = ""
var Severity = ""
var Duration = 0
var DDX = null

document.getElementById("SatDropy").addEventListener("click", function(){Recovy.disabled = true;Recovn.disabled = true;});
document.getElementById("SatDropn").addEventListener("click", function(){Recovy.disabled = false;Recovn.disabled = false;});
document.getElementById("Recovy").addEventListener("click", function(){SatDropy.disabled = true;SatDropn.disabled = true;});
document.getElementById("Recovn").addEventListener("click", function(){SatDropy.disabled = false;SatDropn.disabled = false;});

function CalDuration(){
	var date1 = new Date(document.getElementById("Transdate").value).getTime();
	var date2 = new Date(document.getElementById("Onset").value).getTime();
	var Duration = (date2 - date1)/(1000*60);
	return Duration;
}

/************************ Approach *********************************/

function Approach() {
	PageReset();
	Duration = CalDuration();
	
	if(isNaN(Duration)){
      alert("Please fill the date and time field");
    }
	else{	
	if(Dyspnea.checked && Hypotension.checked) {
		if(SatDropy.checked) page_Dyspnea.style.display = 'block';
		else if(Recovy.checked){Diagnosis="HTR"}
		else if(SatDropn.checked && Recovn.checked) page_Hypotension.style.display = 'block';
		else alert("Please select an option.");
	}
	else if(Dyspnea.checked && Fever.checked) {
		if(SatDropy.checked) page_Dyspnea.style.display = 'block';
		else if(SatDropn.checked) page_Fever.style.display = 'block';
		else alert("Please select an option.");
	}
	else if(Dyspnea.checked) page_Dyspnea.style.display = 'block';
	else if(Fever.checked) page_Fever.style.display = 'block';
	else if(Recovy.checked) page_HTR.style.display='block';
	else if(Hypotension.checked) {
		if(Duration>240){page_Fever.style.display = 'block';}
		else {page_Hypotension.style.display = 'block'; page_Fever.style.display = 'block';}
	}
	else if(Rash.checked) {
		if(Duration<=240) page_Hypotension.style.display = 'block';
		else {Comment = "Consider Rash from other cause"; page_Result.style.display='block';}
	}
	else{alert("Please select at least 1 symptom");}
	
	}
}	

function ShowHypo(){
	Duration = CalDuration();
	if(Duration<60 && Hypotension.checked){lbRecov.style.display = 'block'}
	else {
		lbRecov.style.display = 'none';
		Recovy.checked=false;Recovn.checked=false;
	}
}
function ShowSat() {
	if(Dyspnea.checked && (Hypotension.checked || Fever.checked)) {
		lbSatDrop.style.display = 'block';
	} else {
		lbSatDrop.style.display = 'none';
		SatDropy.checked = false;
		SatDropn.checked = false;
	}
}

function DisableCheckbox(checkbox,name) {
    var checkboxes = document.querySelectorAll('input[name^=' + name + ']');
	if(checkbox.checked){
		checkboxes.forEach(checkbox =>{checkbox.checked = false;checkbox.disabled = true;});
	}else checkboxes.forEach(checkbox =>{checkbox.checked = false;checkbox.disabled = false;});
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
	
	if(AHTRc >= 1 && Duration < 1440) { 
		if(Fever_NAHTRy.checked) { Diagnosis = "NiAHTR"; Confidence = "Definite"; }
		else if(Fever_NAHTRn.checked) {
			Diagnosis = "iAHTR";
			if(Fever_ABOy.checked || Fever_DATy.checked) Confidence = "Definite";
			else Confidence = "Probable";
		}
		page_Result.style.display = 'block';
	} else if(Fever_None.checked){
		if(Duration < 240 && Hypotension.checked) {Diagnosis = "TTI if evidence C/S positive";Comment ="Please consider C/S, if positive likely TTI";}
		else if (Duration < 240) {Diagnosis = "FNHTR or TTI"; Comment ="Please consider C/S, if positive likely TTI";}
		else Diagnosis = "FNHTR & AHTR & TTI are not likely";
		page_Result.style.display = 'block';
	} else alert("please select")
	
	document.getElementById("Diagnosis").innerHTML = Diagnosis;
	document.getElementById("Confidence").innerHTML = Confidence;
	document.getElementById("Comment").innerHTML = Comment;
}


/************************* RASH *********************************/



/************************* Dyspnea *********************************/

function CalculateDyspnea() {
	var TACO = document.querySelectorAll('input[name^="Dys_Q"]');
	var TACOc = 0
	Duration = CalDuration();
	for(var i = 0; i < TACO.length; i++) if (TACO[i].checked) TACOc++;
	
	if(TACOc>=2) {
		if(Duration<=720) Diagnosis="TACO";	
		else Diagnosis= "Overload from other cause";
	} else if(Dys_Q2.checked & Dys_Sat.checked){
		if(Duration<=720) Diagnosis="TRALI";	
		else Diagnosis= "Lung inkury from other cause";
	} else Diagnosis="TAD";
	
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
	Duration = CalDuration();
	for(var i = 0; i < SkinM.length; i++) if (SkinM[i].checked) Skinc++;
	
	if(Skinc>=1){
		if(Other_Skiny.checked && Duration<=120) Confidence="Probable";
		else if(Other_Skinn.checked && Duration<=120) Confidence="Definite";
		else if(Duration>120) Confidence="Possible";
		else alert("Pleaase select")
		
		if(Hypotension.checked) Diagnosis = "Anaphylaxis";
		else Diagnosis = "Allergic reaction";
		
	} else {
		if (Hypotension.checked)	CalculateFever();
		else {Diagnosis = "Allergic reaction not likely"; Confidence="";}
		}

	page_Result.style.display = 'block';
	document.getElementById("Diagnosis").innerHTML = Diagnosis;
	document.getElementById("Confidence").innerHTML = Confidence;
}

function CalculateHTR(){
	Duration = CalDuration();
	Diagnosis="HTR";
	var OTH = document.querySelectorAll('input[name^="Other_HTR"]').value;
	if(Other_HTRy.checked) {Confidence="Possible";}
	else if(Other_HTRn.checked){
		if(Duration<=15) Confidence="Definite";
		else Confidence = "Probable";
	}
	else alert("Please select");
	
	page_Result.style.display = 'block';
	document.getElementById("Diagnosis").innerHTML = Diagnosis;
	document.getElementById("Confidence").innerHTML = Confidence;
	document.getElementById("Comment").innerHTML = Severity;
}
/*****************************************************************/


function PageReset() {
	page_Fever.style.display   = 'none';
	page_Dyspnea.style.display = 'none';
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
