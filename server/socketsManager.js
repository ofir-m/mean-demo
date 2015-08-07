
var SocketsManager= function (server,sessionMiddleware)
{
    var dal= require('./dal')
    var io = require('socket.io').listen(server);
    var users = {};
    io.use(function (socket, next)
    {
        sessionMiddleware(socket.request, socket.request.res, next);
    });
    io.sockets.on('connection', function (socket)
    {
        var session = socket.request.session;

        var socketId = socket.id;
        if (session.passport && socketId)
        {
            var userId = session.passport.user;
            (function (socketId)
            {
                var user = dal.getUserById(userId, function (user)
                {


                    users[user.email] = {socketId:socketId,username:user.username};
                    console.log(users);
                });
            }(socketId));

        }

        socket.on('send message', function (data)
        {
            var t = data;
            var receiverEmail = data.receiverEmail;
            var senderEmail = data.senderEmail;
            var receiverSocket = users[receiverEmail].socketId;
            var receiverUsername = users[receiverEmail].username;
            var senderUsername = users[senderEmail].username;
            var message = data.message;
            this.emit('get message', message,senderEmail,receiverEmail,senderUsername,receiverUsername,true);
            if (io.sockets.connected[receiverSocket])
            {
                io.sockets.connected[receiverSocket].emit('get message', message,senderEmail,receiverEmail,senderUsername,receiverUsername,false);
            }
        })

        //socket.on('new user', function (data)
        //{
        //   console.log(data)
        //})
    })
}


module.exports=SocketsManager;
