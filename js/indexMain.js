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

$(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userEmail = user.email;
            var userPhoto = user.photoURL;
            var userNameOfUser = user.displayName;
            var userUIDOfUser = user.uid;
            $("#login").addClass("invisible");
            $("#Username").removeClass("invisible");
            $("#Photo").removeClass("invisible");
            $("#liLogout").removeClass("invisible");
            $("#guidelogin").addClass("invisible");
            $("#Username").html("<a>" + userNameOfUser + "</a>")
            $("#dpPhoto").attr("src", userPhoto);
            var userType = $("#hdnUserType").val();

            if (userType == "guide") {
                document.location.href = "GuideDetails.html";
            }
        } else {
            $("#login").removeClass("invisible");
            $("#Username").addClass("invisible");
            $("#Photo").addClass("invisible");
            $("#guidelogin").removeClass("invisible");
            $("#Username").html("")
            $("#dpPhoto").attr("src", "");
            $("#liLogout").addClass("invisible");
        }
    });

    $("#btnLogout").on("click", function () {
        logout();
    });

    $("#btnLogin").on("click", function () {
        login();
    });

    $("#btnGuideLogin").on("click", function () {
        guideSignIn();
    });

    $("#btnSubmitGuideDetails").on("click", function () {
        signUpGuide()
    })
    $("#btnCancelGuideDetails").on("click", function () {
        document.location.href = "/";
    })

});

function logout() {
    firebase.auth().signOut();
}

function login() {
    $("#hdnUserType").val("user");
    Swal.fire({
        title: 'Login',
        html: `<a id="btnSignInGoogle" class="genric-btn success radius" style='cursor:pointer' onclick="signInGoogle()">Google <i class='fa fa-google'></i></a>`,
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
                $("#login").addClass("invisible")
                $("#Username").removeClass("invisible")
                $("#Photo").removeClass("invisible")
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
        html: `<a id="btnSignInGoogle" class="genric-btn success radius" style='cursor:pointer' onclick="signInGoogle()">Google <i class='fa fa-google'></i></a>`,
        confirmButtonText: 'Sign in',
        showCloseButton: true,
        showCancelButton: true,
        showConfirmButton: false,
        focusConfirm: false,
    });
}

function signUpGuide() {
    var userEmail = "";
    var userNameOfUser = "";
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            userEmail = user.email;
            userNameOfUser = user.displayName;

            var t_AgencyName = $("#txtAgencyName").val();
            var t_Contact = $("#txtContact").val();
            var t_Address = $("#txtAddress").val();
            var t_ServiceLocation = $("#txtServiceLocation").val();
            var isError = false;
            var txtbaseLocation = $("#txtbaseLocation").val();

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
            errorMsg += " is/are compulsory Fields";

            if (isError) {
                Swal.fire(
                    'Oops!',
                    errorMsg,
                    'error'
                )
            } else {
                // Add a new document with a generated id.
                db.collection("GuideInfo").doc(txtbaseLocation).set({
                        AgencyName: t_AgencyName,
                        Contact: t_Contact,
                        Address: t_Address,
                        ServiceLocation: t_ServiceLocation,
                        guideEmail: userEmail,
                        GuideName: userNameOfUser
                    })
                    .then(() => {
                        Swal.fire(
                            'Success!',
                            'Details Saved',
                            'success'
                        )
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            }
        } else {
            Swal.fire(
                'Oops!',
                'Please Login',
                'error'
            )
        }
    });

}