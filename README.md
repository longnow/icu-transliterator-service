# icu-transliterator-service

This is a simple node.js web service to transliterate text via ICU [rule-based transliterators](http://userguide.icu-project.org/transforms/general#TOC-Rule-Based-Transliterators). It requires the `icu-transliterator` module, for which you will need to [install ICU components](https://github.com/longnow/node-icu-transliterator).

To start the server, install modules via `npm install`, then simply run:

```
$ node index.js
```

The server will listen on `localhost`. The default port is 3000, which you can override with the `PORT` environment variable.

To use the server, POST the text you wish to transliterate to a path containing the registered transliterator ID. The response will be the transliteration in plain text. For example:

```
$ curl http://localhost:3000/Latin-Cyrillic -d 'Dostoevskij'
Достоевский
```

The default transliteration direction is forward. You may add `/forward` or `/reverse` to the path to explicitly specify it:

```
$ curl http://localhost:3000/Latin-Cyrillic/reverse -d 'Достоевский'
Dostoevskij
```

The server will make available all rule-based transliterators provided with your version of ICU. You may also supply custom transliterators. To do so, create a file `transliterators.json` in the same directory as `index.js`, with the following format:

```
[
  {
    "name": "…",
    "rules": "…"
  },
  {
    "name": "…",
    "rules": "…"
  }
]
```

The server will read this file at startup and register a transliterator for each object in the array. It will register the transliterator as `name`, using the string in `rules` for the rules (see ICU docs for syntax). See `transliterators-sample.json` for an example containing a Balinese transliterator.
