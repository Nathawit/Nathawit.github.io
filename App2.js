/******************************************** Setting *********************************************/

gid("Approach").addEventListener("click", Approach);
gid("Cal_Hemoly").addEventListener("click", CalculateHemoly);
gid("Cal_Cult").addEventListener("click", CalculateCult);
gid("Cal_Dys").addEventListener("click", CalculateDyspnea);
gid("Cal_Aller").addEventListener("click", CalculateAller);
gid("Cal_Imput").addEventListener("click", CalculateImput);
gid("btnReset").addEventListener("click", function() {
	PageReset(); ChoiceReset()
});


/************************** Interactive **********************/
gid("Fever_NAHTRy").addEventListener("click", ShowDAT);
gid("Fever_NAHTRn").addEventListener("click", ShowDAT);
gid("S_Hypo").addEventListener("change", function() {
	if(S_Hypo.checked){
	Aller_Hypo.checked = true; 
	Dys_QTACO5.disabled= true; }
});
gid("Transdate").addEventListener("change",function(){gid("Onsetdate").value=gid("Transdate").value});

/*************************** None ***************************/
gid("Hemoly_None").addEventListener("change", function() {
	DisableCheckbox(this,"Hemoly_AHTR");
});
gid("Dys_None").addEventListener("change", function() {
	DisableCheckbox(this,"Dys_Q")
});
/*gid("Dys_PE1").addEventListener("change", function(){
	DisableCheckbox(this,"Dys_Q");
	Aller_Dys.checked = true; 
}); */
gid("CultNone").addEventListener("change", function() {
	DisableCheckbox(this,"Cult_");
	ShowHTR();
});

var dxResult = "";
var Definition = "";
var dxImput = "";
var dxSeverity = "";
var dxComment = "";
var Duration = 0;
var Dx = 0;
var Hemoly = 0;
var Pul = 0;
var Cult = 0;

//gid("Transdate").value = '2023-02-12T09:30';  //for testing only
//gid("Onsetdate").value = '2023-02-12T11:00';  //for testing only

function CalDuration() {
	var date1 = new Date(gid("Transdate").value).getTime();
	var date2 = new Date(gid("Onsetdate").value).getTime();
	var Duration = (date2 - date1)/(1000*60);
	return Duration;
}

function DisableCheckbox(checkbox, name) {
    var cbs = document.querySelectorAll('input[id^=' + name + ']');
	if(checkbox.checked) {
		cbs.forEach(checkbox =>{
			checkbox.checked = false;
			checkbox.disabled = true;
		});
	} else {
		cbs.forEach(checkbox =>{
			checkbox.checked = false;
			checkbox.disabled = false;
		});
	}
}

/******************************************** Approach *********************************************/

function Approach() {
	//PageReset();
	Duration = CalDuration();
	if(isNaN(Duration)) alert("Please fill the date and time fields");

	if(S_Dys.checked) showE(page_Dys);
	else if(S_Fever.checked || S_Hypo.checked) showE(page_Hemoly);
	else if(S_Rash.checked) showE(page_Aller);
	else alert("Please select any symptom");
}	

function ShowHTR() {
	Duration = CalDuration();
	if((Duration <= 60) && !(S_Rash.checked||S_Dys.checked)) {
		showE(page_HTR);
	} else {
		hideE(page_HTR);
		HTR_1.checked = false;
		HTR_2.checked = false;
	}
}

/************************* Dyspnea *********************************/

function CalculateDyspnea() {
	Duration = CalDuration();
	var TACO = document.querySelectorAll('input[id^="Dys_QTACO"]');
	var TACOc = 0;
	for(var i = 0; i < TACO.length; i++) if(TACO[i].checked) TACOc++;
		
		if(TACOc >= 2 && !(S_Hypo.checked)) { 
			if(Duration <= 720) {
				dxResult = "TACO";	showE(ImputTACO);	
				
				if(S_Fever.checked) dxComment = "Please workup for Fever";
				
				if(S_Rash.checked) showE(page_Aller);
				else showE(page_Imput);
			} 
			else dxComment = "Consider volume overload from other cause"; 
		} 
		else if(Dys_QTACO2.checked && Dys_QSat.checked) {
			if(Duration <= 360) {
				dxResult = "TRALI"; showE(ImputTRALI); 
				
				if(S_Rash.checked) showE(page_Aller);
				else showE(page_Imput);
			}
			//else dxComment = "Consider Lung injury from other cause";
		} 
		else if(Dys_None.checked || Dys_QSat.checked) {
			if(Duration > 1440) dxComment = "Exclude TACO/TRALI/TAD";
		} 
		else alert("Please select Evidence of Overload or select None");
	
	if(dxResult === "") {
		if(S_Fever.checked || S_Hypo.checked) showE(page_Hemoly);
		else showE(page_Cult);
		
	}
}
/******************************** Hemolysis *****************************************/

