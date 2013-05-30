/* Aqui importamos o "express" e criamos um app,
que será responsável por responder às nossas requisições
*/

var express = require('express'),
    app = express();


/* Isso é um "controller". Um controller é uma função que responde
à requisições de uma url. No express, controllers devem sempre receber
dois parâmetros, req (o request) e res (o response).

Enquanto *req* possui dados sobre a requisição (quem chamou a url, os headers,
etc.), *res* é quem será usado para enviar uma resposta ao cliente (o browser).
*/
function hello(req, res) {
    var answer = 'Hello world!';

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', answer.length);
    res.end(answer);
}

app.get('/hello', hello);


/* Também é possível escrever a função direto em app.get. Nos dois casos,
a função passada como parâmetro é normalmente chamada "callback". Em resumo,
é o código que será executado caso sua respectiva url seja chamada.

A sintaxe abaixo é bastante comum no mundo JS.
*/
app.get('/hello-simple', function(req, res) {
    res.send('Simple Hello World!');
});


app.listen(3000);
console.log('Listening on port 3000...');   
