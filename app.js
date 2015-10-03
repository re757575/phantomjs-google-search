function waitFor(testFx, onReady, timeOutMillis) {
    var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
        start = new Date().getTime(),
        condition = false,
        interval = setInterval(function() {
            if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
                // If not time-out yet and condition not yet fulfilled
                condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
            } else {
                if(!condition) {
                    // If condition still not fulfilled (timeout but condition is 'false')
                    console.log("'waitFor()' timeout");
                    phantom.exit(1);
                } else {
                    // Condition fulfilled (timeout and/or condition is 'true')
                    console.log("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
                    typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
                    clearInterval(interval); //< Stop this interval
                }
            }
        }, 250); //< repeat check every 250ms
};

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

            waitFor(function() {
              // Check in the page if a specific element is now visible
              return page.evaluate(function() {
                return $('.srg').length > 0;
              });
            }, function() {
              page.render('google-search.png');
              console.log('render done');
              phantom.exit(0);
            });

            // page.onLoadFinished = function() {
            //   page.render('google-search.jpeg', {format: 'jpeg', quality: '100'});
            //   console.log('render done');
            //   phantom.exit(0);
            // };
        });
    }
});
