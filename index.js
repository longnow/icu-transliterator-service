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

app.listen(process.env.PORT || 3000, 'localhost');

function registerCustomTransliterators() {
  let transliterators = __dirname + '/transliterators.json';
  if (fs.existsSync(transliterators)) {
    let t = require(transliterators);

    t.forEach(function (obj) {
      RBT.register(obj.name, obj.rules);
    });
  }
}

function transliterate(dir) {
  return function(req, res) {
    try {
      let output = RBT(req.params.id, dir).transliterate(req.body);
      if (req.headers['user-agent'].match(/^curl\//)) {
        output += '\n';
      }

      res.set('Content-type', 'text/plain');
      res.send(output);
    } catch (e) {
      console.error(e);
      res.sendStatus(409);
    }
  }
}
