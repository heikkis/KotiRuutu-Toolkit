$(document)
    .ready(
        function() {
            KotiRuutuToolKitInit.alterLinksRecordings($(this));
            KotiRuutuToolKitInit.addKotiRuutuMenu($(this));

            var div = $('<div class="xtra_link" style="width:100%; text-align:center">');
 
            var deleteAll = $(
                '<a id="deleteAll" href="javascript:void(0)"><img src="' + chrome.extension.getURL("images/remove_16x16.png") + '"><b> Poista kaikki tallennukset</b></a>')
            .click(function() {

                if (confirm("Haluatko varmasti poistaa kaikki tallennukset?")) {
                    KotiRuutuToolKit.deleteAllRecordings($(this).parentsUntil("div.app-header").has("body"));
                }

                $(this).fadeOut(500).fadeIn(200);
            });

            div.append(deleteAll);
            $('#toolkit_menu').after(div);

        });
