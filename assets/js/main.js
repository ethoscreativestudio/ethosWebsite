emailjs.init("user_ba3FBeehGmgmV24bEQwY4");

var video = document.getElementById("bgvid");
var pauseAfterSecond = false;
var reWindIsActive = false;
var codeToValidate;

$(document).ready(function () {
    getJson();
    $("#password").ForceNumericOnly();
    // setTimeout(function () {
    //     validatePassword(1111);
    //     setTimeout(function () {
    //         $(".click-to-send").click();
    //     }, 4000);
    // }, 1000);
});

if (window.matchMedia('(prefers-reduced-motion)').matches) {
    video.removeAttribute("autoplay");
    video.pause();
}

function vidFade() {
    video.classList.add("stopfade");
}

$(".click-to-send").on("click", function () {
    video.play();
    $("body").css("background", "url(/assets/img/final_frame.png)").css("background-size", "contain")

    if (reWindIsActive) {
        video.play();
        return;
    }
    var isValidEmail = isEmail($("#emailAddress").val());
    if (!isValidEmail) {
        $(".error-email").html("<br/> The email address is invalid. Please try again.")
        $(".error-email").show();
    } else {
        $(".error-email").hide();
        $("body").css("background", "url(/assets/img/final_frame.png)").css("background-size", "contain")
        sendEmail();
    }
})

video.addEventListener('ended', function () {
    video.pause();
    $("#bgvid").hide();
    $(".main").hide();
    $(".final-code").removeClass("displayNone").show();
    $("main").hide();
});

video.addEventListener("timeupdate", function () {
    if (!pauseAfterSecond) {
        if (this.currentTime >= 2) {
            this.pause();
        }
    }
    if (this.currentTime >= 1.8) {
        $(".main").hide();
    }
});


function showMainInformaiton() {
    $(".flexcroll").removeAttr("style");
    $(".main").fadeIn(500);
    pauseAfterSecond = true;
}

video.onpause = function () {
    showMainInformaiton();
};


$(".rewind-animation").click(function () { // button function for rewind
    pauseAfterSecond = false;
    reWindIsActive = true;
    $(".final-code").addClass("displayNone").hide();
    $("#bgvid").show();
    $("#final-modal").modal('hide');
    intervalRewind = setInterval(function () {
        video.playbackRate = 1.0;
        if (video.currentTime <= 2) {
            clearInterval(intervalRewind);
            video.pause();
            showMainInformaiton();
        }

        if (video.currentTime == 0) {
            clearInterval(intervalRewind);
            video.pause();
        }
        else {
            video.currentTime += -.1;
        }
    }, 85);
});

function validatePassword(password) {
    var validPassword = false;
    $.each(codeToValidate.Customers, function (index, data) {
        if (parseInt(password) == parseInt(data.Password)) {
            $(".blinking").hide();
            var name = data.Name != "" ? "Dear " + data.Name + ", " : "Dear,";
            $(".dearCustomer").text(name);
            $("#bgvid").show();
            $('#code').hide();
            video.play();
            validPassword = true;
        }
    });

    if (!validPassword) {
        $(".blinking").fadeIn('slow').delay(4000).hide(0);
    }
}

$("#password").keyup(function () {
    var value = $(this).val();
    if (value.length >= 4) {
        validatePassword(value);
    } else {
        $(".blinking").hide();
    }
});

function getJson() {
    return codeToValidate = customers;
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

jQuery.fn.ForceNumericOnly =
    function () {
        return this.each(function () {
            $(this).keydown(function (e) {
                var key = e.charCode || e.keyCode || 0;
                // allow backspace, tab, delete, enter, arrows, numbers and keypad numbers ONLY
                // home, end, period, and numpad decimal
                return (
                    key == 8 ||
                    key == 9 ||
                    key == 13 ||
                    key == 46 ||
                    key == 110 ||
                    key == 190 ||
                    (key >= 35 && key <= 40) ||
                    (key >= 48 && key <= 57) ||
                    (key >= 96 && key <= 105));
            });
        });
    };

function sendEmail() {
    var templateParams = {
        reply_to: 'theo@ethos.rocks',
        email_of_person_interested: $("#emailAddress").val(),
        selected_services: $("[type='checkbox']:checked").map(function () {
            return this.value;
        }).get().join(", "),
        first_name_company: $("#firstNameCompany").val()
    };
    emailjs.send('service_u7uy0w7', 'template_contactDetails', templateParams)
        .then(function (response) {
            video.play();
        }, function (error) {
            alert("Failed sending the email.\n\nCould you contact us via theo@ethos.rocks ?\n\nThank you, \nEthos ");
        });
}