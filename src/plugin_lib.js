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

        $.ajax({
            type : "GET",
            url : this.compileDialogURL({
                m : 'Dialog',
                name : "Tip",
                id : link.prop("programId")
            }),
            context : link,
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
                url += '&' + i + '=' + escape(params[i]);
        }

        return url;
    },

    recordProgram : function(link) {
        $.ajax({
            type : "GET",
            url : this.compileDialogURL({
                action : 'record',
                storage : "network",
                program : link.prop("programId")
            }),
            context : link,
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
        $.ajax({
            type : "GET",
            url : this.compileDialogURL({
                action : 'cancel',
                storage : "network",
                program : link.prop("programId")
            }),
            context : link,
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
        $.ajax({
            type : "GET",
            url : this.compileDialogURL({
                action : 'delete',
                storage : "network",
                program : link.prop("programId")
            }),
            context : link,
            success : function(msg) {
                var status = JSON.parse(msg).data.result;

                if (status == true) {
                    KotiRuutuToolKit.showInfoFromLink(false, link);
                }
            }
        });

    },

    showInfoFromLink : function(added, link) {
        var date = link.prop('date');
        var program = link.prop('programText');
        var time = link.prop('time');

        var text;
        if (added == true) {
            cssclass = "added";
            text = '<span class="added">+</span>';
        } else {
            text = '<span class="removed">-</span>';
            cssclass = 'removed';
        }

        text += '&nbsp;&nbsp;' + date;
        if (time != null) {
            text += ' klo ' + time;
        }
        text += ': <b>' + program + '</b>';
        ;

        $.pnotify({
            pnotify_text : text,
            pnotify_animation : {
                effect_in : 'show',
                effect_out : 'slide'
            },
            pnotify_delay : 4000
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

    saveSearch : function(searchString) {
        var db = new Object();
        if (localStorage.searchStrings == undefined) {
            db.data = new Array(searchString);
        } else {
            db = JSON.parse(localStorage.searchStrings);

            if ($.inArray(searchString, db.data) == -1) {
                db.data.push(searchString);
            }
        }

        localStorage.searchStrings = JSON.stringify(db);

        $.pnotify({
            pnotify_title : "Hakusana tallennettu",
            pnotify_text : searchString,
            pnotify_animation : {
                effect_in : 'show',
                effect_out : 'slide'
            }
        });

    },

    clearSavedSearch : function() {
        localStorage.removeItem("searchStrings");

        $.pnotify({
            pnotify_text : "Tallennetut haut poistettu!",
            pnotify_animation : {
                effect_in : 'show',
                effect_out : 'slide'
            },
            pnotify_delay : 5000
        });

    },

    showSavedSearch : function() {
        if (localStorage.searchStrings == undefined) {
            $.pnotify({
                pnotify_text : "Ei tallennettuja hakuja!",
                pnotify_animation : {
                    effect_in : 'show',
                    effect_out : 'slide'
                },
                pnotify_type : 'error'
            });
        } else {
            var db = JSON.parse(localStorage.searchStrings);
            var msg = "";
            $.each(db.data, function(index, value) {
                msg += "      " + (index + 1) + '. ' + value + "\n";
            });

            $.pnotify({
                pnotify_title : "Tallennetut haut",
                pnotify_text : msg,
                pnotify_animation : {
                    effect_in : 'show',
                    effect_out : 'slide'
                }
            });

        }
    },

    recordSearchResults : function() {
        if (localStorage.searchStrings == undefined) {
            $.pnotify({
                pnotify_text : "Ei tallennettuja hakuja!",
                pnotify_animation : {
                    effect_in : 'show',
                    effect_out : 'slide'
                },
                pnotify_type : 'error'
            });
        } else {
            var db = JSON.parse(localStorage.searchStrings);
            $.each(db.data, function(index, value) {

                $.pnotify({
                    pnotify_title : 'Tallennetun haun automaattinen nauhoitus',
                    pnotify_text : '<span class="added">+</span> ' + value + ' hakusanalla',
                    pnotify_animation : {
                        effect_in : 'show',
                        effect_out : 'slide'
                    }
                });

                KotiRuutuToolKit.recordSearchResult(value);
            });
        }
    },

    recordSearchResult : function(searchString) {
        var iframeName = 'recordSearchResult_' + searchString;

        $('<iframe />', {
            "name" : iframeName,
            "id" : iframeName,
            "src" : "index.jsp?m=Search&search=" + escape(searchString)
        }).appendTo('body').load(function() {
            KotiRuutuToolKitInit.alterLinksSearch($(this.contentDocument).find('body'));
            KotiRuutuToolKit.recordAll($(this.contentDocument).find('body'));
            $('#' + iframeName).remove();
        });

    },

    deleteSearchResults : function() {
        if (localStorage.searchStrings == undefined) {
            $.pnotify({
                pnotify_text : "Ei tallennettuja hakuja!",
                pnotify_animation : {
                    effect_in : 'show',
                    effect_out : 'slide'
                },
                pnotify_type : 'error'
            });
        } else {
            var db = JSON.parse(localStorage.searchStrings);
            $.each(db.data, function(index, value) {

                $.pnotify({
                    pnotify_title : 'Tallennetun haun automaattinen ajatuksien poisto',
                    pnotify_text : '<span class="removed">-</span> ' + value + ' hakusanalla',
                    pnotify_animation : {
                        effect_in : 'show',
                        effect_out : 'slide'
                    }
                });

                KotiRuutuToolKit.deleteSearchResult(value);
            });
        }
    },

    deleteSearchResult : function(str) {
        var iframeName = 'deleteSearchResult_' + str;

        $('<iframe />', {
            "name" : iframeName,
            "id" : iframeName,
            "src" : "index.jsp?m=Search&search=" + escape(str)
        }).appendTo('body').load(function() {
            KotiRuutuToolKitInit.alterLinksSearch($(this.contentDocument).find('body'));
            KotiRuutuToolKit.deleteAllTimings($(this.contentDocument).find('body'));
            $('#' + iframeName).remove();
        });

    },

    recordAll : function(customRoot) {
        $(customRoot).find('a[programId != ""]').each(function(index, link) {
            if (KotiRuutuToolKit.isNewRecording($(link))) {
                KotiRuutuToolKit.recordProgram($(link));
            }
        });
    },

    deleteAllTimings : function(customRoot) {
        $(customRoot).find('a[programId != ""]').each(function(index, link) {
            if (KotiRuutuToolKit.isTimedRecording($(link))) {
                KotiRuutuToolKit.removeTiming($(link));
            }
        });
    },

    deleteAllRecordings : function(customRoot) {
        $(customRoot).find('a[programId != ""]').each(function(index, link) {
            KotiRuutuToolKit.removeRecording($(link));
        });
    },

    getCurrentDateStampForGuide : function() {
        var currentLink = $('#guide-day').find('.days > .selected').get(0);
        return Number(currentLink.href.split('day=')[1]);
    }

};
