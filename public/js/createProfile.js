$(function(){
    $('#profile_image').change( function(e) {
        
        var img = URL.createObjectURL(e.target.files[0]);
        $('.image').attr('src', img);
    });
});

function passwordRetrieval(){
    if (true) {
        var con=confirm("Email verified: Password Token sent!");
    } else {
        var con2=confirm("Email invalid: Please try again");   
    }
}
