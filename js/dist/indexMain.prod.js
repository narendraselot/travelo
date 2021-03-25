"use strict";var firebaseConfig={apiKey:"AIzaSyAayDcLEEcBmJbrH3ZbzBEQKVB2vVXcNFo",authDomain:"gidctouristguide.firebaseapp.com",projectId:"gidctouristguide",storageBucket:"gidctouristguide.appspot.com",messagingSenderId:"97113204612",appId:"1:97113204612:web:32805840ef567315d9dfd1",measurementId:"G-PWFPWG4PF5"};firebase.initializeApp(firebaseConfig),firebase.analytics();var db=firebase.firestore();function renderCaptcha(){window.recaptchaVerfier=new firebase.auth.RecaptchaVerifier("captchaContainer"),recaptchaVerfier.render()}function logout(){firebase.auth().signOut(),setInterval(function(){window.location.href="index.html"},500)}function login(){$("#hdnUserType").val("user"),Swal.fire({title:"Login",html:"<a id=\"btnSignInGoogle\" class=\"genric-btn success radius\" style='cursor:pointer' onclick=\"signInGoogle()\">Google <i class='fa fa-google'></i></a><p>or<br><button type='button' class='btn btn-primary' onclick='signInUsingPhoneNumber()'>Sign In Using Phone</button>",confirmButtonText:"Sign in",showCloseButton:!0,showCancelButton:!0,showConfirmButton:!1,focusConfirm:!1})}function signInFacebook(){Swal.close();var e=new firebase.auth.FacebookAuthProvider;firebase.auth().signInWithPopup(e).then(function(e){var n=e.credential,i=e.user;i&&(i.Email,$("#login").addClass("invisible"),$("#Username").removeClass("invisible"),$("#Photo").removeClass("invisible"));n.accessToken}).catch(function(e){e.code,e.message,e.email,e.credential})}function signInGoogle(){var e=new firebase.auth.GoogleAuthProvider;firebase.auth().signInWithPopup(e).then(function(e){Swal.close();e.credential.accessToken,e.user}).catch(function(e){Swal.close();e.code,e.message,e.email,e.credential})}function guideSignIn(){$("#hdnUserType").val("guide"),Swal.close(),Swal.fire({title:"Guide Login",html:"<a id=\"btnSignInGoogle\" class=\"genric-btn success radius\" style='cursor:pointer' onclick=\"signInGoogle()\">Google <i class='fa fa-google'></i></a><p>or<br><button type='button' class='btn btn-primary' onclick='signInUsingPhoneNumber()'>Sign In Using Phone</button>",confirmButtonText:"Sign in",showCloseButton:!0,showCancelButton:!0,showConfirmButton:!1,focusConfirm:!1})}function signUpGuide(){var l="",u="";firebase.auth().onAuthStateChanged(function(e){var t,o,a,s,r,n,c,i;e?(t=e.uid,o=$("#txtAgencyName").val(),a=$("#txtContact").val(),s=$("#txtAddress").val(),r=$("#txtServiceLocation").val(),n=!1,c=$("#txtbaseLocation").val(),l=$("#txtGuideEmail").val(),u=$("#txtGuideName").val(),(i="")!=c&&null!=c||(n=!0,i+=" Base Location "),""!=o&&null!=o||(n=!0,i+=" Agency Name "),""!=a&&null!=a||(n=!0,i+="Contact "),""!=s&&null!=s||(n=!0,i+=" Address "),""!=r&&null!=r||(n=!0,i+=" ServiceLocation "),""!=l&&null!=l||(n=!0,i+=" Name Of Guide "),""!=u&&null!=u||(n=!0,i+=" User Email "),i+=" is/are compulsory Fields",n?Swal.fire("Oops!",i,"error"):db.collection("GuideInfo").get().then(function(e){var n=!0,i={};e.forEach(function(e){e.id==c&&(n=!1,i=e.data(),arrayToSet=i.AgencyDetails,arrayToSet.push({AgencyName:o,Contact:a,Address:s,ServiceLocation:r,guideEmail:l,GuideName:u,UID:t}))}),n&&(arrayToSet=[],arrayToSet.push({AgencyName:o,Contact:a,Address:s,ServiceLocation:r,guideEmail:l,GuideName:u,UID:t}),i.AgencyDetails=arrayToSet),db.collection("GuideInfo").doc(c).set(i).then(function(){Swal.fire("Success!","Details Saved","success")}).catch(function(e){console.error("Error writing document: ",e)})}).catch(function(e){console.log("Error getting documents: ",e)})):Swal.fire("Oops!","Please Login","error")})}function signInUsingPhoneNumber(){Swal.close(),$("#divSignInWithNumber").removeClass("invisible")}function sendOTP(){var e=getPhoneNumberFromUserInput();e?firebase.auth().signInWithPhoneNumber(e,window.recaptchaVerfier).then(function(e){window.confirmationResult=e,firebaseNumberResult=e,console.log(e),toast("OTP Sent","success")}).catch(function(e){toast(e,"error")}):toast("Number cannot be empty","error")}function verifyOTPAndSignIn(){var e=getOTPUserInput();e?firebaseNumberResult.confirm(e).then(function(e){toast("Sign In Success","success");e.user;setInterval(function(){window.location.href=window.location.href},500)}).catch(function(e){toast(e,"error")}):toast("OTP Cannot be empty","error")}function getPhoneNumberFromUserInput(){return $("#txtPhoneNumber").val()?($("#txtPhoneNumber").val($("#txtPhoneNumber").val().replace("+91","")),"+91"+$("#txtPhoneNumber").val()):null}function getOTPUserInput(){return $("#txtOTP").val()?$("#txtOTP").val():null}function toast(e,n){Swal.mixin({toast:!0,position:"bottom",showConfirmButton:!1,timer:3e3,timerProgressBar:!0,didOpen:function(e){e.addEventListener("mouseenter",Swal.stopTimer),e.addEventListener("mouseleave",Swal.resumeTimer)}}).fire({icon:n,title:e})}firebaseNumberResult="",$(function(){firebase.auth().onAuthStateChanged(function(e){var n,i,t;e?(n=e.email,i=e.photoURL,t=e.displayName,0<$("#txtGuideEmail").length()&&n&&$("#txtGuideEmail").val(n),0<$("#txtGuideName").length()&&t&&$("#txtGuideName").val(t),null==t&&(t="New User"),null==i&&(i="./img/defuser.webp"),e.uid,$("#login").addClass("invisible"),$("#Username").removeClass("invisible"),$("#Photo").removeClass("invisible"),$("#liLogout").removeClass("invisible"),$("#guidelogin").addClass("invisible"),$("#Username").html("<a>"+t+"</a>"),$("#dpPhoto").attr("src",i),"guide"==$("#hdnUserType").val()&&(document.location.href="GuideDetails.html")):($("#login").removeClass("invisible"),$("#Username").addClass("invisible"),$("#Photo").addClass("invisible"),$("#guidelogin").removeClass("invisible"),$("#Username").html(""),$("#dpPhoto").attr("src",""),$("#liLogout").addClass("invisible"))}),$("#btnLogout").on("click",function(){logout()}),$("#btnLogin").on("click",function(){login()}),$("#btnGuideLogin").on("click",function(){guideSignIn()}),$("#btnSubmitGuideDetails").on("click",function(){signUpGuide()}),$("#btnCancelGuideDetails").on("click",function(){document.location.href="/"}),$("#btnSendOTP").on("click",function(){sendOTP()}),$("#btnSignUpUsingNumber").on("click",function(){verifyOTPAndSignIn()}),renderCaptcha()});