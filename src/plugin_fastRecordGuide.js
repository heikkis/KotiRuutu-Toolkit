$(document).ready(function() {
    KotiRuutuToolKit.alterLinksGuide($(this));
    KotiRuutuToolKit.addKotiRuutuMenu($(this));
    
    var $showNextDay = $(
            '<span class="xtra_link"><a id="showNextDay" href="javascript:void(0)">Seuraava &gt;</a></span>')
            .click(function() {
                window.location = '/OmatSivut/Apps/Iptv/index.jsp?day=' + (KotiRuutuToolKit.getCurrentDateStampForGuide() + 24*3600);
                $(this).fadeOut(500).fadeIn(200);
            });


    var $showPreviousDay = $(
    '<span class="xtra_link"><a id="showPreviousDay" href="javascript:void(0)">&lt; Edellinen</a></span>')
    .click(function() {
        window.location = '/OmatSivut/Apps/Iptv/index.jsp?day=' + (KotiRuutuToolKit.getCurrentDateStampForGuide() - 24*3600);
        $(this).fadeOut(500).fadeIn(200);
    });
    
    var $div = $('<div/>');
    $div.addClass('showDays');
    $div.append($showPreviousDay," ", $showNextDay);
    
    $('#guide-day').after($div);
    
});
