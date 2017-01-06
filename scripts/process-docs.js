var fs = require('fs');
var path = require('path');

var htmlFile = path.join(__dirname, '../docs/index.html');

fs.readFile(htmlFile, 'utf8', function (err,data) {
    if (err) {
        console.log(err);
        process.exit(1);
        return;
    }

    var result = data
        .replace('href="/', 'href="')
        .replace('src="/', 'src="');

    fs.writeFile(htmlFile, result, 'utf8', function (err) {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log('fixed html file paths');
    });
});