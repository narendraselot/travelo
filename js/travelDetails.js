$(function () {
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var loc = url.searchParams.get("loc");

    $("#aTagYatra").attr("href", CurrentLocationURLs_Yatra[loc]);
    $("#aTagTrivago").attr("href", CurrentLocationURLs_Trivago[loc]);
    $("#aTagOyo").attr("href", CurrentLocationURLs_OYO[loc]);
    $("#txtDesc").html("<p>" + CurrentLocationURLs_Desc[loc] + "</p>");
    $("#txtLocation").html(CurrentLocationURLs_Name[loc]);
    $(".destination_banner_wrap").attr("style", "background-image:url(" + String(CurrentLocationURLs_IMG[loc]) + ") !important");
});