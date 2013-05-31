// Este é o nosso "main"


(function($) {
    'use strict';
    var socket = io.connect('http://localhost:' + PORT);
    var client_id = null;

    var template = {
        message: $('#template-message').html(),
        user_connected: $('#template-user-connected').html()
    };

    var $message_wall = $('#conversation');
    var $list_of_users = $('#users');
    var $count_users = $('#counter span');
    var $nickname_box = $('#nickname');
    var $reply_box = $('#replybox form');
    var $message_box = $('#message');

    /***** LISTA DE LISTENERS *****/

    socket.on('start', function(data) {
        client_id = data.id;
        $nickname_box.val(data.nick);

        $message_wall.append(Mustache.render(template.message, data.message));
    });

    socket.on('connected_users', function(data) {
        var users = [];

        for(var x=0; x<data.length; x++) {
            users.push(Mustache.render(template.user_connected, data[x]));
        }

        $count_users.text(data.length);
        $list_of_users.html(users.join(''));
    });

    socket.on('message', function(data) {
        $message_wall.append(Mustache.render(template.message, data));

        $('html,body').animate({
            scrollTop: $message_wall.height()
        }, 'slow');
    });

    /***** EVENTOS DISPARADOS PELO CLIENTE *****/

    $nickname_box.on('change', function() {
        socket.emit('change_nick', {nick: $(this).val()});
    });

    $reply_box.submit(function() {
        socket.emit('message', {
            message: $message_box.val()
        })

        return false;
    });

    $list_of_users.on('click', 'a', function() {
        socket.emit('not_implemented');

        return false;
    });
})(jQuery);
