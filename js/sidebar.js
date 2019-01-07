function searchInputChanged()
{
    var search = document.getElementById("search");
    var line = search.value;
    if(line)
    {
        search.className = "search hasvalue";
    }
    else
    {
        search.className = "search";
    }
    if(line && event.keyCode == 13)
    {
        window.location.href="/search/search.html?keyword=" + line;
    }
}