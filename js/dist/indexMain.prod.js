"use strict";var firebaseConfig={apiKey:"AIzaSyAayDcLEEcBmJbrH3ZbzBEQKVB2vVXcNFo",authDomain:"gidctouristguide.firebaseapp.com",projectId:"gidctouristguide",storageBucket:"gidctouristguide.appspot.com",messagingSenderId:"97113204612",appId:"1:97113204612:web:32805840ef567315d9dfd1",measurementId:"G-PWFPWG4PF5"};firebase.initializeApp(firebaseConfig),firebase.analytics();var db=firebase.firestore();function renderCaptcha(){window.recaptchaVerfier=new firebase.auth.RecaptchaVerifier("captchaContainer"),recaptchaVerfier.render()}function logout(){firebase.auth().signOut(),setInterval(function(){window.location.href="index.html"},500)}function login(){$("#hdnUserType").val("user"),Swal.fire({title:"Login",html:"<a id=\"btnSignInGoogle\" class=\"genric-btn success radius\" style='cursor:pointer' onclick=\"signInGoogle()\">Google <i class='fa fa-google'></i></a><p>or<br><button type='button' class='btn btn-primary' onclick='signInUsingPhoneNumber()'>Sign In Using Phone</button>",confirmButtonText:"Sign in",showCloseButton:!0,showCancelButton:!0,showConfirmButton:!1,focusConfirm:!1})}function signInFacebook(){Swal.close();var e=new firebase.auth.FacebookAuthProvider;firebase.auth().signInWithPopup(e).then(function(e){var n=e.credential,i=e.user;i&&(i.Email,$("#login").addClass("invisible"),$("#Moblogin").addClass("invisible"),$("#Username").removeClass("invisible"),$("#MobUsername").removeClass("invisible"),$("#Photo").removeClass("invisible"),$("#MobPhoto").removeClass("invisible"));n.accessToken}).catch(function(e){e.code,e.message,e.email,e.credential})}function signInGoogle(){var e=new firebase.auth.GoogleAuthProvider;firebase.auth().signInWithPopup(e).then(function(e){Swal.close();e.credential.accessToken,e.user}).catch(function(e){Swal.close();e.code,e.message,e.email,e.credential})}function guideSignIn(){$("#hdnUserType").val("guide"),Swal.close(),Swal.fire({title:"Guide Login",html:"<a id=\"btnSignInGoogle\" class=\"genric-btn success radius\" style='cursor:pointer' onclick=\"signInGoogle()\">Google <i class='fa fa-google'></i></a><p>or<br><button type='button' class='btn btn-primary' onclick='signInUsingPhoneNumber()'>Sign In Using Phone</button>",confirmButtonText:"Sign in",showCloseButton:!0,showCancelButton:!0,showConfirmButton:!1,focusConfirm:!1})}function signUpGuide(){startLoading();var d="",g="";firebase.auth().onAuthStateChanged(function(e){var a,s,r,l,c,n,u,i;e?(a=e.uid,s=$("#txtAgencyName").val(),r=$("#txtContact").val(),l=$("#txtAddress").val(),c=$("#txtServiceLocation").val(),n=!1,u=$("#txtbaseLocation").val(),d=$("#txtGuideEmail").val(),g=$("#txtGuideName").val(),(i="")!=u&&null!=u||(n=!0,i+=" Base Location "),""!=s&&null!=s||(n=!0,i+=" Agency Name "),""!=r&&null!=r||(n=!0,i+="Contact "),""!=l&&null!=l||(n=!0,i+=" Address "),""!=c&&null!=c||(n=!0,i+=" ServiceLocation "),""!=d&&null!=d||(n=!0,i+=" Name Of Guide "),""!=g&&null!=g||(n=!0,i+=" User Email "),i+=" is/are compulsory Fields",n?(stopLoading(),Swal.fire("Oops!",i,"error")):db.collection("GuideInfo").get().then(function(e){var i=!0,t={},o=!0;e.forEach(function(e){if(e.id==u){i=!1,t=e.data(),arrayToSet=t.AgencyDetails;for(var n=0;n<arrayToSet.length;n++)if(arrayToSet[n].UID==a){o=!1;break}o?arrayToSet.push({AgencyName:s,Contact:r,Address:l,ServiceLocation:c,guideEmail:d,GuideName:g,UID:a}):toast("Data Already Present","info")}}),i&&(arrayToSet=[],arrayToSet.push({AgencyName:s,Contact:r,Address:l,ServiceLocation:c,guideEmail:d,GuideName:g,UID:a}),t.AgencyDetails=arrayToSet),o&&db.collection("GuideInfo").doc(u).set(t).then(function(){stopLoading(),Swal.fire("Success!","Details Saved","success"),setInterval(function(){window.location.href=window.location.href},1e3)}).catch(function(e){console.error("Error writing document: ",e),stopLoading()})}).catch(function(e){stopLoading(),console.log("Error getting documents: ",e)})):Swal.fire("Oops!","Please Login","error")})}function signInUsingPhoneNumber(){Swal.close(),$("#divSignInWithNumber").removeClass("invisible")}function sendOTP(){var e=getPhoneNumberFromUserInput();e?firebase.auth().signInWithPhoneNumber(e,window.recaptchaVerfier).then(function(e){window.confirmationResult=e,firebaseNumberResult=e,console.log(e),toast("OTP Sent","success")}).catch(function(e){toast(e,"error")}):toast("Number cannot be empty","error")}function verifyOTPAndSignIn(){var e=getOTPUserInput();e?firebaseNumberResult.confirm(e).then(function(e){toast("Sign In Success","success");e.user;setInterval(function(){window.location.href=window.location.href},500)}).catch(function(e){toast(e,"error")}):toast("OTP Cannot be empty","error")}function getPhoneNumberFromUserInput(){return $("#txtPhoneNumber").val()?($("#txtPhoneNumber").val($("#txtPhoneNumber").val().replace("+91","")),"+91"+$("#txtPhoneNumber").val()):null}function getOTPUserInput(){return $("#txtOTP").val()?$("#txtOTP").val():null}function toast(e,n){Swal.mixin({toast:!0,position:"bottom",showConfirmButton:!1,timer:3e3,timerProgressBar:!0,didOpen:function(e){e.addEventListener("mouseenter",Swal.stopTimer),e.addEventListener("mouseleave",Swal.resumeTimer)}}).fire({icon:n,title:e})}function startLoading(){$("#loading").removeClass("invisible")}function stopLoading(){$("#loading").addClass("invisible")}firebaseNumberResult="",$(function(){firebase.auth().onAuthStateChanged(function(e){var n,i,t,a;e?(n=e.email,i=e.photoURL,t=e.displayName,a=e.uid,0<$("#txtGuideEmail").length&&0<$("#txtGuideName").length&&(startLoading(),n&&$("#txtGuideEmail").val(n),t&&$("#txtGuideName").val(t),db.collection("GuideInfo").get().then(function(e){var i={},t=!1,o={};e.forEach(function(e){i=e.data(),arrayToSet=i.AgencyDetails;for(var n=0;n<arrayToSet.length;n++)if(arrayToSet[n].UID==a){o=arrayToSet[n],$("#txtAgencyName").val(o.AgencyName),$("#txtContact").val(o.Contact),$("#txtAddress").val(o.Address),$("#txtServiceLocation").val(o.ServiceLocation),$("#txtbaseLocation").val(e.id),$("#txtGuideEmail").val(o.guideEmail),$("#txtGuideName").val(o.GuideName),t=!0;break}t?($("#mainForm :input").attr("disabled",!0),$("#mainForm :button").attr("disabled",!0)):($("#mainForm :input").attr("disabled",!1),$("#mainForm :button").attr("disabled",!1))}),stopLoading()}).catch(function(e){console.log("Error getting documents: ",e),stopLoading()})),null==t&&(t="New User"),null==i&&(i="./img/defuser.webp"),e.uid,$("#login").addClass("invisible"),$("#Moblogin").addClass("invisible"),$("#Username").removeClass("invisible"),$("#MobUsername").removeClass("invisible"),$("#Photo").removeClass("invisible"),$("#MobPhoto").removeClass("invisible"),$("#liLogout").removeClass("invisible"),$("#MobliLogout").removeClass("invisible"),$("#guidelogin").addClass("invisible"),$("#Mobguidelogin").addClass("invisible"),$("#Username").html("<a>"+t+"&nbsp;&nbsp;</a>"),$("#MobUsername").html("<a>"+t+"&nbsp;&nbsp;</a>"),$("#dpPhoto").attr("src",i).after("<i>&nbsp;</i>"),$("#MobdpPhoto").attr("src",i).after("<i>&nbsp;</i>"),"guide"==$("#hdnUserType").val()&&(document.location.href="GuideDetails.html")):($("#login").removeClass("invisible"),$("#Moblogin").removeClass("invisible"),$("#Username").addClass("invisible"),$("#MobUsername").addClass("invisible"),$("#Photo").addClass("invisible"),$("#MobPhoto").addClass("invisible"),$("#guidelogin").removeClass("invisible"),$("#Mobguidelogin").removeClass("invisible"),$("#Username").html(""),$("#MobUsername").html(""),$("#dpPhoto").attr("src",""),$("#MobdpPhoto").attr("src",""),$("#liLogout").addClass("invisible"),$("#MobliLogout").addClass("invisible"))}),$("#btnLogout").on("click",function(){logout()}),$("#btnLogin").on("click",function(){login()}),$("#MobbtnLogin").on("click",function(){login()}),$("#btnGuideLogin").on("click",function(){guideSignIn()}),$("#MobbtnGuideLogin").on("click",function(){guideSignIn()}),$("#btnSubmitGuideDetails").on("click",function(){signUpGuide()}),$("#btnCancelGuideDetails").on("click",function(){document.location.href="/"}),$("#btnSendOTP").on("click",function(){sendOTP()}),$("#btnSignUpUsingNumber").on("click",function(){verifyOTPAndSignIn()}),renderCaptcha()});