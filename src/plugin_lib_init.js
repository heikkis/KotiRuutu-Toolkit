var KotiRuutuToolKitInit = {

    alterLinksSearch : function(customRoot) {
        $(customRoot).find('a[href*="javascript:Ui.openProgram"]').each(function() {
            
            var programRow = $(this).parentsUntil('ul');
            
            var linkinfo = KotiruutuLinkInfo.createLinkInfo(
                undefined,
                programRow.find('.date > .value').get(0).innerText,
                programRow.find('.program > .value > strong').get(0).innerText,
                programRow.find('.time > .value').get(0).innerText,
                programRow.find('.duration > .value').get(0).innerText,
                programRow.find('.channel > .value').get(0).innerText,
                $(this).attr("href").substr(26, 7),
                programRow.find('.program > .value > .text').get(0).innerText
                );

            $(this).prop(KR_LINKINFO, linkinfo);

            $(this).attr("href", "javascript:void(0)");
            $(this).click(function() {
                KotiRuutuToolKit.changeStatus($(this));
            });

        });

    },

    alterLinksGuide : function(customRoot) {

        $(customRoot).find('a[href*="javascript:Ui.openProgram"]').each(function() {

            var linkinfo = KotiruutuLinkInfo.createLinkInfo(
                undefined,
                $(this).closest('#content').find('#guide-day > .day')[0].innerText.split(', ')[1].trim(),
                $(this).find('.title').get(0).innerText,
                $(this).find('.time').get(0).innerText,
                undefined,
                undefined,
                $(this).attr("href").substr(26, 7)
                );

            $(this).prop(KR_LINKINFO, linkinfo);

            var link = $(this);

            $(this).mouseover(function() {
                if (link.prop("infoWindow") != undefined) {
                    link.prop("infoWindow").show();
                } else {
                    KotiRuutuToolKit.initProgramDetailsWindow(link, event);
                }
            }).mouseout(function() {
                if (link.prop("infoWindow") != undefined) {
                    link.prop("infoWindow").hide();
                }
            }).mousemove(function() {
                if (link.prop("infoWindow") != undefined) {
                    link.prop("infoWindow").move(event);
                }
            });

            $(this).attr("href", "javascript:void(0)");
            $(this).click(function() {
                KotiRuutuToolKit.changeStatus($(this));
            });

        });

    },

    alterLinksRecordings : function(customRoot) {
        $(customRoot).find('a[href*="javascript:Ui.confirmRemove"]').each(function() {

            var programRow = $(this).parentsUntil('ul');
            
            var linkinfo = KotiruutuLinkInfo.createLinkInfo(
                undefined,
                programRow.find('.date > .value').get(0).innerText,
                programRow.find('.program > .value > a').get(0).innerText,
                undefined,
                programRow.find('.duration > .value').get(0).innerText,
                programRow.find('.channel > .value').get(0).innerText,
                $(this).attr("href").substr(28, 7)
                );

            $(this).prop(KR_LINKINFO, linkinfo);            

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
            
            var programRow = $(this).parentsUntil('ul');

            var linkinfo = KotiruutuLinkInfo.createLinkInfo(
                undefined,
                programRow.find('.date > .value').get(0).innerText,
                programRow.find('.program > .value > a').get(0).innerText,
                undefined,
                programRow.find('.duration > .value').get(0).innerText,
                programRow.find('.channel > .value').get(0).innerText,
                $(this).attr("href").substr(26, 7)
                );

            $(this).prop(KR_LINKINFO, linkinfo);     

            $(this).attr("href", "javascript:void(0)");
            $(this).click(function() {
                link.prop("infoWindow").hide();
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

    addKotiRuutuMenu : function(customRoot) {

        var editSavedSearch = $(
            '<span class="xtra_link"><a id="editSavedSearch" href="?m=EditSavedSearch"><img src="' + chrome.extension.getURL("images/edit_16x16.png") + '"> Muokkaa tallennettuja hakuja</a></span>')
        .click(function() {
            $(this).fadeOut(200).fadeIn(50);
        });

        var recordSearchResults = $(
            '<span class="xtra_link"><a id="recordSearchResults" href="javascript:void(0)"><img src="' + chrome.extension.getURL("images/record_16x16.png") + '"> Nauhoita tallennettujen hakujen ohjelmat</a></span>')
        .click(function() {
            KotiRuutuToolKit.recordSearchResults();
            $(this).fadeOut(200).fadeIn(50);
        });

        var deleteSearchResults = $(
            '<span class="xtra_link"><a id="deleteSearchResults" href="javascript:void(0)"><img src="' + chrome.extension.getURL("images/remove_16x16.png") + '"> Poista tallennettujen hakujen ohjelmat</a></span>')
        .click(function() {
            if (confirm("Haluatko varmasti peruuttaa kaikki tallennettujen hakujen ajastukset?")) {
                KotiRuutuToolKit.deleteSearchResults();
            }   
            $(this).fadeOut(200).fadeIn(50);
        });

        var menuSpan = $('<span><b>KotiRuutu ToolKit MENU:</b></span>');
        $(customRoot).find('#content').prepend(
            '<div id="toolkit_menu" style="font-size: 120%; height: 50px; width: 100%; text-align: center; padding-top: 10px;">');

        $(customRoot).find('#toolkit_menu').append(menuSpan, editSavedSearch, recordSearchResults,
            deleteSearchResults);
                        
        var backgroundStatus = $(
            '<span style="position:fixed; top: 20px; left: 230px;"><img src="' + chrome.extension.getURL("images/ready_32x32.png") + '" id="background_status"/><span id="background_status_counter" /></span>');
        $("body").append(backgroundStatus);
        $(customRoot).find("#background_status").prop("counter", 0);
     }
};
