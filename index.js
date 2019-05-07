const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const RBT = require('icu-transliterator').RBT;
registerCustomTransliterators();

let app = express();
app.disable('x-powered-by');
app.use(bodyParser.text({ type: '*/*' }));

app.post('/:id', transliterate(RBT.FORWARD));
app.post('/:id/forward', transliterate(RBT.FORWARD));
app.post('/:id/reverse', transliterate(RBT.REVERSE));

app.listen(process.env.PORT || 3000);

function registerCustomTransliterators() {
  if (fs.existsSync('./transliterators.json')) {
    let t = require('./transliterators.json');

    t.forEach(function (obj) {
      RBT.register(obj.name, obj.rules);
    });
  }
}

function transliterate(dir) {
  return function(req, res) {
    try {
      let myRBT = RBT(req.params.id, dir);
      res.set('Content-type', 'text/plain');
      res.send(myRBT.transliterate(req.body));
    } catch (e) {
      console.error(e);
      res.sendStatus(409);
    }
  }
}
