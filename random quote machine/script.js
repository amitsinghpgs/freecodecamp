let quotesData;
var colors = [
    '#16a085',
    '#27ae60',
    '#2c3e50',
    '#f39c12',
    '#e74c3c',
    '#9b59b6',
    '#FB6964',
    '#342224',
    '#472E32',
    '#BDBB99',
    '#77B1A9',
    '#73A857'
  ];

  function getQuotes() {
    return $.ajax({
      headers: {
        Accept: 'application/json'
      },
      url:
        'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json',
      success: function (jsonQuotes) {
        if (typeof jsonQuotes === 'string') {
          quotesData = JSON.parse(jsonQuotes);
          console.log('quotesData');
          console.log(quotesData);
        }
      }
    });
  }

var getQuote = () => {
    change_background()
    var quote = quotesData.quotes[Math.floor(Math.random() * quotesData.quotes.length)];
    console.log(quote);
    $('#text').text(quote.quote);
    $('#author').text(quote.author);
}
var change_background = function() {
    var color = colors[Math.floor(Math.random() * colors.length)]
    $(document.body).css( "background", color );
    $(document.body).css('color', color);
    $("#new-quote").css('background', color);
 }


$(document).ready(function(){
    getQuotes()
    console.log('ready');
    $("#new-quote").on('click', getQuote)
 });
 
 

