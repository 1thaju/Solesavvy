const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();
try {
  sneaks.getMostPopular(10, function(err, products){
    if(err) console.log(err);
    else console.log(products);
  });
} catch (e) { console.log(e); }
