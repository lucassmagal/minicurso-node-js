var express = require('express'),
    app = express();


/* Neste exemplo vamos nos aproximar de uma organização mais comum:
ao invés de escrever nossa resposta em html no *res* (UGH!), vamos
renderizar um template.
*/
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


/* A configuração deste é básica, a única diferença é
a função "render".
*/
app.get('/', function(req, res) {
    res.render('index', {title: 'Hello world!'});
});


/* Nesta função passaremos um nome como parâmetro da url:
/hello?name=lucas
*/
app.get('/hello', function(req, res) {
    res.render('hello', {name: req.query['name']});
    // res.render('hello', {name: req.query.name});
});

/* /hello/lucas */
app.get('/hello/:name', function(req, res) {
    res.render('hello', {name: req.params.name});
});


app.listen(3000);
console.log('Listening on port 3000...'); 
