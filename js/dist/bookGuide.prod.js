"use strict";function getAllGuides(){$("#tableListForGuide").html(null),db.collection("GuideInfo").get().then(function(t){var i={},a={},o="<tbody id='myTable'>";t.forEach(function(t){o+='<tr><td><div id="accordion'+String(t.id)+'"><div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#collapseOne'+String(t.id)+'">'+String(t.id)+'</a></div><div id="collapseOne'+String(t.id)+'" class="collapse" data-parent="#accordion'+String(t.id)+'"><div class="card-body">',o+='<div class="table-responsive"><table class="table table-bordered" id="tableListForGuideInternal'+String(t.id)+'"> ',o+="<thead><tr><th>Agency Name</th><th>Address</th><th>Details</th></tr></thead><tbody>",i=t.data(),arrayToSet=i.AgencyDetails;for(var e=0;e<arrayToSet.length;e++)a=arrayToSet[e],o+="<tr>",o+="<td>"+a.AgencyName+"</td>",o+="<td>"+a.Address+"</td>",o+="<td><button class='btn btn-info' onclick='showGuideDetils(this)' id='btnViewDetails"+String(t.id+e)+"' data-UID='"+a.UID+"' data-allDetails='"+JSON.stringify(a)+"' type='button'>View Details &nbsp;<i class='fa fa-info'></i></button></td>",o+="</tr>";o+="<tbody></table></div>",o+="</div></div></div> </div></td></tr>"}),o+="</tbody>",$("#tableListForGuide").html("<thead><tr><th>City</th></tr></thead>"+o)}).catch(function(t){console.log("Error getting documents: ",t),stopLoading()})}function showGuideDetils(t){var e=JSON.parse($(t).attr("data-allDetails")),i="<div class='row' id='rowForDetails'><input type='hidden' value='"+String($(t).attr("data-UID"))+"' id='hdnGuideID'>",a=String(JSON.stringify(e));i+="<input type='hidden' value='"+a+"' id='hdnAllDetails'>",$.each(e,function(t,e){t&&"UID"!=String(t)&&(i+='<div class="col-sm-12 col-lg-12 col-md-12" style="padding:3px;margin:3px;width:100%;"><button style="width:100%;"  type="button" class="btn btn-primary text-left">'+t+' : &nbsp;<span class="badge badge-light">'+e+"</span></button></div>")}),i+="</div>",Swal.fire({title:"<strong>Guide Details</strong>",icon:"info",html:i,showCloseButton:!0,showCancelButton:!0,focusConfirm:!1,didRender:function(){0<$(".datepicker").length&&$(".datepicker").remove(),$('<div class="row text-center"><div class="col-sm-12 col-lg-12 col-md-12 text-center" style="margin:3px;"><input type="text" placeholder="Select Date" class="form-input datepicker" style="width:100% !important;overflow:visible;"/></div></div>').insertAfter("#rowForDetails"),$(".datepicker").datepicker({format:"mm/dd/yyyy",startDate:"-3d"})},confirmButtonText:'<i class="fa fa-thumbs-up"></i> Book Guide!',cancelButtonText:'<i class="fa fa-thumbs-down"></i> Cancel',preConfirm:function(){Swal.showLoading()},willClose:function(){bookGuideSendToFirebase()}})}function bookGuideSendToFirebase(){var d,t;null==$(".datepicker").val()||""==$(".datepicker").val()||null==$(".datepicker").val()?(Swal.hideLoading(),Swal.showValidationMessage("Please select a valid date")):(d=JSON.parse($("#hdnAllDetails").val()),t=$(".datepicker").val(),d.BookedDate=t,firebase.auth().onAuthStateChanged(function(t){var n;t?(n=t.uid,db.collection("Booking").doc(n).get().then(function(t){var e,i,a,o;t.exists?(i=(e=t.data()).BookingDetails,d.UserId=n,i.push(d),e.BookingDetails=i,db.collection("Booking").doc(n).set(e).then(function(){Email.send({SecureToken:"8d4f68cb-5259-4e47-a3a2-dd219901e043",To:d.guideEmail,From:"tooristguide@gmail.com",Subject:"Hey a new User just booked you as a guide!",Body:"Hola Guide,<br> \n New Booking has arrived, please login to your Tourist Guide Account or refer this link : https://touristguide.netlify.com"}).then(function(t){console.log(t),Swal.hideLoading(),Swal.fire("Guide Booked!","","success")})}).catch(function(t){Swal.hideLoading(),Swal.fire("Oops! Something Went Wrong "+t,"","error")})):(a=[],d.UserId=n,a.push(d),(o={}).BookingDetails=a,db.collection("Booking").doc(n).set(o).then(function(){Swal.hideLoading(),Swal.fire("Guide Booked!","","success")}).catch(function(t){Swal.hideLoading(),Swal.fire("Oops! Something Went Wrong "+t,"","error")}))}).catch(function(t){console.log("Error getting documents: ",t),Swal.hideLoading(),Swal.showValidationMessage("Error Occured")})):(Swal.hideLoading(),Swal.showValidationMessage("Please Login to Book Guide"))}))}$(function(){getAllGuides(),$("#txtSearchTable").on("input",function(){var t=$(this).val().toLowerCase();$("#tableListForGuide tr").filter(function(){$(this).toggle(-1<$(this).text().toLowerCase().indexOf(t))})})});