var AHTR = document.querySelectorAll('input[id^="Hemoly_AHTR"]');
AHTR.forEach(checkbox => {
	checkbox.addEventListener("change", ShowAHTR);
});

function CalculateHemoly() {
	var AHTRc = 0;
	for(var i = 0; i < AHTR.length; i++) if(AHTR[i].checked) AHTRc++;

	if(AHTRc >= 2) { 
		if(Duration < 1440) {
			dxResult = "AHTR";
			if(S_Rash.checked) showE(page_Aller);
			else showE(page_Imput);
		}
		else {
			dxComment = "Hemolysis from other cause";
			if(S_Rash.checked) showE(page_Aller);
			else {gid("Comment").innerHTML = dxComment; showE(page_Result);}
		}
	}
	else if((AHTRc == 1) || Hemoly_None.checked) showE(page_Cult);	
	else alert("please select");
}

/******************************** Infection *****************************************/

function CalculateCult(){
	var TTI = 0;
	var Cultc = document.querySelectorAll('input[id^="Cult_"]');
	for(var i = 0; i < Cultc.length; i++) if(Cultc[i].checked) TTI++;
	
	if(TTI>=1) { dxResult="TTI"; showE(ImputTTI);}
	else if (CultNone.checked) CalculateAnna();
	else alert("please select")	;
	
}

/************************ Allergic ****************************/

function CalculateAnna() {
	if ((S_Rash.checked && S_Hypo.checked)||(S_Rash.checked && Dys_PE1.checked)) {
		dxResult = "Anaphylaxis";
		Sev1.disabled = true;
		showE(page_Aller);
		showE(ImputAller);}
	else if (S_Hypo.checked && Dys_PE1.checked) {
		dxResult = "Anaphylaxis";
		Sev1.disabled = true;
		showE(ImputAller); showE(page_Imput);}
	else CalculateRO();
}

function CalculateRO(){
	
	if (S_Dys.checked) {
		if (Duration <= 1440) {
			dxResult="TAD";
			showE(ImputGen);
			if(S_Rash.checked) showE(page_Aller);
			else showE(page_Imput);}
		else {dxResult="Rule out Transfusion reaction";showE(page_Result);}}
	
	if (S_Fever.checked) {
		if(Duration <= 240) {
			dxResult="FNHTR";
			showE(ImputGen);
			if(S_Rash.checked) showE(page_Aller);
			else showE(page_Imput);}
		else {dxResult="Rule out Transfusion reaction";showE(page_Result);}}
	
	if (S_Hypo.checked) {
		if(HTR_1.checked||HTR_2.checked) {dxResult="HTR"; showE(ImputGen);}
		else {dxComment = dxComment + " Please workup for other cause of Hypotension";showE(page_Result);}
	}
}

function CalculateAller() {
	
	var TEXT = "Allergic reaction";	
	if(dxResult===""){

		if(Duration <= 240) {dxResult = TEXT; showE(ImputAller);}
		else {gid("Comment").innerHTML = dxComment + "Skin & Mucosal symptom is from" + TEXT ; showE(page_Result);}
		
	} else if (dxResult!="Anaphylaxis"){
		if(Duration <= 240) dxComment = dxComment + " rash is caused by "+TEXT;
		else dxComment = dxComment + " rash is caused by other condition";
	}
	showE(page_Imput);
}

/******************************** Calculation 2 = Imput & Severity *****************************************/

/*********************************** Interaction **********************************/

function ShowAHTR() {
	var b = false;
	for(var i = 0; i < AHTR.length; i++) {
		if(AHTR[i].checked) { b = true; break; }
	}
	if(b) {
		showE(lbFever_NAHTR);
	} else {
		hideE(lbFever_NAHTR);
		Fever_NAHTRy.checked = false;
		Fever_NAHTRn.checked = false;
		clear_ABO_DAT();
	}
}

function ShowDAT() {
	if(Fever_NAHTRn.checked) {
		showE(lbFever_ABO);
		showE(lbFever_DAT);
	} else {
		clear_ABO_DAT();
	}
}

