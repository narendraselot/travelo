"use strict";function searchTable(){for(var e,t=document.getElementById("txtSearchTable").value.toUpperCase(),i=document.getElementById("tableListForGuide").getElementsByTagName("tr"),a=0;a<i.length;a++)(e=i[a].getElementsByTagName("td")[0])&&(-1<(e.textContent||e.innerText||e.innerHTML).toUpperCase().indexOf(t)?i[a].style.display="":i[a].style.display="none")}function getAllGuides(){$("#tableListForGuide").html(null),db.collection("GuideInfo").get().then(function(e){var i={},a={},o="<tbody id='myTable'>";e.forEach(function(e){o+='<tr><td><div id="accordion'+String(e.id)+'"><div class="card"><div class="card-header"><a class="card-link" data-toggle="collapse" href="#collapseOne'+String(e.id)+'">'+String(e.id)+'</a></div><div id="collapseOne'+String(e.id)+'" class="collapse" data-parent="#accordion'+String(e.id)+'"><div class="card-body">',o+='<div class="table-responsive"><table class="table table-bordered" id="tableListForGuideInternal'+String(e.id)+'"> ',o+="<thead><tr><th>Agency Name</th><th>Address</th><th>Details</th></tr></thead><tbody>",i=e.data(),arrayToSet=i.AgencyDetails;for(var t=0;t<arrayToSet.length;t++)a=arrayToSet[t],o+="<tr>",o+="<td>"+a.AgencyName+"</td>",o+="<td>"+a.Address+"</td>",o+="<td><button class='btn btn-info' onclick='showGuideDetils(this)' id='btnViewDetails"+String(e.id+t)+"' data-UID='"+a.UID+"' data-allDetails='"+JSON.stringify(a)+"' type='button'>View Details &nbsp;<i class='fa fa-info'></i></button></td>",o+="</tr>";o+="<tbody></table></div>",o+="</div></div></div> </div></td></tr>"}),o+="</tbody>",$("#tableListForGuide").html("<thead><tr><th>City</th></tr></thead>"+o)}).catch(function(e){console.log("Error getting documents: ",e),stopLoading()})}function showGuideDetils(e){var t=JSON.parse($(e).attr("data-allDetails")),i="<div class='row' id='rowForDetails'><input type='hidden' value='"+String($(e).attr("data-UID"))+"' id='hdnGuideID'>",a=String(JSON.stringify(t));i+="<input type='hidden' value='"+a+"' id='hdnAllDetails'>",$.each(t,function(e,t){e&&"UID"!=String(e)&&(i+='<div class="col-sm-12 col-lg-12 col-md-12" style="padding:3px;margin:3px;width:100%;"><button style="width:100%;"  type="button" class="btn btn-primary text-left">'+e+' : &nbsp;<span class="badge badge-light">'+t+"</span></button></div>")}),i+="</div>",Swal.fire({title:"<strong>Guide Details</strong>",icon:"info",html:i,showCloseButton:!0,showCancelButton:!0,focusConfirm:!1,didRender:function(){0<$(".datepicker").length&&$(".datepicker").remove(),$('<div class="row text-center"><div class="col-sm-12 col-lg-12 col-md-12 text-center" style="margin:3px;"><input type="text" placeholder="Select Date" class="form-input datepicker" style="width:100% !important;overflow:visible;"/></div><div class="col-sm-12 col-lg-12 col-md-12 text-center" style="margin:3px;"><input type="text" id="txtCustomerName" placeholder="Full Name" class="swal2-input" style="width:100% !important;overflow:visible;"/></div></div>').insertAfter("#rowForDetails"),$(".datepicker").datepicker({format:"mm/dd/yyyy",startDate:"-3d"})},confirmButtonText:'<i class="fa fa-thumbs-up"></i> Book Guide!',cancelButtonText:'<i class="fa fa-thumbs-down"></i> Cancel',preConfirm:function(){null==$(".datepicker").val()||""==$(".datepicker").val()||null==$(".datepicker").val()||null==$("#txtCustomerName").val()||""==$("#txtCustomerName").val()||null==$("#txtCustomerName").val()?(Swal.hideLoading(),Swal.showValidationMessage("Please select a valid date & Name")):(Swal.showLoading(),bookGuideSendToFirebase($("#txtCustomerName").val()))}})}function bookGuideSendToFirebase(l){var d,e;null!=$(".datepicker").val()&&""!=$(".datepicker").val()&&null!=$(".datepicker").val()||null!=l&&""!=l&&null!=l?(d=JSON.parse($("#hdnAllDetails").val()),e=$(".datepicker").val(),d.BookedDate=e,firebase.auth().onAuthStateChanged(function(e){var n;e?(n=e.uid,db.collection("Booking").doc(n).get().then(function(e){var t,i,a,o;0<e.size?e.exists?(i=(t=e.data()).BookingDetails,d.UserId=n,d.CustomerName=l,i.push(d),t.BookingDetails=i,db.collection("Booking").doc(n).set(t).then(function(){Email.send({SecureToken:"8d4f68cb-5259-4e47-a3a2-dd219901e043",To:d.guideEmail,From:"tooristguide@gmail.com",Subject:"Hey a new User just booked you as a guide!",Body:"Hola Guide,<br> \n New Booking has arrived, please login to your Tourist Guide Account or refer this link : https://touristguide.netlify.com"}).then(function(e){console.log(e),Swal.hideLoading(),Swal.fire("Guide Booked!","","success")})}).catch(function(e){Swal.hideLoading(),Swal.fire("Oops! Something Went Wrong "+e,"","error")})):(a=[],d.UserId=n,d.CustomerName=l,a.push(d),(o={}).BookingDetails=a,db.collection("Booking").doc(n).set(o).then(function(){Email.send({SecureToken:"8d4f68cb-5259-4e47-a3a2-dd219901e043",To:d.guideEmail,From:"tooristguide@gmail.com",Subject:"Hey a new User just booked you as a guide!",Body:"Hola Guide,<br> \n New Booking has arrived, please login to your Tourist Guide Account or refer this link : https://touristguide.netlify.com"}).then(function(e){console.log(e),Swal.hideLoading(),Swal.fire("Guide Booked!","","success")})}).catch(function(e){Swal.hideLoading(),Swal.fire("Oops! Something Went Wrong "+e,"","error")})):(a=[],d.UserId=n,d.CustomerName=l,a.push(d),(o={}).BookingDetails=a,db.collection("Booking").doc(n).set(o).then(function(){Email.send({SecureToken:"8d4f68cb-5259-4e47-a3a2-dd219901e043",To:d.guideEmail,From:"tooristguide@gmail.com",Subject:"Hey a new User just booked you as a guide!",Body:"Hola Guide,<br> \n New Booking has arrived, please login to your Tourist Guide Account or refer this link : https://touristguide.netlify.com"}).then(function(e){console.log(e),Swal.hideLoading(),Swal.fire("Guide Booked!","","success")})}).catch(function(e){Swal.hideLoading(),Swal.fire("Oops! Something Went Wrong "+e,"","error")}))}).catch(function(e){console.log("Error getting documents: ",e),Swal.hideLoading(),Swal.showValidationMessage("Error Occured")})):(Swal.hideLoading(),Swal.showValidationMessage("Please Login to Book Guide"))})):(Swal.hideLoading(),Swal.showValidationMessage("Please select a valid date & Name"))}$(function(){getAllGuides(),$("#txtSearchTable").on("input",function(){searchTable()})});