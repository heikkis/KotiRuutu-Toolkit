var KotiRuutuToolKitInit = {

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

    addKotiRuutuMenu : function(customRoot) {
        var $showSavedSearch = $(
                '<span class="xtra_link"><a id="showSavedSearch" href="javascript:void(0)">Näytä tallennetut haut</a></span>')
                .click(function() {
                    KotiRuutuToolKit.showSavedSearch();
                    $(this).fadeOut(200).fadeIn(50);
                });
        
        var $editSavedSearch = $(
        '<span class="xtra_link"><a id="editSavedSearch" href="?m=EditSavedSearch">Muokkaa tallennettuja hakuja</a></span>')
        .click(function() {
            $(this).fadeOut(200).fadeIn(50);
        });        

        var $clearSavedSearch = $(
                '<span class="xtra_link"><a id="clearSavedSearch" href="javascript:void(0)">Tyhjennä tallennetut haut</a></span>')
                .click(function() {
                    $(this).fadeOut(200).fadeIn(50);
                    
                    if (confirm("Haluatko varmasti poistaa tallennetut haut?")) {
                        KotiRuutuToolKit.clearSavedSearch();
                    }
                    
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

        $(customRoot).find('#toolkit_menu').append($showSavedSearch, $editSavedSearch, $clearSavedSearch, recordSearchResults, deleteSearchResults);
    }

};
