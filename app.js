// Listen for submit

document.getElementById("loan-form").addEventListener("submit", Approach);
document.getElementById("Fever").addEventListener("submit", Fever);
document.getElementById("Rash").addEventListener("submit", Rash);

function Approach(e) {
  // UI
	//const CC = document.getElementById("Chief").value;
	// Get the selected options
	var CC = document.querySelectorAll('#Chief option:checked');
  
	var FNHTR_disease= false;
	var HTR_Disease = false;
	var Allergy_Disease = false;
	var TRALI_Disease = false;
	var TACO_Disease = false;
	
	for (var i = 0; i < CC.length; i++) {
    // Get the value of the option
		var optionValue = CC[i].value;

    // Set the store flags for each fruit
		switch (optionValue) {
			case 'Fever':
			FNHTR_disease = true;
			HTR_Disease = true;
			TRALI_Disease = true;
			break;
			
			case 'Rash':
			Allergy_Disease = true;
			break;
			
			case 'Dyspnea':
			TACO_Disease = true;
			TRALI_Disease = true;
			Allergy_Disease = true;
			break;
			
			case 'Hypotension':
			Allergy_Disease = true;
			HTR_Disease = true;
			TRALI_Disease = true
			break;
			
			case 'Chills':
			FNHTR_disease = true;
			HTR_Disease = true;
			TRALI_Disease = true;
			break;
      
		}
	}

	if (FNHTR_disease) {
		page_Fever.style.display = 'block';
	}
	
	if (Allergy_Disease) {
		page_Rash.style.display = 'block';
	}

  e.preventDefault();
}

function Fever(e) {

	const Duration = document.querySelector('input[name="Duration"]'); 
    var AHTR = document.querySelectorAll('input[name^="AHTR"]');
	
    // Initialize a count to 0
    var AHTRc = 0;

    // Count AHTR criteria
	for (var i = 0; i < AHTR.length; i++) {
      // If the radio button is checked and has a value of "yes"
      if (AHTR[i].checked && AHTR[i].value == 'yes') {
        // Increment the count
        AHTRc++;
      }
    }
	
	if (AHTRc >= 1){
		
		const AHTRL = document.querySelector('input[name="AHTR_LAB"][value="yes"]');
		
		if (AHTRL.checked){
			document.getElementById("monthlyPayment").innerHTML = "Definite AHTR"+Duration;
		}
		else{
			document.getElementById("monthlyPayment").innerHTML = "Probable AHTR";
			document.getElementById("totalPayment").innerHTML = "Consider further LAB : Fibrinogen, LDH";
		}
		
	}
	else {
		document.getElementById("monthlyPayment").innerHTML = "Definite FNHTR if no other condition could explain";
		
	}


  //Show results
	page_result.style.display = 'block'
  
  document.getElementById("totalInterest").innerHTML = AHTRc;
  

  e.preventDefault();
}

function Rash(e) {

	var Allergy = document.querySelectorAll('input[name^="Allergy"]');
	var AllergyC = 0
	
	for (var i = 0; i < Allergy.length; i++) {
      // If the radio button is checked and has a value of "yes"
      if (Allergy[i].checked && Allergy[i].value == 'yes') {
        // Increment the count
        AllergyC++;
      }
    }
	
	page_result.style.display = 'block'
	 document.getElementById("totalInterest").innerHTML = AllergyC;
	 
	if (AllergyC >=2) {
		document.getElementById("monthlyPayment").innerHTML = "Definite Allergyc Reaction";
		
	}
	else {
		document.getElementById("monthlyPayment").innerHTML = "Probable Allergyc Reaction";
		
	}
	
  e.preventDefault();
}