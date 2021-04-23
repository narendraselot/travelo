$(() => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            getLatestBookingData(user);
        } else {
            alertAndRedirect("Please Sign in to view bookings", "index.html");
        }
    });

    "use strict";
    $('.column100').on('mouseover', function () {
        var table1 = $(this).parent().parent().parent();
        var table2 = $(this).parent().parent();
        var verTable = $(table1).data('vertable') + "";
        var column = $(this).data('column') + "";
        $(table2).find("." + column).addClass('hov-column-' + verTable);
        $(table1).find(".row100.head ." + column).addClass('hov-column-head-' + verTable);
    });
    $('.column100').on('mouseout', function () {
        var table1 = $(this).parent().parent().parent();
        var table2 = $(this).parent().parent();
        var verTable = $(table1).data('vertable') + "";
        var column = $(this).data('column') + "";
        $(table2).find("." + column).removeClass('hov-column-' + verTable);
        $(table1).find(".row100.head ." + column).removeClass('hov-column-head-' + verTable);
    });
});

function alertAndRedirect(msg, redirectURL) {
    toast(msg, "info");
    setInterval(() => {
        window.location.href = redirectURL;
    }, 2000);
}

function getLatestBookingData(user) {
    var userID = user.uid;
    db.collection("Booking").doc(userID).get().then((querySnapshot) => {
        if (querySnapshot.exists) {
            $("#tblBookedGuideHead").html("");
            $("#tblBookedGuideBody").html("");
            var AllBookings = querySnapshot.data();
            AllBookings = AllBookings.BookingDetails;
            if (AllBookings)
                if (AllBookings.length > 0) {
                    if (window.matchMedia("(max-width: 767px)").matches) {
                        var tblHead = '<div class="table-responsive"><table class="table table-dark table-striped table-sm table-bordered">' +
                            '<thead>' +
                            '   <tr class="row100 head">' +
                            '       <th class="cell100 column1">Agency Name</th>' +
                            '       <th class="cell100 column2">Contact</th>' +
                            '       <th class="cell100 column3">Location</th>' +
                            '       <th class="cell100 column4">Date</th>' +
                            '       <th class="cell100 column5">Email</th>' +
                            '   </tr>' +
                            '</thead>';

                        var tblBody = "<tbody>";

                        AllBookings.forEach((item) => {
                            if (item) {
                                console.log(JSON.stringify(item));
                                tblBody += '<tr class="row100 body">' +
                                    '<td class="cell100 column1">' + item.AgencyName + '</td>' +
                                    '<td class="cell100 column2">' + item.Contact + '</td>' +
                                    '<td class="cell100 column3">' + item.ServiceLocation + '</td>' +
                                    '<td class="cell100 column4">' + item.BookedDate + '</td>' +
                                    '<td class="cell100 column5">' + item.guideEmail + '</td>' +
                                    '</tr>';
                            } else {
                                $(".limiter").addClass("invisible");
                                var NoDataFoundHTML = '<h3 class="headerFont">No Bookings Made Yet</h3><br><img src="img/Empty.svg" draggable="false" style="height:250px;width:250px;"/>';
                                $("#divViewBookings").html(NoDataFoundHTML);
                                console.log("No data Found");
                            }
                        });
                        tblBody += ' </tbody>' +
                            ' </table>' +
                            ' </div>';
                        $("#divMobileTable").html(tblHead + tblBody);
                    } else {
                        $(".limiter").removeClass("invisible");
                        var tblHead = '<table>' +
                            '<thead>' +
                            '   <tr class="row100 head">' +
                            '       <th class="cell100 column1">Agency Name</th>' +
                            '       <th class="cell100 column2">Contact</th>' +
                            '       <th class="cell100 column3">Location</th>' +
                            '       <th class="cell100 column4">Date</th>' +
                            '       <th class="cell100 column5">Email</th>' +

                            '   </tr>' +
                            '</thead>' +
                            '</table>';

                        var tblBody = " <table><tbody>";

                        AllBookings.forEach((item) => {
                            if (item) {
                                console.log(JSON.stringify(item));
                                tblBody += '<tr class="row100 body">' +
                                    '<td class="cell100 column1">' + item.AgencyName + '</td>' +
                                    '<td class="cell100 column2">' + item.Contact + '</td>' +
                                    '<td class="cell100 column3">' + item.ServiceLocation + '</td>' +
                                    '<td class="cell100 column4">' + item.BookedDate + '</td>' +
                                    '<td class="cell100 column5">' + item.guideEmail + '</td>' +
                                    '</tr>';
                            } else {
                                $(".limiter").addClass("invisible");
                                var NoDataFoundHTML = '<h3 class="headerFont">No Bookings Made Yet</h3><br><img src="img/Empty.svg" draggable="false" style="height:250px;width:250px;"/>';
                                $("#divViewBookings").html(NoDataFoundHTML);
                                console.log("No data Found");
                            }
                        });
                        tblBody += ' </tbody>' +
                            ' </table>' +
                            ' <div class="ps__rail-x" style="left: 0px; bottom: 0px;">' +
                            '   <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div>' +
                            ' </div>';

                        $("#tblBookedGuideHead").html(tblHead);
                        $("#tblBookedGuideBody").html(tblBody);
                    }
                }
        } else {
            $("#tblBookedGuideHead").html("");
            $("#tblBookedGuideBody").html("");
            $(".limiter").addClass("invisible");
            var NoDataFoundHTML = '<h3 class="headerFont">No Bookings Made Yet</h3><br><img src="img/Empty.svg" draggable="false" style="height:250px;width:250px;"/>';
            $("#divViewBookings").html(NoDataFoundHTML);
        }
    });
}