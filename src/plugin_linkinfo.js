var KL_ID = 0;
var KL_DATE = 1;
var KL_PROGRAMTEXT = 2;
var KL_TIME = 3;
var KL_DURATION = 4;
var KL_CHANNEL = 5;
var KL_PROGRAMID = 6;

var KR_LINKINFO = "KR_LINKINFO";

var KotiruutuLinkInfo = {
    
    /**
     * 
     */
    createLinkInfo : function(id, date, programText, time, duration, channel, programId) {

        var link = new Array();
        
        if (id != undefined && id != "") {
            link[KL_ID] = id;
        } else {
            link[KL_ID] = (new Date()).getTime();
        }
        
        link[KL_DATE] = date;
        link[KL_PROGRAMTEXT] = programText;
        link[KL_TIME] = time;
        link[KL_DURATION] = duration;
        link[KL_CHANNEL] = channel;
        link[KL_PROGRAMID] = programId;
       
        return link;
    }
};
