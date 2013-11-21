function reloadFromDB() {
    
    $('#editSearchList').empty();
    
    var rowDB = getRecLocalStorage();
    
    $.each(rowDB, function(rowIndex, rowValue) {
        var searchTerm = $("<div id=\"searchterm_" + (rowValue[KR_ID]) + "\">" + (rowIndex + 1) + '. '
            + rowValue[KR_SEARCHSTRING] + " - </div>");
        
        var removeLink = $('<a href="javascript:void(0)"><img src="' + chrome.extension.getURL("images/remove_16x16.png") + '"> Poista</a>').click(function() {

            var searchDB = getRecLocalStorage();
            var removeIndex = null;

            $.each(searchDB, function(searchIndex, searchValue) {
                if (searchValue[KR_ID] === rowValue[KR_ID]) {
                    removeIndex = searchIndex;
                }
            });

            if (removeIndex != undefined) {
                searchDB.splice(removeIndex, 1);
                setRecLocalStorage(searchDB);
            }

            $("#searchterm_" + rowValue[KR_ID]).remove();

        });

        var editLink = $('<a href="javascript:void(0)"><img src="' + chrome.extension.getURL("images/edit_16x16.png") + '"> Muokkaa</a>').click(function() {

            var searchDB = getRecLocalStorage();
            var editRec = undefined;
            
            $.each(searchDB, function(searchIndex, searchValue) {
                if (searchValue[KR_ID] === rowValue[KR_ID]) {
                    editRec = searchValue;
                }
            });

            if (editRec != undefined) {
                KotiRuutuToolKitRec.loadDataFromRec(editRec);           
                $("#editSavedSearchDialog").dialog('open');
            }
        });

        $('#editSearchList').append(searchTerm.append(editLink).append(" ").append(removeLink));
    });
}


$(document)
    .ready(
        function() {
            KotiRuutuToolKitInit.addKotiRuutuMenu($(this));
                    
            $("#guide-day").remove();
            $("#guide-slider").remove();
            $("#channels").remove();
            
            var saveSearch = $(
                '<span class="xtra_link"><a id="saveSearch" href="javascript:void(0)"><img src="' + chrome.extension.getURL("images/add_16x16.png") + '"> Lisää uusi hakusana</a></span>')
            .click(function() {             
                $("#editSavedSearchDialog").dialog('open');
                $(this).fadeOut(200).fadeIn(50);
            });
            
            var $clearSavedSearch = $(
                '<span class="xtra_link"><a id="clearSavedSearch" href="javascript:void(0)"><img src="' + chrome.extension.getURL("images/remove_16x16.png") + '"> Tyhjennä tallennetut haut</a></span>')
            .click(function() {
                $(this).fadeOut(200).fadeIn(50);

                if (confirm("Haluatko varmasti poistaa tallennetut haut?")) {
                    KotiRuutuToolKit.clearSavedSearch();
                    reloadFromDB();
                }

            });
                        
            var div = $('<div align="center" style="width: 100%;">');
            div.append(saveSearch, " ", $clearSavedSearch, "<br/><br/>");
            $('#content').append(div);

            if (isRecLocalStorageEmpty()) {
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
                    + '<div style="text-align: left; width:300px; margin-left: auto; margin-right: auto;"'
                    + ' id=\"editSearchList\"><br/><br/><div align="center"><b>Tallennetut hakusanat</b></div><br/></div></div>');
                 
                reloadFromDB();
            }

            $("body").append("<div id='savedSearchDialog' style=''/>");
            $("#savedSearchDialog").load(chrome.extension.getURL("plugin_editSavedSearch_dialog.html"), function() {
                $("#editSavedSearchDialog").bind( "dialogbeforeclose", function(event, ui) {
                    reloadFromDB();
                });
            });
        });
