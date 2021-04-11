$(() => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            getLatestBookingData(user);
        } else {
            alertAndRedirect("Please Sign in to view bookings", "index.html");
        }
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
            var AllBookings = querySnapshot.data();
            AllBookings = AllBookings.BookingDetails;
            if (AllBookings)
                if (AllBookings.length > 0)
                    AllBookings.forEach((item) => {
                        if (item)
                            console.log(JSON.stringify(item));
                        else
                            console.log("No data Found");
                    });
        } else {
            var NoDataFoundHTML = '<h3 class="headerFont">No Bookings Made Yet</h3>';
            $("#divViewBookings").html(NoDataFoundHTML);
        }
    });
}