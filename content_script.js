//Copyright (c) Jonathan Cox 2015; Licensed MIT
//TODO: Add a title to dialog box.
//TODO: Work on search.

var search_term = document.getSelection().toString();
var wiki_stub = "https://en.wikipedia.org/w/api.php?action=query"

function makeDialog(id) {
    dialog = document.createElement("div")
    document.body.appendChild(dialog)
    dialog.id = "div_" + id
    $("#"+dialog.id).dialog({
        modal: true,
        resizable: false,
        draggable: false,
        width: 500,
        buttons: [{
            text: "Got it.",
            click: function(){
                $(this).dialog("close")
            }
        }]
    })
    $(".ui-button").hide()
    $(".ui-dialog-titlebar").hide()
};

function getWiki( search_term ){
    var unique_id = new Date().getTime().toString()
    makeDialog(unique_id)
    var dialog = document.getElementById("div_"+unique_id)
    loadAnimation(dialog)
    $.getJSON(
        wiki_stub,
        { "generator": "search",
        "format": "json",
        "gsrwhat": search_term,
        "gsrlimit":5,
        "prop": "categories",
        "continue": ""},

        function(data) {
            for (id in data.query.pages){
                var categories = data.query.pages[id].categories
                if (checkForDisambiguation(categories)) {
                    var title = data.query.pages[id].title
                    returnResult(title)
                    break
                }
            }
        }
    )
}
function loadAnimation(dialog) {
    var image = document.createElement('img')
    var spinner = chrome.extension.getURL("ajax-loader.gif")
    image.src = spinner
    image.id = "hummingbird_loader"
    dialog.appendChild(image)

}

function checkForDisambiguation(categories) {
    for (var i = 0; i<categories.length; i++) {
        if (categories[i].title.indexOf("disambiguation")>-1){
            return false
        }
    return true
    }
}

function returnResult(title) {
    $.getJSON(wiki_stub,
    { "titles": title,
    "prop": "extracts",
    "format": "json",
    "exsentences": 5,
    "redirects": "resolve",
    "exintro": "",
    "explaintext": ""},
    function(data) {
        num = Object.keys(data.query.pages)[0]
        ext = data.query.pages[num].extract
        pageTitle = data.query.pages[num].title
        var a = document.createElement('a')
        var br = document.createElement('br')
        linkToWiki = "http://en.wikipedia.org/wiki/" + pageTitle
        var linkTitle = document.createTextNode("[view full article]")
        a.appendChild(linkTitle)
        a.href = linkToWiki
        dialog.textContent = ext
        dialog.appendChild(br)
        dialog.appendChild(a)
        $(".ui-button").show()
    })
};

getWiki(search_term)
