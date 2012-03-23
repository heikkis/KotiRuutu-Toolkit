$(document)
        .ready(
                function() {
                    KotiRuutuToolKitInit.alterLinksRecordings($(this));
                    KotiRuutuToolKitInit.addKotiRuutuMenu($(this));

                    var $deleteAll = $(
                            '<div class="xtra_link" style="width:100%; text-align:center"><a id="deleteAll" href="javascript:void(0)"><img src="' + chrome.extension.getURL("images/remove_16x16.png") + '"><b> Poista kaikki tallennukset</b></a></div>')
                            .click(function() {

                                if (confirm("Haluatko varmasti poistaa kaikki tallennukset?")) {
                                    KotiRuutuToolKit.deleteAllRecordings($(this).parentsUntil("div.app-header").has("body"));
                                }

                                $(this).fadeOut(500).fadeIn(200);
                            });

                    $('#toolkit_menu').after($deleteAll);

                });
