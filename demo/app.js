var express = require('express'),
    http = require('http'),
    socketio = require('socket.io');

var app = express();
var PORT = process.env.PORT || 3000;
var clients = [];  // aqui guardaremos os clientes conectados

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Teremos apenas um controller, para servir a nossa página
app.get('/', function(req, res) {
    res.render('index', {port: PORT});
});

var io = socketio.listen(app.listen(PORT));
console.log('Listening on ' + PORT + '...');

// Aqui programaremos o chat em si
io.sockets.on('connection', function(socket) {
    var nick = 'user' + new Date().getTime();
    clients.push({id: socket.id, nick: nick});

    // atualiza todos os clientes sobre a lista de users conectados
    io.sockets.emit('connected_users', clients);

    // envia uma mensagem de boas vindas ao usuário recém-conectado
    socket.emit('start', {
        id: socket.id,
        nick: nick,
        message: {
            message: 'Bem vindo ao ENCATEC Chat! O código-fonte está em ',
            nick: 'chatbot',
            id: 'chatbot'
        }
    });

    // programa sua retirada da lista de clientes, se desconectar
    socket.on('disconnect', function() {
        // como um user se desconectou, vamos buscar seu nome na lista de clients,
        // removê-lo de lá e então atualizar todos os clientes
        for(var x=0; x<clients.length; x++) {
            if(clients[x].id == socket.id) {
                clients.splice(x, 1);
                break;
            }
        }

        io.sockets.emit('connected_users', clients);
    });

    // altera o nick de um cliente
    socket.on('change_nick', function(data) {
        var pos = get_client_pos(socket.id);

        if(pos != null) {
            clients[pos].nick = data.nick;
            io.sockets.emit('connected_users', clients);
        }
    });

    // ao receber uma mensagem, envia a todos os usuarios
    socket.on('message', function(data) {
        var nick = null, pos = get_client_pos(socket.id);

        if(pos != null) {
            nick = clients[pos].nick;
            io.sockets.emit('message', {
                id: socket.id,
                nick: nick,
                message: data.message
            });
        }
    });

    // TAREFA DE CASA: implementar a feature de mandar uma mensagem pra um client
    socket.on('not_implemented', function() {
        socket.emit('message', {
            id: 'chatbot',
            nick: 'chatbot',
            message: ('Hey, o chat ainda não é capaz de mandar mensagens a um ' +
                'usuário em específico. Que tal implementar isso?')
        });
    });
});


// helpers
function get_client_pos(id) {
    for(var x=0; x<clients.length; x++) {
        if(clients[x].id == id) {
            return x;
        }
    }

    return null;
}
