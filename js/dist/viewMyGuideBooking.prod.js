"use strict";function alertAndRedirect(t,e){toast(t,"info"),setInterval(function(){window.location.href=e},2e3)}function getLatestBookingData(t){var l=t.uid;db.collection("Booking").get().then(function(t){var o,a,e;0<t.size?(a=!(o=" <table><tbody>"),t.forEach(function(t){$("#tblBookedGuideHead").html(""),$("#tblBookedGuideBody").html("");var e=t.data();(e=e.BookingDetails)&&0<e.length&&($(".limiter").removeClass("invisible"),e.forEach(function(t){t?t.UID==l&&(a=!0,console.log(JSON.stringify(t)),o+='<tr class="row100 body"><td class="cell100 column1">'+t.CustomerName+'</td><td class="cell100 column2">'+t.ServiceLocation+'</td><td class="cell100 column3">'+t.BookedDate+"</td></tr>"):($(".limiter").addClass("invisible"),$("#divViewBookings").html('<h3 class="headerFont">No Bookings Made Yet</h3><br><img src="img/Empty.svg" draggable="false" style="height:250px;width:250px;"/>'),console.log("No data Found"))}))}),o+='</tbody> </table> <div class="ps__rail-x" style="left: 0px; bottom: 0px;">   <div class="ps__thumb-x" tabindex="0" style="left: 0px; width: 0px;"></div> </div>',a?($("#divViewBookings").html(null),$("#tblBookedGuideHead").html('<table><thead>   <tr class="row100 head">       <th class="cell100 column1">Customer Name</th>       <th class="cell100 column2">Service Location</th>       <th class="cell100 column3">Booked Date</th>   </tr></thead></table>'),$("#tblBookedGuideBody").html(o)):($(".limiter").addClass("invisible"),e='<h3 class="headerFont">No Bookings Made Yet</h3><br><img src="img/Empty.svg" draggable="false" style="height:250px;width:250px;"/>',$("#divViewBookings").html(e),console.log("No data Found"))):($("#tblBookedGuideHead").html(""),$("#tblBookedGuideBody").html(""),$(".limiter").addClass("invisible"),e='<h3 class="headerFont">No Bookings Made Yet</h3><br><img src="img/Empty.svg" draggable="false" style="height:250px;width:250px;"/>',$("#divViewBookings").html(e))})}$(function(){firebase.auth().onAuthStateChanged(function(t){t?getLatestBookingData(t):alertAndRedirect("Please Sign in to view bookings","index.html")}),$(".column100").on("mouseover",function(){var t=$(this).parent().parent().parent(),e=$(this).parent().parent(),o=$(t).data("vertable")+"",a=$(this).data("column")+"";$(e).find("."+a).addClass("hov-column-"+o),$(t).find(".row100.head ."+a).addClass("hov-column-head-"+o)}),$(".column100").on("mouseout",function(){var t=$(this).parent().parent().parent(),e=$(this).parent().parent(),o=$(t).data("vertable")+"",a=$(this).data("column")+"";$(e).find("."+a).removeClass("hov-column-"+o),$(t).find(".row100.head ."+a).removeClass("hov-column-head-"+o)})});