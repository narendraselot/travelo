var firebaseConfig = {
    apiKey: "AIzaSyAayDcLEEcBmJbrH3ZbzBEQKVB2vVXcNFo",
    authDomain: "gidctouristguide.firebaseapp.com",
    projectId: "gidctouristguide",
    storageBucket: "gidctouristguide.appspot.com",
    messagingSenderId: "97113204612",
    appId: "1:97113204612:web:32805840ef567315d9dfd1",
    measurementId: "G-PWFPWG4PF5"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();
firebaseNumberResult = "";

$(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userEmail = user.email;
            var userPhoto = user.photoURL;
            var userNameOfUser = user.displayName;
            var userUID = user.uid;
            if ($("#txtGuideEmail").length > 0 && $("#txtGuideName").length > 0) {
                startLoading();
                if (userEmail)
                    $("#txtGuideEmail").val(userEmail);
                if (userNameOfUser)
                    $("#txtGuideName").val(userNameOfUser);
                db.collection("GuideInfo").get().then((querySnapshot) => {
                    var mainData = {};
                    var foundEntry = false;
                    var foundData = {};
                    querySnapshot.forEach((doc) => {

                        // doc.data() is never undefined for query doc snapshots
                        //console.log(doc.id, " => ", doc.data());

                        mainData = doc.data();
                        arrayToSet = mainData.AgencyDetails;
                        for (var i = 0; i < arrayToSet.length; i++) {
                            if (arrayToSet[i].UID == userUID) {
                                foundData = arrayToSet[i];
                                $("#txtAgencyName").val(foundData.AgencyName);
                                $("#txtContact").val(foundData.Contact);
                                $("#txtAddress").val(foundData.Address);
                                $("#txtServiceLocation").val(foundData.ServiceLocation);
                                $("#txtbaseLocation").val(doc.id);
                                $("#txtGuideEmail").val(foundData.guideEmail);
                                $("#txtGuideName").val(foundData.GuideName);
                                foundEntry = true;
                                break;
                            }
                        }
                        if (foundEntry) {
                            $("#mainForm :input").attr("disabled", true);
                            $("#mainForm :button").attr("disabled", true);
                        } else {
                            $("#mainForm :input").attr("disabled", false);
                            $("#mainForm :button").attr("disabled", false);
                        }
                    });
                    stopLoading();
                }).catch((error) => {
                    console.log("Error getting documents: ", error);
                    stopLoading();
                });
            }

            if (userNameOfUser == null) {
                userNameOfUser = "New User";
            }

            if (userPhoto == null) {
                userPhoto = "./img/defuser.webp";
            }
            var userUIDOfUser = user.uid;
            $("#login").addClass("invisible");
            $("#Moblogin").addClass("invisible");
            $("#Username").removeClass("invisible");
            $("#MobUsername").removeClass("invisible");
            $("#Photo").removeClass("invisible");
            $("#MobPhoto").removeClass("invisible");
            $("#liLogout").removeClass("invisible");
            $("#MobliLogout").removeClass("invisible");
            $("#guidelogin").addClass("invisible");
            $("#Mobguidelogin").addClass("invisible");
            $("#Username").html("<a>" + userNameOfUser + "&nbsp;&nbsp;</a>");
            $("#MobUsername").html("<a>" + userNameOfUser + "&nbsp;&nbsp;</a>");
            $("#dpPhoto").attr("src", userPhoto).after("<i>&nbsp;</i>");
            $("#MobdpPhoto").attr("src", userPhoto).after("<i>&nbsp;</i>");
            var userType = $("#hdnUserType").val();
            if (userType == "guide") {
                document.location.href = "GuideDetails.html";
            }
        } else {
            $("#login").removeClass("invisible");
            $("#Moblogin").removeClass("invisible");
            $("#Username").addClass("invisible");
            $("#MobUsername").addClass("invisible");
            $("#Photo").addClass("invisible");
            $("#MobPhoto").addClass("invisible");
            $("#guidelogin").removeClass("invisible");
            $("#Mobguidelogin").removeClass("invisible");
            $("#Username").html("");
            $("#MobUsername").html("");
            $("#dpPhoto").attr("src", "");
            $("#MobdpPhoto").attr("src", "");
            $("#liLogout").addClass("invisible");
            $("#MobliLogout").addClass("invisible");
        }
    });
    $("#btnLogout").on("click", function () {
        logout();
    });
    $("#btnLogin").on("click", function () {
        login();
    });
    $("#MobbtnLogin").on("click", function () {
        login();
    });
    $("#btnGuideLogin").on("click", function () {
        guideSignIn();
    });
    $("#MobbtnGuideLogin").on("click", function () {
        guideSignIn();
    });
    $("#btnSubmitGuideDetails").on("click", function () {
        signUpGuide()
    });
    $("#btnCancelGuideDetails").on("click", function () {
        document.location.href = "/";
    });
    $("#btnSendOTP").on("click", function () {
        sendOTP();
    });
    $("#btnSignUpUsingNumber").on("click", function () {
        verifyOTPAndSignIn();
    });
    renderCaptcha();
});

