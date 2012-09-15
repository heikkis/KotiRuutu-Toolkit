// Version 3.4 to next version compatible
$(document).ready(function() {

    initRecLocalStorageFirstTime();

    // Move DB to other location and format
    if (localStorage.searchStrings != undefined) {

        var db = JSON.parse(localStorage.searchStrings);
        $.each(db.data, function(index, value) {
            var newRec = KotiruutuRecording.createRec(null, value, "", "", "", null);
            KotiRuutuToolKit.saveSearch(newRec);
        });

        localStorage.removeItem("searchStrings");
    }

});

// Versiopäivityksessä näytetään 
$(document).ready(function() {
    
    var currentVersion = '4.3';
    
    if (localStorage.kotiruutu_version == undefined) {
        localStorage.kotiruutu_version = 'unknown';
    } else if(localStorage.kotiruutu_version != currentVersion){ 

        localStorage.kotiruutu_version = currentVersion;
        javascript:window.open("https://chrome.google.com/webstore/detail/gjnnfkfoimamklobleonfphoijeogimh?hl=fi");
    }
});