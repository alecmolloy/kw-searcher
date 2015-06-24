var kwAPISearcher = function (config) {
    // Instantiate properties
    this.baseURL = 'http://api-staging.kano.me/'; // Only supports shares
    this.type = config.type; // Only supports shares
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
        url: this.baseURL + this.type,
        success: storePages.bind(this),
        data: {
            app_name: this.appName
        }
    });

}

kwAPISearcher.prototype.getData = function (self) {
    for (var i = 0; i < self.pages; i++) {
        var response = $.ajax({
            url: self.baseURL + self.type,
            data: {
                page: i,
                app_name: this.appName
            },
            success: kwAPISearcher.prototype.printData.bind(this)
        });
    }
}

kwAPISearcher.prototype.printData = function (response) {
    for (var j = 0; j < response.entries.length; j++) {
        var entry = response.entries[j];
        var title = entry.title.toLowerCase();
        var description = entry.description.toLowerCase();
        console.log(description); // + ', ' + this.query);
        if (title.includes(this.query) || description.includes(this.query)) {
            var link = document.createElement('a');
            link.className = 'box';
            link.href = 'http://world.kano.me/shared/' + entry.id;

            var div = document.createElement('div');

            var text = document.createTextNode(entry.title);
            var textDiv = document.createElement('div');
            textDiv.className = 'textBox';

            var image = document.createElement('img');
            image.src = response.entries[j].cover_url;
            image.className = 'imageBox';

            textDiv.appendChild(text);
            div.appendChild(textDiv);
            link.appendChild(image);
            link.appendChild(textDiv);
            list.appendChild(link);
            this.total++;
        }
        var sharesS = this.total > 1 ? ' shares' : ' share';
        this.shareNumber.innerHTML = this.total + sharesS;
    }
}

kwAPISearcher.prototype.clearResults = function () {
    var list = document.getElementById('list');
    while (list.hasChildNodes()) {
        list.removeChild(list.lastChild);
    }
}


var searcher;

function submitQuery(e) {
    searcher = new kwAPISearcher({
        type: 'share',
        query: document.getElementById('queryField').value,
        appName: 'kano-draw'
    });
    searcher.clearResults();
    e.preventDefault();
}

document.getElementById('query').addEventListener('submit', submitQuery);
