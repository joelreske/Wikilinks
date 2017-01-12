module.exports.run = function(method, url, data, parse, callback) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            var error = true;
            var resData = null;

            if (this.status == 200) {
                error = false;
                resData = this.responseText;
                if (parse) {
                    resData = JSON.parse(this.responseText);
                }
            }
            callback(resData, error);
        }
    };

    var dataString = "";

    if (data != null) {
        if (method == "GET") {
            url += "?";
            for (var key in data) {
                url += key + "=" + data[key] + "&";
            }
        } else {
            dataString = JSON.stringify(data);
        }

    }
    xhr.open(method, url, true);

    if (method == "GET") {
        xhr.send();
    } else {
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(dataString);
    }

}