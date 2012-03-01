$(document).ready(function() {
    KotiRuutuToolKit.alterLinksRecordings($(this));
    KotiRuutuToolKit.addKotiRuutuMenu($(this));
    
    var $deleteAll = $(
            '<div class="xtra_link" style="width:100%; text-align:center"><a id="deleteAll" href="javascript:void(0)"><span class="removed">-</span><b> Poista kaikki tallennukset</b></a></div>')
            .click(function() {
                
                if (confirm("Haluatko varmasti poistaa kaikki tallennukset?")) {
                    KotiRuutuToolKit.deleteAllRecordings($(this).parentsUntil("div.app-header").has("body"));
                }
                
                $(this).fadeOut(500).fadeIn(200);
            });

    $('#toolkit_menu').after($deleteAll);
    
});