function renderCaptcha() {
    window.recaptchaVerfier = new firebase.auth.RecaptchaVerifier('captchaContainer');


    recaptchaVerfier.render();
}

function logout() {
    firebase.auth().signOut();
    setInterval(() => {
        window.location.href = "index.html";
    }, 500);
}

function login() {
    $("#hdnUserType").val("user");
    Swal.fire({
        title: 'Login',
        html: `<a id="btnSignInGoogle" class="genric-btn success radius" style='cursor:pointer' onclick="signInGoogle()">Google <i class='fa fa-google'></i></a>` +
            `<p>or<br><button type='button' class='btn btn-primary' onclick='signInUsingPhoneNumber()'>Sign In Using Phone</button>`,
        confirmButtonText: 'Sign in',
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        focusConfirm: false,
    });
}

function signInFacebook() {
    Swal.close();
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            var user = result.user;
            if (user) {
                var userEmail = user.Email;
                $("#login").addClass("invisible");
                $("#Moblogin").addClass("invisible");
                $("#Username").removeClass("invisible");
                $("#MobUsername").removeClass("invisible");
                $("#Photo").removeClass("invisible");
                $("#MobPhoto").removeClass("invisible");
            }
            var accessToken = credential.accessToken;
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
}

function signInGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            Swal.close();
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            var token = credential.accessToken;
            var user = result.user;
        }).catch((error) => {
            Swal.close();
            var errorCode = error.code;
            var errorMessage = error.message;
            var email = error.email;
            var credential = error.credential;
        });
}

function guideSignIn() {
    $("#hdnUserType").val("guide");
    Swal.close();
    Swal.fire({
        title: 'Guide Login',
        html: `<a id="btnSignInGoogle" class="genric-btn success radius" style='cursor:pointer' onclick="signInGoogle()">Google <i class='fa fa-google'></i></a>` +
            `<p>or<br><button type='button' class='btn btn-primary' onclick='signInUsingPhoneNumber()'>Sign In Using Phone</button>`,
        confirmButtonText: 'Sign in',
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        focusConfirm: false,
    });
}

