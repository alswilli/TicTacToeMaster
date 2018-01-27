document.getElementById('secQ').innerHTML = "Who is your favorite actor/actress?";

// Listen for form submit
document.getElementById("secQForm").addEventListener('submit', secQVerification);

//Submit email
function secQVerification(event){
    event.preventDefault();

    // Get answer value
    var answer = getInputVal('answer');
    console.log(answer);

    if (true) {
        alert("Correct Answer!")
        document.location.href = "passwordRecoveryp3.html";
        //$('emailForm').attr('action') = "passwordRecoveryp2.html";
        //document.getElementById("emailForm").action = "passwordRecoveryp2.html";
        //document.getElementById("emailForm").action.submit();
        return true;
    }
    else {

    }
}

function getInputVal(id){
    return document.getElementById(id).value;
}