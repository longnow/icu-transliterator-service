const fs = require('fs');
const os = require('os');
const express = require('express');
const bodyParser = require('body-parser');

const RBT = require('icu-transliterator').RBT;
registerCustomTransliterators();

const app = express();
app.disable('x-powered-by');

let listenDefault = 'localhost';
let mountDir = '/';
configToolforge();

app.use(bodyParser.text({ type: '*/*' }));

const router = express.Router();
app.use(mountDir, router);
router.post('/:id', transliterate(RBT.FORWARD));
router.post('/:id/forward', transliterate(RBT.FORWARD));
router.post('/:id/reverse', transliterate(RBT.REVERSE));

app.listen(process.env.PORT || 3000, process.env.LISTENADDR || listenDefault);

function configToolforge() {
  const matches = os.userInfo().username.match(/^tools\.(.+)$/);
  if (matches) {
    listenDefault = '0.0.0.0';
    mountDir = '/' + matches[1];
    app.use(require('cors'));
  }
}

function registerCustomTransliterators() {
  const transliterators = __dirname + '/transliterators.json';
  if (fs.existsSync(transliterators)) {
    const t = require(transliterators);

    t.forEach(function (obj) {
      RBT.register(obj.name, obj.rules);
    });
  }
}

function transliterate(dir) {
  return function(req, res) {
    try {
      let output = RBT(req.params.id, dir).transliterate(req.body);
      if (req.headers['user-agent'] && req.headers['user-agent'].match(/^curl\//)) {
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