function signUpGuide() {
    startLoading();
    var userEmail = "";
    var userNameOfUser = "";
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userUID = user.uid;
            var t_AgencyName = $("#txtAgencyName").val();
            var t_Contact = $("#txtContact").val();
            var t_Address = $("#txtAddress").val();
            var t_ServiceLocation = $("#txtServiceLocation").val();
            var isError = false;
            var txtbaseLocation = $("#txtbaseLocation").val();
            userEmail = $("#txtGuideEmail").val();
            userNameOfUser = $("#txtGuideName").val();
            var errorMsg = "";

            if (txtbaseLocation == "" || txtbaseLocation == null) {
                isError = true;
                errorMsg += " Base Location "
            }
            if (t_AgencyName == "" || t_AgencyName == null) {
                isError = true;
                errorMsg += " Agency Name "
            }
            if (t_Contact == "" || t_Contact == null) {
                isError = true;
                errorMsg += "Contact "
            }
            if (t_Address == "" || t_Address == null) {
                isError = true;
                errorMsg += " Address "
            }
            if (t_ServiceLocation == "" || t_ServiceLocation == null) {
                isError = true;
                errorMsg += " ServiceLocation "
            }
            if (userEmail == "" || userEmail == null) {
                isError = true;
                errorMsg += " Name Of Guide "
            }
            if (userNameOfUser == "" || userNameOfUser == null) {
                isError = true;
                errorMsg += " User Email "
            }

            errorMsg += " is/are compulsory Fields";
            if (isError) {
                stopLoading();
                Swal.fire(
                    'Oops!',
                    errorMsg,
                    'error'
                )

            } else {
                db.collection("GuideInfo").get().then((querySnapshot) => {
                    var mainCount = true;
                    var mainData = {};
                    var foundEntry = true;
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        //console.log(doc.id, " => ", doc.data());
                        if (doc.id == txtbaseLocation) {
                            mainCount = false;
                            mainData = doc.data();
                            arrayToSet = mainData.AgencyDetails;
                            for (var i = 0; i < arrayToSet.length; i++) {
                                if (arrayToSet[i].UID == userUID) {
                                    foundEntry = false;
                                    break;
                                }
                            }
                            if (foundEntry)
                                arrayToSet.push({
                                    AgencyName: t_AgencyName,
                                    Contact: t_Contact,
                                    Address: t_Address,
                                    ServiceLocation: t_ServiceLocation,
                                    guideEmail: userEmail,
                                    GuideName: userNameOfUser,
                                    UID: userUID
                                });
                            else
                                toast("Data Already Present", "info");
                        }
                    });
                    if (mainCount) {
                        arrayToSet = [];
                        arrayToSet.push({
                            AgencyName: t_AgencyName,
                            Contact: t_Contact,
                            Address: t_Address,
                            ServiceLocation: t_ServiceLocation,
                            guideEmail: userEmail,
                            GuideName: userNameOfUser,
                            UID: userUID
                        });
                        mainData.AgencyDetails = arrayToSet;
                    }
                    if (foundEntry) {
                        // Add a new document with a generated id.
                        db.collection("GuideInfo").doc(txtbaseLocation).set(mainData).then(() => {
                            stopLoading();
                            Swal.fire('Success!', 'Details Saved', 'success')
                            setInterval(() => {
                                window.location.href = window.location.href;
                            }, 1000);
                        }).catch((error) => {
                            console.error("Error writing document: ", error);
                            stopLoading();
                        });
                    }
                }).catch((error) => {
                    stopLoading();
                    console.log("Error getting documents: ", error);
                });
            }
        } else {
            Swal.fire('Oops!', 'Please Login', 'error')
        }
    });
}

function signInUsingPhoneNumber() {
    Swal.close();
    $("#divSignInWithNumber").removeClass("invisible");
}

function sendOTP() {
    const number = getPhoneNumberFromUserInput();
    if (number) {
        firebase.auth().signInWithPhoneNumber(number, window.recaptchaVerfier).then(function (confirmationResult) {
            window.confirmationResult = confirmationResult;
            firebaseNumberResult = confirmationResult;
            console.log(confirmationResult);
            toast("OTP Sent", "success");
        }).catch(function (error) {
            toast(error, "error");
        });
    } else {
        toast("Number cannot be empty", "error");
    }
}

function verifyOTPAndSignIn() {
    const OTP = getOTPUserInput();
    if (OTP)
        firebaseNumberResult.confirm(OTP).then(function (result) {
            toast("Sign In Success", "success");

            var user = result.user;
            setInterval(() => {
                window.location.href = window.location.href;
            }, 500);
        }).catch(function (error) {
            toast(error, "error");
        })
    else
        toast("OTP Cannot be empty", "error")
}

function getPhoneNumberFromUserInput() {
    if ($("#txtPhoneNumber").val()) {
        $("#txtPhoneNumber").val($("#txtPhoneNumber").val().replace("+91", ""));
        return "+91" + $("#txtPhoneNumber").val();
    } else
        return null;
}

function getOTPUserInput() {
    if ($("#txtOTP").val())
        return $("#txtOTP").val();
    else
        return null;
}

function toast(msg, icon) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'bottom',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })

    Toast.fire({
        icon: icon,
        title: msg
    })
}

function startLoading() {
    $("#loading").removeClass("invisible");
}

function stopLoading() {
    $("#loading").addClass("invisible");
}