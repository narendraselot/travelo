"use strict";$(function(){var a=window.location.href,r=new URL(a).searchParams.get("loc");$("#aTagYatra").attr("href",CurrentLocationURLs_Yatra[r]),$("#aTagTrivago").attr("href",CurrentLocationURLs_Trivago[r]),$("#aTagOyo").attr("href",CurrentLocationURLs_OYO[r])});