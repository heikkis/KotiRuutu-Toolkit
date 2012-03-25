var KotiRuutuToolKit = {

    initProgramDetailsWindow : function(link, event) {
        var $div = $('<div id="app-tip" style="display: block; z-index: 1"/>');

        $div.move = function(event) {

            var screenWidth = document.body.clientWidth || document.documentElement.clientWidth || self.innerWidth;
            var screenHeight = document.body.clientHeight || document.documentElement.clientHeight || self.innerHeight;

            var top = event.clientY - 30;
            var left = event.clientX + 20;

            if (screenWidth - event.clientX < 350) {
                left = event.clientX - 350;
            }

            if (screenHeight - event.clientY < 200) {
                top = event.clientY - 200;
            }

            this.css({
                'top' : top,
                'left' : left
            });
        };

        $div.hide = function() {
            this.css({
                'display' : 'none'
            });
        };

        $div.show = function() {
            this.css({
                'display' : 'block'
            });
        };

        $("body").append($div);
        link.prop("infoWindow", $div);

        KotiRuutuToolKit.newBackgroundCall();

        $.ajax({
            type : "GET",
            url : this.compileDialogURL({
                m : 'Dialog',
                name : "Tip",
                id : link.prop(KR_LINKINFO)[KL_PROGRAMID]
            }),
            context : link,
            complete : function() {
                KotiRuutuToolKit.endBackgroundCall();
            },
            success : function(msg) {
                var text = JSON.parse(msg).html;
                $div.append(text);
                $div.move(event);
            }
        });
    },

    compileDialogURL : function(params) {
        var url = 'index.jsp?m=Dialog&name=Api';
        for ( var i in params) {
            if (typeof params[i] != 'function')
                url += '&' + i + '=' + params[i];
        }

        return url;
    },

    newBackgroundCall : function () {
        if ($("#background_status").prop("counter") === 0) {
            $("#background_status").prop("counter", 1);
            $("#background_status").prop("src",chrome.extension.getURL("images/waiting_32x32.png"));            
        } else {
            $("#background_status").prop("counter", $("#background_status").prop("counter")+1);
        }
        $("#background_status_counter").html($("#background_status").prop("counter"));
    },
    
    endBackgroundCall : function () {
        if ($("#background_status").prop("counter") === 1) {
            $("#background_status").prop("counter", 0);
            $("#background_status").prop("src",chrome.extension.getURL("images/ready_32x32.png"));
            $("#background_status_counter").html('');
        } else {
            $("#background_status").prop("counter", $("#background_status").prop("counter")-1);
            $("#background_status_counter").html($("#background_status").prop("counter"));
        }
        
    },

    recordProgram : function(link) {
        KotiRuutuToolKit.newBackgroundCall();
        
        $.ajax({
            type : "GET",
            url : this.compileDialogURL({
                action : 'record',
                storage : "network",
                program : link.prop(KR_LINKINFO)[KL_PROGRAMID]
            }),
            context : link,
            complete : function() {
                KotiRuutuToolKit.endBackgroundCall();
            },
            success : function(msg) {
                var status = JSON.parse(msg).data.result;

                if (status == true) {
                    KotiRuutuToolKit.showInfoFromLink(true, link);
                }

                if (link.hasClass("none")) {
                    link.toggleClass("none network");
                } else if (link.prop("innerText") == "Tallenna") {
                    link.prop("innerText", "Peruuta");
                    link.parentsUntil('ul').contents().find('span.icon-none').toggleClass("icon-none icon-network");
                }
            }
        });

    },

    removeTiming : function(link) {
        KotiRuutuToolKit.newBackgroundCall();
        
        $.ajax({
            type : "GET",
            url : this.compileDialogURL({
                action : 'cancel',
                storage : "network",
                program : link.prop(KR_LINKINFO)[KL_PROGRAMID]
            }),
            context : link,
            complete : function() {
                KotiRuutuToolKit.endBackgroundCall();
            },            
            success : function(msg) {
                var status = JSON.parse(msg).data.result;

                if (status == true) {
                    KotiRuutuToolKit.showInfoFromLink(false, link);
                }

                if (link.hasClass("network")) {
                    link.toggleClass("none network");
                } else if (link.prop("innerText") == "Peruuta") {
                    link.prop("innerText", "Tallenna");
                    link.parentsUntil('ul').contents().find('span.icon-network').toggleClass("icon-none icon-network");
                }
            }
        });

    },

    removeRecording : function(link) {
        KotiRuutuToolKit.newBackgroundCall();
        
        $.ajax({
            type : "GET",
            url : this.compileDialogURL({
                action : 'delete',
                storage : "network",
                program : link.prop(KR_LINKINFO)[KL_PROGRAMID]
            }),
            context : link,
            complete : function() {
                KotiRuutuToolKit.endBackgroundCall();
            },
            success : function(msg) {
                var status = JSON.parse(msg).data.result;

                if (status == true) {
                    KotiRuutuToolKit.showInfoFromLink(false, link);
                }
            }
        });

    },

    showInfoFromLink : function(added, link) {

        var text;
        if (added == true) {
            cssclass = "added";
            text = '<span class="added"><img src="' + chrome.extension.getURL("images/added_16x16.png") + '"></span>';
        } else {
            text = '<span class="removed"><img src="' + chrome.extension.getURL("images/removed_16x16.png") + '"></span>';
            cssclass = 'removed';
        }

        text += '&nbsp;&nbsp;' + link.prop(KR_LINKINFO)[KL_DATE];
        if (link.prop(KR_LINKINFO)[KL_TIME] != null) {
            text += ' klo ' + link.prop(KR_LINKINFO)[KL_TIME];
        }
        text += ': <b>' + link.prop(KR_LINKINFO)[KL_PROGRAMTEXT] + '</b>';
       
        $.pnotify({
            pnotify_text : text,
            pnotify_animation : {
                effect_in : 'show',
                effect_out : 'slide'
            },
            pnotify_delay : 2000
        });
    },

    changeStatus : function(link) {
        if (this.isNewRecording(link)) {
            this.recordProgram(link);
        } else if (this.isTimedRecording(link)) {
            this.removeTiming(link);
        }

        return false;
    },

    isNewRecording : function(link) {
        return link.hasClass("none") || link.prop("innerText") == "Tallenna";
    },

    isTimedRecording : function(link) {
        return link.hasClass("network") || link.prop("innerText") == "Peruuta";
    },

    /**
     * @param newRec
     *            KotiruutuRecording
     */
    saveSearch : function(newRec) {

        var db = getRecLocalStorage();

        var replaceIndex = undefined;
        $.each(db, function(searchIndex, searchValue) {
            if (searchValue[KR_ID] == newRec[KR_ID]) {
                replaceIndex = searchIndex;
            }
        });

        if (replaceIndex != undefined) {
            db.splice(replaceIndex,1,newRec);
        } else {
            db.push(newRec);
        }

        setRecLocalStorage(db);

        $.pnotify({
            pnotify_title : "Hakusana tallennettu",
            pnotify_text : newRec[KR_SEARCHSTRING],
            pnotify_animation : {
                effect_in : 'show',
                effect_out : 'slide'
            },
            pnotify_delay : 3000
        });
    },

    clearSavedSearch : function() {
        initRecLocalStorage();

        $.pnotify({
            pnotify_text : "Tallennetut haut poistettu!",
            pnotify_animation : {
                effect_in : 'show',
                effect_out : 'slide'
            },
            pnotify_delay : 3000
        });

    },

    showSavedSearch : function() {
        if (isRecLocalStorageEmpty()) {
            $.pnotify({
                pnotify_text : "Ei tallennettuja hakuja!",
                pnotify_animation : {
                    effect_in : 'show',
                    effect_out : 'slide'
                },
                pnotify_type : 'error',
                pnotify_delay : 3000                
            });
        } else {
            var db = getRecLocalStorage();
            var msg = "";
            $.each(db, function(index, value) {
                msg += value[KR_SEARCHSTRING] + "\n";
            });

            $.pnotify({
                pnotify_title : "Tallennetut haut",
                pnotify_text : msg,
                pnotify_animation : {
                    effect_in : 'show',
                    effect_out : 'slide'
                },
                pnotify_delay : 3000
            });

        }
    },

    recordSearchResults : function() {
        this.showSavedSearch();
        
        if (isRecLocalStorageEmpty() === false) {
            var db = getRecLocalStorage();
            $.each(db, function(index, value) {
                KotiRuutuToolKit.recordSearchResult(value);
            });
        }
    },

    recordSearchResult : function(rec) {
        var iframeName = 'recordSearchResult_' + rec[KR_ID];

        KotiRuutuToolKit.newBackgroundCall();
        
        $('<iframe />', {
            "name" : iframeName,
            "id" : iframeName,
            "style" : "width: 1px; height: 1px; position:fixed; top: 0px; z-index: -5;",           
            "src" : "index.jsp?m=Search&search=" + (rec[KR_SEARCHSTRING])
        }).appendTo('body').load(function() {
            KotiRuutuToolKitInit.alterLinksSearch($(this.contentDocument).find('body'));
            KotiRuutuToolKit.recordAll($(this.contentDocument).find('body'), rec);
            $('#' + iframeName).remove();
            
            KotiRuutuToolKit.endBackgroundCall();
        });

    },

    deleteSearchResults : function() {
        this.showSavedSearch();
                
        if (isRecLocalStorageEmpty() === false) {            
            var db = getRecLocalStorage();
            $.each(db, function(index, value) {
                KotiRuutuToolKit.deleteSearchResult(value);
            });
        }
    },

    deleteSearchResult : function(rec) {
        var iframeName = 'deleteSearchResult_' + rec[KR_ID];

        KotiRuutuToolKit.newBackgroundCall();
        
        $('<iframe />', {
            "name" : iframeName,
            "id" : iframeName,
            "style" : "width: 1px; height: 1px; position:fixed; top: 0px; z-index: -5;",
            "src" : "index.jsp?m=Search&search=" + (rec[KR_SEARCHSTRING])
        }).appendTo('body').load(function() {
            KotiRuutuToolKitInit.alterLinksSearch($(this.contentDocument).find('body'));
            KotiRuutuToolKit.deleteAllTimings($(this.contentDocument).find('body'), rec);
            $('#' + iframeName).remove();
            KotiRuutuToolKit.endBackgroundCall();
        });

    },

    recordAll : function(customRoot, rec) {
        $(customRoot).find('a').each(function(index, link) {
            if ($(link).prop(KR_LINKINFO) != undefined && KotiRuutuToolKit.isNewRecording($(link))) {
                if (rec == undefined  || KotiruutuRecording.isMatch(rec, $(link))) {
                    KotiRuutuToolKit.recordProgram($(link));
                }
            }
        });
    },

    deleteAllTimings : function(customRoot, rec) {
        $(customRoot).find('a').each(function(index, link) {
            if ($(link).prop(KR_LINKINFO) != undefined && KotiRuutuToolKit.isTimedRecording($(link))) {
                if (rec == undefined  || KotiruutuRecording.isMatch(rec, $(link))) {
                    KotiRuutuToolKit.removeTiming($(link));
                }
            }
        });
    },

    deleteAllRecordings : function(customRoot) {
        $(customRoot).find('a[KR_LINKINFO]').each(function(index, link) {
            KotiRuutuToolKit.removeRecording($(link));
        });
    },

    getCurrentDateStampForGuide : function() {
        var currentLink = $('#guide-day').find('.days > .selected').get(0);
        return Number(currentLink.href.split('day=')[1]);
    },
    
    validateTime : function(input) {
        return Date.parseExact(input, [
            "H:m",
            "h:mt",
            "h:m t",
            "ht","h t"]) != null ||
        Date.parseExact(input, [
            "h:mtt",
            "h:m tt",
            "htt","h tt"]) != null;
    }
};