"use strict";function alertAndRedirect(t,o){toast(t,"info"),setInterval(function(){window.location.href=o},2e3)}function getLatestBookingData(t){var o=t.uid;db.collection("Booking").doc(o).get().then(function(t){var o;t.exists?(o=(o=t.data()).BookingDetails)&&0<o.length&&o.forEach(function(t){t?console.log(JSON.stringify(t)):console.log("No data Found")}):$("#divViewBookings").html('<h3 class="headerFont">No Bookings Made Yet</h3>')})}$(function(){firebase.auth().onAuthStateChanged(function(t){t?getLatestBookingData(t):alertAndRedirect("Please Sign in to view bookings","index.html")})});