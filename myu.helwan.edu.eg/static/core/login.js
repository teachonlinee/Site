jQuery(document).ready(function(a) {

    $("#frmLogin button").removeAttr("disabled");

    bootstrap_switch_trigger_call();
    forgo_password_view();
    login_view_submit();
    load_me();
    //alert("cookie in login "+Cookies.get(LANG_COOKIE));alert("html lang in login js "+$("html").attr("lang"))
    //change_lang("en");
    on_forgot_pswd();
    on_change_lang();
});

//send language token for all requests//islamn
jQuery.ajaxPrefilter(function (options, originalOptions, jqXHR) {
    if(originalOptions.url.indexOf("http://cdn.")!=0 && originalOptions.url.indexOf("https://cdn.")!=0) {
        jqXHR.setRequestHeader("lang", Cookies.get(LANG_COOKIE));
        jqXHR.setRequestHeader("Accept-Language", Cookies.get(LANG_COOKIE));
    }

    $("#spinner-container").show();
});

$(document).ajaxStop(function () {
  $("#spinner-container").hide();
});

function bootstrap_switch_trigger_call(){
    $(".switchCheckBox").bootstrapSwitch()
}

function remember_me(){
   var c = $("#chkRemember");

   //IF CHECKBOX IS SET, COOKIE WILL BE SET
   if(c.is(":checked")){
     var u = $("[name='txtUserName']").val(); //VALUE OF USERNAME
     var p = $("[name='txtPassword']").val(); //VALUE OF PASSWORD

     u = sjcl.encrypt("password", u)
     p = sjcl.encrypt("password", p)

     Cookies.set("spu", u, { expires: 30}); //SETS IN DAYS (30 DAYS)
     Cookies.set("spp", p, { expires: 30}); //SETS IN DAYS (30 DAYS)    //, secure: true
   }
   else{
       Cookies.remove('spu'); // removed!
       Cookies.remove('spp'); // removed!
   }
}

//NEXT PAGE LOAD, THE USERNAME & PASSWORD WILL BE SHOWN IN THEIR FIELDS
function load_me(){
   var u = Cookies.get("spu"); //"USERNAME" COOKIE
   var p = Cookies.get("spp"); //"PASSWORD" COOKIE

   if(u)  u = sjcl.decrypt("password", u)
   if(p) p = sjcl.decrypt("password", p)

   $("[name='txtUserName']").val(u); //FILLS WITH "USERNAME" COOKIE
   $("[name='txtPassword']").val(p); //FILLS WITH "PASSWORD" COOKIE

    if(u && p)  $(".switchCheckBox").bootstrapSwitch('state', true);
    else    $(".switchCheckBox").bootstrapSwitch('state', false);

    /*if(window.location.pathname=="/" && u && p)
        $("#f").submit();*/
}

function forgo_password_view() {
    $(".forgot-password, .login-view").click(function() {
        $(".login-form, .forgot-pass-box").slideToggle("slow");
    })
}

function login_view_submit() {
    //import * as Ladda from 'ladda';

    // Example starter JavaScript for disabling form submissions if there are invalid fields
    /*(function() {
          'use strict';
          window.addEventListener('load', function() {

              // Fetch all the forms we want to apply custom Bootstrap validation styles to
              var form = document.getElementById('frmLogin');
              // prevent submission

              form.addEventListener('submit', function(event) {
                  if (form.checkValidity() === false) {
                      event.preventDefault();
                      event.stopPropagation();
                  }
                  form.classList.add('was-validated');
              }, false);

          }, false);
    })();*/

    $("#frmLogin").submit(function() {//alert("cookie in submit login "+Cookies.get(LANG_COOKIE));
        //disable the submit button
        $("#frmLogin button").attr("disabled", true);

        //return false;
        var form = document.getElementById('frmLogin');
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
            $("#frmLogin button").removeAttr("disabled");
        }
        else{
            //Ladda.bind("button.ladda-button");
            //Ladda.stopAll();

            remember_me();
        }
        form.classList.add('was-validated');
        //alert(LANG_COOKIE);
        /*alert("cookie in validate login "+Cookies.get(LANG_COOKIE));
        alert("cookie by name in validate login "+Cookies.get("SP_django_language"));
        alert("html lang in validate login "+$("html").attr("lang"));*/
        $("[name='hdnLang']").val(Cookies.get(LANG_COOKIE));
    });
}
/*
function ladda_button_call() {
    Ladda.bind("button.ladda-button", {
        callback: function(a) {

            var c = 0;
            var b = setInterval(function() {
                c = Math.min(c + Math.random() * 0.1, 1);
                a.setProgress(c);
                if (c === 1) {
                    a.stop();
                    clearInterval(b);
                    var d = humane.create({
                        baseCls: "humane-jackedup",
                        addnCls: "humane-jackedup-success"
                    });
                    d.log("<i class='fa fa-smile-o'></i> Successfully logedin ");
                    setInterval(function() {
                        var e = "./";
                        //window.location.assign(e)
                    }, 300)
                }
            }, 200)
        }
    })
};*/

