
(function ($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        event.preventDefault()
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }
        if (check) {
            var formData = $(this).serialize();

            $.ajax({
                url: 'http://localhost:9000/api/auth/signin',
                type: 'POST',
                data: formData,
                success: function (response) {
                    if (response.success) {
                        resetFrom();
                        console.log(response)
                        $('#form-message-success').fadeIn();
                        // window.location.href = '/';
                    } else {
                        handleErrorResponse(response.message)
                    }
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 500) {
                        $('#form-message-warning').text("Server error, Please contact me becouse i need to start my server").fadeIn();
                        setTimeout(() => {
                            $('#form-message-warning').hide();
                        }, 5000)
                    } else if (xhr.status === 0) {
                        $('#form-message-warning').text("Server is not running, Please contact me becouse i need to start my server").fadeIn();
                        setTimeout(() => {
                            $('#form-message-warning').hide();
                        }, 5000)
                    }
                    console.log(xhr.status)
                    console.error("AJAX Error: ", status, error);
                }
            });
        }

    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }

    function handleErrorResponse(message) {
        if (message === 'Wrong Password') {
            PasswordError(message);
        } else if (message === 'No Account With This Email.') {
            EmailError(message)
        } else {
            $('#form-message-success').text(message).fadeIn();
            setTimeout(() => {
                $('#form-message-success').hide();
            }, 3000)
            resetFrom()
        }
    }

    function PasswordError(message) {
        var passwordField = $('input[name="pass"]');
        passwordField.val('');
        passwordField.parent().attr('data-validate', message);
        showValidate(passwordField);
        setTimeout(() => {
            hideValidate(passwordField);
        }, 3000);
    }
    function EmailError(message) {
        var emailField = $('input[name="email"]');
        emailField.val('');
        emailField.parent().attr('data-validate', message);
        showValidate(emailField);
        resetFrom();
    }

    function resetFrom() {
        var emailField = $('input[name="email"]');
        var passwordField = $('input[name="pass"]');
        emailField.val('');
        passwordField.val('');
        setTimeout(() => {
            hideValidate(emailField);
            hideValidate(passwordField);
        }, 3000);

    }



})(jQuery);