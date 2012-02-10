$(document).ready(function() {
    KotiRuutuToolKit.alterLinksTimings($(this));
    KotiRuutuToolKit.addKotiRuutuMenu($(this));
    
    var $deleteAll = $(
            '<div class="xtra_link" style="width:100%; text-align:center"><a id="deleteAll" href="javascript:void(0)"><span class="removed">-</span><b> Peruuta kaikki ajastukset</b></a></div>')
            .click(function() {
                KotiRuutuToolKit.deleteAllTimings($(this).parentsUntil("div.app-header").has("body"));
                $(this).fadeOut(500).fadeIn(200);
            });

    $('#toolkit_menu').after($deleteAll);
    
});
