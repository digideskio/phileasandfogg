/* Letterize the main nav */
$(function() {
    $('nav a').lettering();
    $('#bg').addClass('move'); 
});

/*
 * For testing the transitions:
 *

$('a').click(function() {
    $('body').toggleClass('opened', !$('body').hasClass('opened'));
    return false;
});
*/

/* Wait for everything to load (not ready) before fading in... */
$(window).load(function() {
    $('body').addClass('loaded');
    var $bo = $('#balloon-outside');

    setTimeout(function() {
        $('body').addClass('opened');

        $bo.addClass('move');
        var move_to = 'translate(380px, -10px)';
        $bo.css(transform, move_to);
        $('.s').addClass('move').css(transform, move_to);

        $('#info').addClass('move on');
    }, 300);
});

/* ..but show a loader in the meantime */
setTimeout(function() {
    $('body').addClass('show-loader');
}, 500);

/* Show your friends! */
$(function() {
    $('#facebook').click(function(e) {
        e.preventDefault();
        window.open(
            'https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(location.href), 
            'facebook-share-dialog', 
        'width=626,height=436'); 
    });
});

/* If the apply page, load up Parse + FilePicker */

$(function() {
    if(!$('#apply').length) return;

    filepicker.setKey('AJZ8mFcFTQkSoqfNf6W14z');
    Parse.initialize("QCewjjXcGZv49MstikpZMhD5p0q0TE02DGciWthb", "sio5lRetWcNjvCKPrjhKHEwpXlrlmOzK2xKCN5KO");
    var App = Parse.Object.extend("Apply");

    var file_upload = function($el, opts) {
        // $el isn't right!
        $('a', $el).click(function(e) {
            e.preventDefault();
            filepicker.pick(opts,
                function(InkBlob){
                    $('input', $el).val(InkBlob.url);
                    $('.blocky', $el).addClass('valid');
                },
                function(FPError){
                    if(FPError.code == 101) return;
                    alert('Error, please try again or email gregory@phileasandfogg.com');
                }
            );
        });
    };

    file_upload($('#upload_video'), { 
        container: 'window',
        services: [(categorizr.isMobile ? 'COMPUTER' : 'VIDEO'), 'URL'],
    });

    file_upload($('#upload_resume'), { 
        container: 'modal',
        services: ['COMPUTER', 'DROPBOX', 'GOOGLE_DRIVE'],
    });

    $('[name=start]').change(function() {
        $(this).trigger('changer');
    });

    $('[name=start]').on('changer', function() {
        $('.fader').removeClass('fader');
        var $parent = $(this).closest('li');
        $parent.next().addClass('fader');
        $parent.next().next().addClass('fader');
    });

    $("#form-apply").validate({
        ignore: '',
        rules: {
            fullname: "required",
            email: {
                required: true,
                email: true
            },
            location: "required",
            links: "required",
            url_video: "required",
            url_resume: "required",

            start: "required",
            dream: "required",
        },
        submitHandler: function(form) {
            $('#form-apply button').attr('disabled', true).text('Applying...');

            var data = $(form).serializeObject();

            var app = new App();
            app.save(data, {
                success: function(object) {
                    $('#form-apply').hide();
                    $(window).scrollTop(0);
                    $('#form-done').fadeIn();
                },
                error: function(object) {
                    alert('Error, please try again or email gregory@phileasandfogg.com');
                    $('#form-apply button').attr('disabled', false).text('Apply!');
                }
            });
            return false;
        },
    });
});
