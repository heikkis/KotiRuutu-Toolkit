$(document)
        .ready(
                function() {
                    KotiRuutuToolKitInit.addKotiRuutuMenu($(this));

                    $("#guide-day").remove();
                    $("#guide-search").remove();
                    $("#guide-slider").remove();
                    $("#channels").remove();
                    $(".header").remove();

                    if (localStorage.searchStrings == undefined) {
                        $.pnotify({
                            pnotify_text : "Ei tallennettuja hakuja!",
                            pnotify_animation : {
                                effect_in : 'show',
                                effect_out : 'slide'
                            },
                            pnotify_type : 'error'
                        });
                    } else {

                        $('#content')
                                .append(
                                        '<div align="center" style="width: 100%;">'
                                                + '<div style="text-align: left; width:200px; margin-left: auto; margin-right: auto;"'
                                                + ' id=\"editSearchList\"><br/><br/><div align="center"><b>Tallennetut hakusanat</b></div><br/></div></div>');

                        var db = JSON.parse(localStorage.searchStrings);
                        $.each(db.data, function(index, value) {
                            var $searchTerm = $(
                                    "<div id=\"searchterm_" + (index) + "\">" + (index + 1) + '. ' + value
                                            + " - <a href=\"javascript:void(0)\">Poista</a></div>").click(function() {

                                var db2 = JSON.parse(localStorage.searchStrings);

                                if ($.inArray(value, db2.data) != -1) {
                                    db2.data.splice($.inArray(value, db2.data), 1);
                                    localStorage.searchStrings = JSON.stringify(db2);
                                }

                                $("#searchterm_" + index).remove();

                            });

                            $('#editSearchList').append($searchTerm);
                        });
                    }

                });

/*
 * var $deleteAll = $( '<div class="xtra_link" style="width:100%;
 * text-align:center"><a id="deleteAll" href="javascript:void(0)"><span
 * class="removed">-</span><b> Poista kaikki tallennukset</b></a></div>')
 * .click(function() {
 * 
 * if (confirm("Haluatko varmasti poistaa kaikki tallennukset?")) {
 * KotiRuutuToolKit.deleteAllRecordings($(this).parentsUntil("div.app-header").has("body")); }
 * 
 * $(this).fadeOut(500).fadeIn(200); });
 * 
 * $('#toolkit_menu').after($deleteAll);
 */