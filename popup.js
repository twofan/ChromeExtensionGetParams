

function getCurrentTabUrl(callback) {
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function(tabs) {

        var tab = tabs[0];

        var url = tab.url;

        console.assert(typeof url == 'string', 'tab.url should be a string');
        callback(url);
    });


}

function renderMessage(){
    document.getElementById('message').innerHTML = "<h2>FileName Copied</h2>";
}

function renderParams(params){
    var domList = document.getElementById('params');
    var html = "";
    for (var i=0; i<params.length; i++){
        var line = "<tr><td>"+params[i].key+"</td><td>"+params[i].value+"</td><td></td></tr>"
        html += line;
    }
    domList.innerHTML = html;
}

function renderTabURL(tabURL) {
    document.getElementById('tabURL').textContent = tabURL;
}


document.addEventListener('DOMContentLoaded', function() {
    var keyToFind ='fileName';
    getCurrentTabUrl(function(url) {
        // renderTabURL(url);
        url = url.split("?");
        if (url.length >1){
            var params = url[1];
            params = params.split("&");
            for (var i=0; i<params.length; i++){
                var param = params[i];
                param = param.split('=');
                if (param[0]==keyToFind){
                    chrome.runtime.sendMessage({
                        type: 'copy',
                        text: param[1]
                    });
                    renderMessage();
                }
                params[i] = {
                    key: param[0],
                    value:param[1]
                }
            }
            renderParams(params);
        }
    });
});