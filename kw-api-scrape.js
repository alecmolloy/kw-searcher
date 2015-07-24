var kwAPISearcher = function (config) {
    // Instantiate properties
    this.baseURL = 'http://api.kano.me/share'; // Only supports shares
    this.query = config.query;
    this.appName = config.appName;
    this.output;
    this.pages;
    this.total = 0;
    this.list = document.getElementById('list');
    this.shareNumber = document.getElementById('shareNumber');

    // Callback for storing the number of pages
    var storePages = function (response) {
        this.pages = response.pages;
        this.getData(this);
    }

    // Make initial request
    $.ajax({
        url: this.baseURL,
        success: this.printData.bind(this),
        data: {
            app_name: this.appName,
            page: '0',
            limit: 'none'
        }
    });

}

kwAPISearcher.prototype.printData = function (response) {
    document.getElementById('spinner').style.display = 'none';
    for (var j = 0; j < response.total; j++) {
        var entry = response.entries[j];
        var title = entry.title.toLowerCase();
        var description = entry.description.toLowerCase();
        var userName = entry.user.username.toLowerCase();
        console.log(entry.user.username)
        if (title.includes(this.query) || description.includes(this.query) || userName.includes(this.query)) {
            var link = document.createElement('a');
            link.className = 'box';
            link.href = 'http://world.kano.me/shared/' + entry.id;

            var div = document.createElement('div');

            var text = document.createTextNode(title);
            var textDiv = document.createElement('div');
            textDiv.className = 'textBox';

            var image = document.createElement('img');
            if (response.entries[j].cover_url) {
                image.src = response.entries[j].cover_url;
            } else {
                image.src = 'http://world.kano.me/assets/icons/placeholders/' + response.entries[j].app + '@2x.png';
            }
            image.className = 'imageBox';
            image.title = description;

            textDiv.appendChild(text);
            div.appendChild(textDiv);
            link.appendChild(image);
            link.appendChild(textDiv);
            list.appendChild(link);
            this.total++;
        }
    }
    var sharesS = this.total > 1 ? ' shares' : ' share';
    this.shareNumber.innerHTML = this.total + sharesS;
}

kwAPISearcher.prototype.clearResults = function () {
    var list = document.getElementById('list');
    while (list.hasChildNodes()) {
        list.removeChild(list.lastChild);
    }
}


var searcher;

function submitQuery(e) {
    document.getElementById('spinner').style.display = 'block';
    if (document.getElementById('appSelector').value === 'all') {
        searcher = new kwAPISearcher({
            query: document.getElementById('queryField').value
        });
    } else {
        searcher = new kwAPISearcher({
            query: document.getElementById('queryField').value,
            appName: document.getElementById('appSelector').value
        });
    }
    searcher.clearResults();
    e.preventDefault();
}

document.getElementById('query').addEventListener('submit', submitQuery);
