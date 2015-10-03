var page = require('webpage').create();
var url = 'http://www.google.com/';

page.onConsoleMessage = function(msg) {
  console.log('console -> ' + msg);
};

page.onLoadFinished = function() {
  page.render('googl-home-page.png');
};

// page.onResourceRequested = function(requestData, networkRequest) {
//   console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
// };

page.viewportSize = {width: 1024, height:768};
page.settings.userAgent = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36";
page.open(url, function(status) {

    if (status !== 'success') {
      console.log('Unable to access network');
      phantom.exit(1);
      return;
    } else {

        console.log('connect to '+ url);

        page.includeJs("//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js", function() {

            console.log('jquery included');

            page.evaluate(function() {
                $('input[name="q"]').val("Apple Mac");
                $('form[name="f"]').submit();
                console.log('search submitted');
            });

            console.log('wait render...');

            setTimeout(function () {
              page.render('google-search.png');
              console.log('render done');
              phantom.exit(0);
            },5000);

            // page.onLoadFinished = function() {
            //   page.render('google-search.jpeg', {format: 'jpeg', quality: '100'});
            //   console.log('render done');
            //   phantom.exit(0);
            // };

        });
    }
});
