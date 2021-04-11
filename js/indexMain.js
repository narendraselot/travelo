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
    $("#txtLocationLatLong").val("");
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

    $("#searchLocation, #txtTopSearch").on("input", function () {
        var city = $(this).val();
        var tagID = $(this).attr("id");
        autoAddCities(tagID, city)
    });

    $("#btnLocationSearchOnMap").on("click", function () {
        // toast($("#txtLocationLatLong").val(), "info");
        if ($("#txtLocationLatLong").val())
            searchUsingLatLon();
        else
            toast("Oops, Please select a valid Location", "info");
    });
});

function searchUsingLatLon() {
    $("#iframeLocation").removeClass("invisible");
    $("#divWeather").removeClass("invisible");

    $("#iframeLocation").html('<iframe id="iframeWithCityMap" src="https://maps.google.com/maps?q=' + $("#txtLocationLatLong").val() + "+Hotels" + '&output=embed&query=Hotel+Tour&map_action=pano" class="responsive-iframe" style="border:0;" allowfullscreen="true" loading="lazy"></iframe>');
    getWeatherDetails($("#txtLocationLatLong").val());
}

function getWeatherDetails(CityWithCountry) {
    var city = CityWithCountry.split(',')[0];
    var weatherURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=f13e12d2bf352be97dfefa35c2e9faeb&units=metric&temp=Celsius";
    $.ajax({
        url: weatherURL,
        dataType: "json",
        data: "",
        success: function (data) {
            if (data) {
                // alert(JSON.stringify(data))
                //console.log(data);

                var feels_like = "";
                var humidity = "";
                var pressure = "";
                var temp = "";
                var temp_max = "";
                var temp_min = "";
                var weatherID = "";
                var main = "";
                var weatherDesc = "";
                var weatherIcon = "";
                var Wind = "";
                if (data.main) {
                    feels_like = data.main.feels_like;
                    humidity = data.main.humidity;
                    pressure = data.main.pressure;
                    temp = data.main.temp;
                    temp_max = data.main.temp_max;
                    temp_min = data.main.temp_min;
                }

                var WeatherArray = data.weather;
                if (data.wind) {
                    Wind = data.wind.speed;
                }

                if (WeatherArray)
                    if (WeatherArray.length > 0) {
                        weatherID = WeatherArray[0].id;
                        main = WeatherArray[0].main;
                        weatherDesc = WeatherArray[0].description;
                        weatherIcon = WeatherArray[0].icon;
                    }

                // var weatherHtml = '<div class="Wethcontainer d-flex justify-content-center">' +
                //     '<div class="Wethweather">' +
                //     '<div class="row">' +
                //     '       <div class="col-md-12">' +
                //     '           <div class="Wethcard">' +
                //     '               <span class="Wethicon">' +
                //     '                   <img class="img-fluid" src="http://openweathermap.org/img/wn/' + weatherIcon + '@2x.png" />' +
                //     '               </span>' +
                //     '               <div class="Wethtitle">' +
                //     '                   <p>' + city + '</p>' +
                //     '               </div>' +
                //     '               <div class="Wethtemp">' + feels_like + '<sup>&deg;</sup></div>' +
                //     '               <div class="row">' +
                //     '                   <div class="col-4">' +
                //     '                       <div class="Wethheader">Weather</div>' +
                //     '                       <div class="value">' + main + '</div>' +
                //     '                   </div>' +
                //     '                   <div class="col-4">' +
                //     '                       <div class="Wethheader">Humidity</div>' +
                //     '                       <div class="value">' + humidity + '</div>' +
                //     '                   </div>' +
                //     '                   <div class="col-4">' +
                //     '                       <div class="Wethheader">Pressure</div>' +
                //     '                       <div class="value">' + pressure + '</div>' +
                //     '                   </div>' +
                //     '               </div>' +
                //     '           </div>' +
                //     '       </div>' +
                //     '   </div>' +
                //     '</div>' +
                //     '</div>';


                var currentTime = new Date();
                var currentOffset = currentTime.getTimezoneOffset();
                var ISTOffset = 330; // IST offset UTC +5:30
                var ISTTime = new Date(currentTime.getTime() + (ISTOffset + currentOffset) * 60000);
                // ISTTime now represents the time in IST coordinates

                var hoursIST = ISTTime.getHours()
                var minutesIST = ISTTime.getMinutes()

                //document.write("<b>" + hoursIST + ":" + minutesIST + " " + "</b>")
                var weatherHtml = '<div class="container-fluid">' +
                    '<div class="row justify-content-center">' +
                    '   <div class="col-12 col-md-12 col-sm-12 col-xs-12">' +
                    '       <div class="card Wethcard p-4">' +
                    '           <div class="d-flex" style="font-family:Trebuchet MS !important;">' +
                    '               <h6 class="flex-grow-1">' + city + ' </h6>&nbsp;&nbsp;' +
                    '               <h6> ' + hoursIST + ' : ' + minutesIST + '</h6>' +
                    '           </div>' +
                    '           <div class="d-flex flex-column Wethtemp mt-5 mb-3">' +
                    '               <h1 class="mb-0 font-weight-bold" id="heading"> ' + feels_like + '° C </h1> ' +
                    '               <span class="small Wethgrey">' + main + '</span>' +
                    '           </div>' +
                    '           <div class="d-flex">' +
                    '               <div class="Wethtemp-details flex-grow-1">' +
                    '                   <p class="my-1"> <img src="https://i.imgur.com/B9kqOzp.png" height="17px"> <span> ' + Wind + ' mp/h' +
                    '                       </span> </p>' +
                    '                   <p class="my-1"> <i class="fa fa-tint mr-2" aria-hidden="true"></i> <span> ' + humidity + '% </span> </p>' +
                    '               </div>' +
                    '               <div> <img draggable="false" src="https://openweathermap.org/img/wn/' + weatherIcon + '@2x.png" width="100px"> </div>' +
                    '           </div>' +
                    '       </div>' +
                    '   </div>' +
                    '</div>' +
                    '</div>';

                //
                //iframeWithCityMap

                $("#divWeather").html(weatherHtml);
            }
        },
        error: function (error) {
            alert('error; ' + eval(error));
        }

    });
}

function autoAddCities(tag, city) {
    $("#txtLocationLatLong").val("");
    $("#iframeLocation").html(null);
    $("#iframeLocation").addClass("invisible");
    $("#divWeather").addClass("invisible");
    $("#divWeather").html(null);

    $("#" + tag).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: "https://secure.geobytes.com/AutoCompleteCity?key=7c756203dbb38590a66e01a5a3e1ad96&callback=?&q=" + city,
                dataType: "json",
                data: "",
                success: function (data) {
                    if (data)
                        response($.map(data, function (item) {
                            if (item != "%s" && item != null && item != undefined)
                                return {
                                    label: item,
                                    value: item,
                                    coordinates: item,
                                    country_name: item
                                };
                        }));
                }
            });
        },
        select: function (event, ui) {
            $("#" + tag).val(ui.item.label);
            $("#txtLocationLatLong").val(String(ui.item.coordinates));
            return false;
        }
    });
}

function renderCaptcha() {
    if ($("#captchaContainer").length)
        if ($("#captchaContainer").length > 0) {
            window.recaptchaVerfier = new firebase.auth.RecaptchaVerifier('captchaContainer');
            recaptchaVerfier.render();
        }
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