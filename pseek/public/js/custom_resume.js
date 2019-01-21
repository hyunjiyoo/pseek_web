$(document).ready(function () {
    $('#logoclick img').on('click', function (e) {
        e.preventDefault();
    });
    //
    if($(window).width() <= 974) {
        $('#myprofile-img').css('display', 'block');
        $('#mypageLogo').css('display', 'none');
    }
    // window resize
    $(window).resize(function() {
        if ($(window).width() <= 974) {
            $('#myprofile-img').css('display', 'block');
            $('#mypageLogo').css('display', 'none');
        }
        if ($(window).width() > 974) {
            $('#myprofile-img').css('display','none');
            $('#mypageLogo').css('display', 'block');
        }
    });
});