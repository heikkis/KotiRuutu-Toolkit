var KR_SEARCHSTRING = 0;
var KR_BEGINTIME = 1;
var KR_DURATIONINMIN = 2;
var KR_CHANNEL = 3;
var KR_WEEKDAYS = 4;
var KR_ID = 5;

var KotiruutuRecording = {
    createRec : function(id, searchString, beginTime, durationInMin, channel, weekdays) {

        var rec = new Array();

        // search string
        rec[KR_SEARCHSTRING] = searchString.toLowerCase();

        // "" or clock time for begin
        rec[KR_BEGINTIME] = beginTime;

        // "" or >=0, suitable slot begin - (begin+duration)
        rec[KR_DURATIONINMIN] = durationInMin;

        // "" or channel limit
        rec[KR_CHANNEL] = channel;

        // null or weekdays in array (from sunday "0" to saturday "6" values)
        rec[KR_WEEKDAYS] = weekdays;

        // id will be milliseconds of creation time
        if (id != undefined && id != "") {
            rec[KR_ID] = id;
        } else {
            rec[KR_ID] = (new Date()).getTime();
        }
        return rec;
    },

    isMatch : function(rec, alink) {

        var link = alink.prop(KR_LINKINFO);
        
        var begin = link[KL_TIME];
        begin = begin.split(" - ")[0].trim();
        var programDateTime = Date.parse(link[KL_DATE] + " " + begin);

        // Is weekday wanted
        var dayOfWeek = programDateTime.getDay();
        if (rec[KR_WEEKDAYS] != null && jQuery.inArray("" + dayOfWeek, rec[KR_WEEKDAYS]) == -1) {
            return false;
        }

        // Is the program coming from right channel
        if (rec[KR_CHANNEL] != "" && link[KL_CHANNEL] != rec[KR_CHANNEL]) {
            return false;
        }

        // Is the program staring inside wanted time slot
        if (rec[KR_BEGINTIME] != "") {
            var recordingDateTimeBegin = Date.parse(link[KL_DATE] + " " + rec[KR_BEGINTIME]);
            var recordingDateTimeEnd = recordingDateTimeBegin.clone().addMinutes(rec[KR_DURATIONINMIN]);
            if (!programDateTime.between(recordingDateTimeBegin, recordingDateTimeEnd)) {
                return false;
            }
        }

        // Is the program text right (not to be found just from desctiption)
        if (link[KL_PROGRAMTEXT].toLowerCase().indexOf(rec[KR_SEARCHSTRING]) == -1) {
            return false;
        }

        return true;
    }
};