function clear_ABO_DAT() {
	hideE(lbFever_ABO);
	hideE(lbFever_DAT);
	Fever_ABOy.checked = false;
	Fever_ABOn.checked = false;
	Fever_DATy.checked = false;
	Fever_DATn.checked = false;
}


function CalculateImput() {
	Duration = CalDuration();
	var IMP="";
	
	var IMP_cbs = document.querySelectorAll('input[name="Imput"]');
	for (let i = 0; i < IMP_cbs.length; i++) {
      if (IMP_cbs[i].checked) {
        IMP = IMP_cbs[i].value;
		break;}}
	
	// Imputability for each Diagnosis
	if((dxResult == "Allergic reaction" ) || (dxResult == "Anaphylaxis")) {
		if((IMP=="D") && (Duration <= 120)) dxImput = "Definite";
		else if((IMP=="Po") || (Duration >= 120)) dxImput = "Possible";
		else dxImput="Probable";
	}
	else if(dxResult == "AHTR") {
		if(Fever_NAHTRy.checked) dxImput = "Definite, Non Immune"; 
		else if(Fever_NAHTRn.checked) {
			if(Fever_ABOy.checked || Fever_DATy.checked) dxImput = "Definite, Immune";
			else dxImput = "Probable";
		}
	}
	else if(dxResult == "HTR"){
		if(HTR_1 && IMP=="D" && Duration<=15) dxImput="Definite";
		else if(IMP=="Po") dxImput="Possible";
		else dxImput="Probable";
	}
	else if(dxResult=="TTI"){
		if(TTI1.checked && TTI2.checked) dxImput="Definite";
		else if(TTI1.checked || TTI2.checked) dxImput="Probable";
		else dxImput = "Possible";
	}
	else {
		if(IMP=="D") dxImput="Definite";
		else if(IMP=="Pr") dxImput="Probable";
		else if(IMP=="Po") dxImput="Possible";
	}
	
	//Severity
	if(Sev1.checked) dxSeverity = "Non-Severe";
	else if(Sev2.checked) dxSeverity = "Severe";
	else if(Sev3.checked) dxSeverity = "Life-Threatening";
	else alert("please select severity");
	
	showE(page_Result);
	gid("Diagnosis").innerHTML = dxResult;
	gid("Comment").innerHTML = dxComment;
	gid("Severity").innerHTML = dxSeverity;
	gid("Imputability").innerHTML = dxImput;
}
/*****************************************************************/


function PageReset() {
	page_Hemoly.style.display = 'none';
	page_Dys.style.display = 'none';
	page_Imput.style.display = 'none';
	page_Cult.style.display = 'none';
	page_Aller.style.display = 'none';
	page_Result.style.display  = 'none';
	ImputGen.style.display = 'none';
	ImputHTR.style.display = 'none';
	ImputTACO.style.display = 'none';
	ImputTRALI.style.display = 'none';
	lbFever_NAHTR.style.display = 'none';
	lbFever_ABO.style.display = 'none';
	lbFever_DAT.style.display = 'none';
	
	dxResult = "";
	dxSeverity = "";
	dxComment = "";
	dxImput = "";
	
	gid("Comment").innerHTML = "";
	gid("Diagnosis").innerHTML = "";
	gid("Severity").innerHTML = "";
	gid("Imputability").innerHTML = "";
}

function ChoiceReset() {
	var checkboxes = document.querySelectorAll('input[type="checkbox"]');
	var radios = document.querySelectorAll('input[type="radio"]');
	for(var i = 0; i < checkboxes.length; i++) {
		checkboxes[i].checked = false;
		checkboxes[i].disabled = false;
	}
	for(var i = 0; i < radios.length; i++) {
		radios[i].checked = false;
	}
	Aller_Hypo.disabled= true;
	Aller_Dys.disabled= true;
}

function addData() {
	google.script.run
	.addRow([
	  document.getElementById("HN").value,
    document.getElementById("Transdate").value,
    document.getElementById("Onsetdate").value,
    document.getElementById("BlGr").value,
    document.getElementById("BlComp").value,
    document.getElementById("S_Dys").checked,
    document.getElementById("S_Fever").checked,
    document.getElementById("S_Hypo").checked,
    document.getElementById("S_Rash").checked,
	  dxResult,
	  dxSeverity,
	  dxImput,
	  dxComment
	]);
  }

/************************** SHORTHAND FUNCTIONS *********************************/
  
function gid(id) { return document.getElementById(id); }
function showE(e) { e.style.display = 'block'; }
function hideE(e) { e.style.display = 'none'; }