function error_modal(msg, options, callback){
    var notify=humane.create({baseCls:"humane-original",addnCls:"humane-original-error"});
    var all_options = {clickToClose:true, timeout:5000, waitForMove:false};//console.log(options)
    if(options){
        Object.keys(options).forEach(function(key) {
            all_options[key] = options[key];
        });
    }//console.log(all_options)

    notify.log("<i class='fa fa-times'></i> <span>"+msg+"</span>",all_options, callback);
}

function success_modal(msg, callback) {
    var notify=humane.create({baseCls:"humane-original",addnCls:"humane-original-success"});
    if(callback) callback();
    notify.log("<i class='fa fa-check'></i> <span>"+msg+"</span>",{timeout:4000});
}

function on_forgot_pswd() {
    $("[name='txtStudentCode']").keypress(function(event){
        var ew = event.which;
        if(48 <= ew && ew <= 57)    //numbers
            return true;
        return false;
    });

    $("#frmForgot").submit(function(e) {
        e.preventDefault();
        $("#frmForgot button").attr("disabled","disabled");


        var form = document.getElementById('frmForgot');
        if (form.checkValidity() === false) {
            // $("#frmForgot button").removeAttr("disabled");
            form.classList.add('was-validated');
            return false;
        }

        form.classList.add('was-validated');

        var data = {'csrfmiddlewaretoken':Cookies.get('csrftoken')
            , 'txtUserMail':$("[name='txtUserMail']").val()
            , 'txtNationalID':$("[name='txtNationalID']").val()
            , 'txtStudentCode':$("[name='txtStudentCode']").val()
        };

        $.ajax({
            url: "/forgot_password",
            data: data,
            type: "post",
            dataType: 'json',
            success: function (result) {//console.log(data)
                $("#frmForgot button").removeAttr("disabled");
                if(result["failed"]){
                    error_modal(result["msg"]);
                }
                else{
                    success_modal(result["msg"]);
                    //window.location="/";
                    $("[name='txtUserMail']").val("");
                    $("[name='txtNationalID']").val("");
                    $("[name='txtStudentCode']").val("");
                    $("[name='txtUserName']").val("");
                    $("[name='txtPassword']").val("");
                    $("#frmLogin .alert").html("");
                    $(".login-view").trigger("click");  //return to login form
                }
            }
        });
    });
}


function register(){
    $("#registerModal .btn-main").attr("disabled","disabled");
    var form = document.getElementById('frmRegister');
    if (form.checkValidity() === false) {
        form.classList.add('was-validated');
        return false;
    }
    $.ajax({
        url: "/register",
        data: {'csrfmiddlewaretoken':Cookies.get('csrftoken'), "txtRegisterIdNo":$("#txtRegisterIdNo").val()},
        type: "post",
        dataType: 'json',
        success: function (result) {//console.log(data)
            $("#div-enquiry-feedback").html(result["msg"]);
            $("#div-enquiry-feedback").show();

            if(result["failed"]){
                $("#div-register-feedback").html(result["msg"]);
                $("#div-register-feedback").show();
            }
            else{
                $('#registerModal').modal('hide');
                success_modal(result["msg"]);
            }
        },
        finally: function (){
             $("#registerModal .btn-main").removeAttr("disabled");
        }
    });
}

// function enquiry(grecaptcha){
//     var form = document.getElementById('frmEnquiry');
//     if (form.checkValidity() === false) {
//         form.classList.add('was-validated');
//         return false;
//     }
//     $("#enquiryModal .btn-primary").attr("disabled","disabled");
//     $.ajax({
//         url: "personal/enquire_student_code",
//         data: {'csrfmiddlewaretoken':Cookies.get('csrftoken'), "txtIdNo":$("#txtIdNo").val(), "g-recaptcha-response":grecaptcha},
//         type: "post",
//         dataType: 'json',
//         success: function (result) {//console.log(data)
//             $("#div-enquiry-feedback").html(result["msg"]);
//             $("#div-enquiry-feedback").show();
//
//             $("#div-enquiry-feedback").removeClass (function (index, className) {
//                 return (className.match (/(^|\s)alert-\S+/g) || []).join(' ');
//             });
//             if(result["failed"])   $("#div-enquiry-feedback").addClass("alert-danger");
//             else     $("#div-enquiry-feedback").addClass("alert-success");
//
//             $("#enquiryModal .btn-primary").removeAttr("disabled");
//         }
//     });
// }