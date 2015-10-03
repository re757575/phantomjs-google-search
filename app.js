var url = 'http://www.google.com/',
    page = new WebPage();

page.onConsoleMessage = function(msg) {
  console.log('console -> ' + msg);
};

page.onLoadFinished = function() {
  page.render('googl-home-page.png');
};

page.viewportSize = {width: 1024, height:768};
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

            // window.setTimeout(
            //   function () {
            //     page.render('google-search.png');
            //     console.log('render done');
            //     phantom.exit(0);
            //   },
            //   5000 // wait 5,000ms (5s)
            // );

            page.onLoadFinished = function() {
              page.render('google-search.png');
              console.log('render done');
              phantom.exit(0);
            };

        });
    }
});
