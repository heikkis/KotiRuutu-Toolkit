$(document)
    .ready(
        function() {
            KotiRuutuToolKitInit.alterLinksTimings($(this));
            KotiRuutuToolKitInit.addKotiRuutuMenu($(this));

            var div = $('<div class="xtra_link" style="width:100%; text-align:center">');
            var deleteAll = $(
                '<a id="deleteAll" href="javascript:void(0)"><img src="' + chrome.extension.getURL("images/remove_16x16.png") + '"><b> Peruuta kaikki ajastukset</b></a>')
            .click(function() {

                $(this).fadeOut(500).fadeIn(200);

                if (confirm("Haluatko varmasti peruuttaa kaikki ajastukset?")) {
                    KotiRuutuToolKit.deleteAllTimings($(this).parentsUntil("div.app-header").has("body"));
                }
            });

            div.append(deleteAll);
            $('#toolkit_menu').after(div);

        });
