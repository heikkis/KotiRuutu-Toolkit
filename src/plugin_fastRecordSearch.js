$(document)
        .ready(
                function() {

                    KotiRuutuToolKitInit.alterLinksSearch($(this));
                    KotiRuutuToolKitInit.addKotiRuutuMenu($(this));

                    var $recordAll = $(
                            '<span class="xtra_link"><a id="recordAll" href="javascript:void(0)"><span class="added">+</span> Nauhoita hakutulokset</a></span>')
                            .click(function() {
                                KotiRuutuToolKit.recordAll($(this).parentsUntil("div.app-header").has("body"));
                                $(this).fadeOut(500).fadeIn(200);
                            });

                    var $deleteAll = $(
                            '<span class="xtra_link"><a id="deleteAll" href="javascript:void(0)"><span class="removed">-</span> Poista hakutulokset</a></span>')
                            .click(function() {
                                KotiRuutuToolKit.deleteAllTimings($(this).parentsUntil("div.app-header").has("body"));
                                $(this).fadeOut(500).fadeIn(200);
                            });

                    var $saveSearch = $(
                            '<span class="xtra_link"><a id="saveSearch" href="javascript:void(0)">Tallenna hakusana</a></span>')
                            .click(function() {
                                KotiRuutuToolKitRec.initNew($('input#search').val());
                                $("#editSavedSearchDialog").dialog('open');
                                $(this).fadeOut(200).fadeIn(50);
                            });

                    $('#guide-search').append($saveSearch, '</br>', $recordAll, '</br>', $deleteAll);

                    $("body").append("<div id='savedSearchDialog' style=''/>");
                    $("#savedSearchDialog").load(chrome.extension.getURL("plugin_editSavedSearch_dialog.html"));

                });
