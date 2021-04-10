$(() => {
    getAllGuides();

    $("#txtSearchTable").on("input", function () {
        var value = $(this).val().toLowerCase();
        $("#tableListForGuide tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function getAllGuides() {
    $("#tableListForGuide").html(null);
    db.collection("GuideInfo").get().then((querySnapshot) => {
        var mainData = {};
        var foundEntry = false;
        var foundData = {};
        var tHead = "<thead><tr><th>City</th></tr></thead>";
        var tBody = "<tbody id='myTable'>";
        querySnapshot.forEach((doc) => {

            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            tBody += '<tr><td><div id="accordion' + String(doc.id) + '">' +
                '<div class="card">' +
                '<div class="card-header">' +
                '<a class="card-link" data-toggle="collapse" href="#collapseOne' + String(doc.id) + '">' +
                String(doc.id) +
                '</a>' +
                '</div>' +
                '<div id="collapseOne' + String(doc.id) + '" class="collapse" data-parent="#accordion' + String(doc.id) + '">' +
                '<div class="card-body">';


            tBody += '<div class="table-responsive">' +
                '<table class="table table-bordered" id="tableListForGuideInternal' + String(doc.id) + '"> ';

            tBody += "<thead>" +
                "<tr><th>Agency Name</th>" +
                "<th>Address</th>" +
                "<th>Details</th></tr>" +
                "</thead><tbody>";
            mainData = doc.data();
            arrayToSet = mainData.AgencyDetails;
            for (var i = 0; i < arrayToSet.length; i++) {
                foundData = arrayToSet[i];
                tBody += "<tr>";
                tBody += "<td>" + foundData.AgencyName + "</td>";
                tBody += "<td>" + foundData.Address + "</td>";
                tBody += "<td><button class='btn btn-info' onclick='showGuideDetils(this)' id='btnViewDetails" + String(doc.id + i) + "' data-UID='" + foundData.UID + "' data-allDetails='" + JSON.stringify(foundData) + "' type='button'>View Details &nbsp;<i class='fa fa-info'></i></button></td>";
                tBody += "</tr>";
            }
            tBody += '<tbody></table>' +
                '</div>';
            tBody += '</div>' +
                '</div>' +
                '</div> ' +
                '</div></td></tr>';

        });
        tBody += "</tbody>";

        $("#tableListForGuide").html(tHead + tBody);
    }).catch((error) => {
        console.log("Error getting documents: ", error);
        stopLoading();
    });
}

function showGuideDetils(obj) {
    var guideDetails = JSON.parse($(obj).attr("data-allDetails"));
    var guideUID = String($(obj).attr("data-UID"));
    var htmlBody = "<div class='row' id='rowForDetails'>" +
        "<input type='hidden' value='" + guideUID + "' id='hdnGuideID'>";
    var valueJSONDetails = String(JSON.stringify(guideDetails));
    htmlBody += "<input type='hidden' value='" + valueJSONDetails + "' id='hdnAllDetails'>";

    $.each(guideDetails, function (key, data) {
        if (key) {
            if (String(key) != "UID") {
                htmlBody += '<div class="col-sm-12 col-lg-12 col-md-12" style="padding:3px;margin:3px;width:100%;"><button style="width:100%;"  type="button" class="btn btn-primary text-left">' + key + ' : &nbsp;' +
                    '<span class="badge badge-light">' + data + '</span>' +
                    '</button></div>';
            }
        }
    });

    htmlBody += '</div>';
    Swal.fire({
        title: '<strong>Guide Details</strong>',
        icon: 'info',
        html: htmlBody,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        didRender: () => {
            if ($('.datepicker').length > 0)
                $('.datepicker').remove();

            $('<div class="row text-center">' +
                '<div class="col-sm-12 col-lg-12 col-md-12 text-center" style="margin:3px;">' +
                '<input type="text" placeholder="Select Date" class="form-input datepicker" style="width:100% !important;overflow:visible;"/>' +
                '</div></div>').insertAfter("#rowForDetails");

            $('.datepicker').datepicker({
                format: 'mm/dd/yyyy',
                startDate: '-3d'
            });
        },
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Book Guide!',
        cancelButtonText: '<i class="fa fa-thumbs-down"></i> Cancel',
        preConfirm: () => {
            Swal.showLoading();
        },
        willClose: () => {
            bookGuideSendToFirebase();
        }
    });
    // guideDetails.GuideName
    // guideDetails.Contact
    // guideDetails.Address
    // guideDetails.ServiceLocation
    // guideDetails.guideEmail
}

function bookGuideSendToFirebase() {
    if ($('.datepicker').val() == null || $('.datepicker').val() == "" || $('.datepicker').val() == undefined) {
        Swal.hideLoading();
        Swal.showValidationMessage(`Please select a valid date`);
    } else {
        var setValue = JSON.parse($("#hdnAllDetails").val());
        var date = $('.datepicker').val()
        setValue.BookedDate = date;

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                var userUID = user.uid;
                db.collection("Booking").doc(userUID).get().then((querySnapshot) => {
                    if (querySnapshot.exists) {
                        var BookingData = querySnapshot.data();
                        var settingArray = BookingData.BookingDetails;
                        setValue.UserId = userUID;
                        settingArray.push(setValue);
                        BookingData.BookingDetails = settingArray;
                        db.collection("Booking").doc(userUID).set(BookingData).then(() => {
                            Email.send({
                                SecureToken: "8d4f68cb-5259-4e47-a3a2-dd219901e043",
                                To: setValue.guideEmail,
                                From: "tooristguide@gmail.com",
                                Subject: "Hey a new User just booked you as a guide!",
                                Body: "Hola Guide,<br> \n New Booking has arrived, please login to your Tourist Guide Account or refer this link : https://touristguide.netlify.com",
                            }).then(function (message) {
                                console.log(message);
                                Swal.hideLoading();
                                Swal.fire('Guide Booked!', '', 'success');
                            });
                        }).catch((error) => {
                            Swal.hideLoading();
                            Swal.fire('Oops! Something Went Wrong ' + error, '', 'error');
                        });
                    } else {
                        var newArray = [];
                        setValue.UserId = userUID;
                        newArray.push(setValue)
                        var valueToUpload = {};
                        valueToUpload.BookingDetails = newArray;

                        db.collection("Booking").doc(userUID).set(valueToUpload).then(() => {
                            Swal.hideLoading();
                            Swal.fire('Guide Booked!', '', 'success')
                        }).catch((error) => {
                            Swal.hideLoading();
                            Swal.fire('Oops! Something Went Wrong ' + error, '', 'error')
                        });
                    }
                }).catch((error) => {
                    console.log("Error getting documents: ", error);
                    Swal.hideLoading();
                    Swal.showValidationMessage(`Error Occured`);
                });
            } else {
                Swal.hideLoading();
                Swal.showValidationMessage(`Please Login to Book Guide`);
            }
        });
    }
}