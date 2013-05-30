var express = require('express'),
    app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
    res.render('index');
});


app.listen(3000);
console.log('Listening on 3000');
