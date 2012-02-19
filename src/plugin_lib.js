var KotiRuutuToolKit = {

    initProgramDetailsWindow : function(link, event) {
        var $div = $('<div id="app-tip" style="display: block; z-index: 1"/>');

        $div.move = function(event) {
            
            var screenWidth = document.body.clientWidth || document.documentElement.clientWidth || self.innerWidth;
            var screenHeight = document.body.clientHeight || document.documentElement.clientHeight || self.innerHeight;
            
            var top = event.clientY - 30;
            var left = event.clientX + 20;
            
            if (screenWidth - event.clientX < 350) {
                left = event.clientX-350;
            }
            
            if (screenHeight-event.clientY < 200) {
                top = event.clientY-200;
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
            KotiRuutuToolKit.alterLinksSearch($(this.contentDocument).find('body'));
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
            KotiRuutuToolKit.alterLinksSearch($(this.contentDocument).find('body'));
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

    alterLinksSearch : function(customRoot) {
        $(customRoot).find('a[href*="javascript:Ui.openProgram"]').each(function() {
            $(this).prop("programId", $(this).attr("href").substr(26, 7));

            var programRow = $(this).parentsUntil('ul');

            $(this).prop("date", programRow.find('.date > .value').get(0).innerText);
            $(this).prop("programText", programRow.find('.program > .value > strong').get(0).innerText);
            $(this).prop("time", programRow.find('.time > .value').get(0).innerText);
            $(this).prop("duration", programRow.find('.duration > .value').get(0).innerText);
            $(this).prop("channel", programRow.find('.channel > .value').get(0).innerText);

            $(this).attr("href", "javascript:void(0)");
            $(this).click(function() {
                KotiRuutuToolKit.changeStatus($(this));
            });
        });

    },

    alterLinksGuide : function(customRoot) {

        $(customRoot).find('a[href*="javascript:Ui.openProgram"]').each(function() {

            $(this).prop("programId", $(this).attr("href").substr(26, 7));

            // Own cell
            $(this).prop("programText", $(this).find('.title').get(0).innerText);
            $(this).prop("time", $(this).find('.time').get(0).innerText);

            // Date
            $(this).prop("date", $(this).closest('#content').find('#guide-day > .day')[0].innerText.split(', ')[1].trim());
            $(this).attr("href", "javascript:void(0)");

            var link = $(this);

            $(this).mouseover(function() {
                if (link.prop("infoWindow") == undefined) {
                    KotiRuutuToolKit.initProgramDetailsWindow(link, event);
                } else {
                    link.prop("infoWindow").show();
                }
            }).mouseout(function() {
                link.prop("infoWindow").hide();
            }).mousemove(function() {
                link.prop("infoWindow").move(event);
            });

            $(this).click(function() {
                KotiRuutuToolKit.changeStatus($(this));
            });

        });

    },

    alterLinksRecordings : function(customRoot) {
        $(customRoot).find('a[href*="javascript:Ui.confirmRemove"]').each(function() {
            $(this).prop("programId", $(this).attr("href").substr(28, 7));

            var programRow = $(this).parentsUntil('ul');

            $(this).prop("date", programRow.find('.date > .value').get(0).innerText);
            $(this).prop("programText", programRow.find('.program > .value > a').get(0).innerText);
            // NA $(this).prop("time", programRow.find('.time >
            // .value').get(0).innerText);
            $(this).prop("duration", programRow.find('.duration > .value').get(0).innerText);
            $(this).prop("channel", programRow.find('.channel > .value').get(0).innerText);

            $(this).attr("href", "javascript:void(0)");
            $(this).click(function() {

                var programRow = $(this).parentsUntil('ul');
                programRow.remove();

                KotiRuutuToolKit.removeRecording($(this));
            });
        });
    },

    alterLinksTimings : function(customRoot) {
        $(customRoot).find('a[href*="javascript:Ui.openProgram"]').each(function() {
            $(this).prop("programId", $(this).attr("href").substr(26, 7));

            var programRow = $(this).parentsUntil('ul');

            $(this).prop("date", programRow.find('.date > .value').get(0).innerText);
            $(this).prop("programText", programRow.find('.program > .value > a').get(0).innerText);
            // NA $(this).prop("time", programRow.find('.time >
            // .value').get(0).innerText);
            $(this).prop("duration", programRow.find('.duration > .value').get(0).innerText);
            $(this).prop("channel", programRow.find('.channel > .value').get(0).innerText);

            $(this).attr("href", "javascript:void(0)");
            $(this).click(function() {

                var programRow = $(this).parentsUntil('ul');
                programRow.remove();
                KotiRuutuToolKit.removeTiming($(this));
            });
            
            
            var link = $(this);
            $(this).mouseover(function() {
                if (link.prop("infoWindow") == undefined) {
                    KotiRuutuToolKit.initProgramDetailsWindow(link, event);
                } else {
                    link.prop("infoWindow").show();
                }
            }).mouseout(function() {
                link.prop("infoWindow").hide();
            }).mousemove(function() {
                link.prop("infoWindow").move(event);
            });
        });

    },

    getCurrentDateStampForGuide : function() {
        var currentLink = $('#guide-day').find('.days > .selected').get(0);
        return Number(currentLink.href.split('day=')[1]);
    },

    addKotiRuutuMenu : function(customRoot) {
        var $showSavedSearch = $(
                '<span class="xtra_link"><a id="showSavedSearch" href="javascript:void(0)">Näytä tallennetut haut</a></span>')
                .click(function() {
                    KotiRuutuToolKit.showSavedSearch();
                    $(this).fadeOut(200).fadeIn(50);
                });

        var $clearSavedSearch = $(
                '<span class="xtra_link"><a id="clearSavedSearch" href="javascript:void(0)">Tyhjennä tallennetut haut</a></span>')
                .click(function() {
                    KotiRuutuToolKit.clearSavedSearch();
                    $(this).fadeOut(200).fadeIn(50);
                });

        var recordSearchResults = $(
                '<span class="xtra_link"><a id="recordSearchResults" href="javascript:void(0)"><span class="added">+</span> Nauhoita tallennettujen hakujen ohjelmat</a></span>')
                .click(function() {
                    KotiRuutuToolKit.recordSearchResults();
                    $(this).fadeOut(200).fadeIn(50);
                });

        var deleteSearchResults = $(
                '<span class="xtra_link"><a id="deleteSearchResults" href="javascript:void(0)"><span class="removed">-</span> Poista tallennettujen hakujen ohjelmat</a></span>')
                .click(function() {
                    KotiRuutuToolKit.deleteSearchResults();
                    $(this).fadeOut(200).fadeIn(50);
                });

        $(customRoot).find('#content').prepend(
                '<div id="toolkit_menu" style="width: 100%; text-align: center;"><span>KotiRuutu ToolKit MENU:</span>');

        $(customRoot).find('#toolkit_menu').append($showSavedSearch, $clearSavedSearch, recordSearchResults, deleteSearchResults);
    }

};
