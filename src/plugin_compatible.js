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