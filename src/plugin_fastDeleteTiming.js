$(document)
        .ready(
                function() {
                    KotiRuutuToolKitInit.alterLinksTimings($(this));
                    KotiRuutuToolKitInit.addKotiRuutuMenu($(this));

                    var $deleteAll = $(
                            '<div class="xtra_link" style="width:100%; text-align:center"><a id="deleteAll" href="javascript:void(0)"><span class="removed">-</span><b> Peruuta kaikki ajastukset</b></a></div>')
                            .click(function() {

                                $(this).fadeOut(500).fadeIn(200);

                                if (confirm("Haluatko varmasti peruuttaa kaikki ajastukset?")) {
                                    KotiRuutuToolKit.deleteAllTimings($(this).parentsUntil("div.app-header").has("body"));
                                }
                            });

                    $('#toolkit_menu').after($deleteAll);

                });
