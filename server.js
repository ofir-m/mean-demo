var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    passport = require('passport'),
    passportLocal = require('passport-local').Strategy,
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    cookieParser = require('cookie-parser'),
    fs = require("fs"),
    fse = require('fs-extra'),
    dal = require('./server/dal.js'),
       util = require('util'),
    sassMiddleware = require('node-sass-middleware'),
    path = require('path'),
    dbManager = require('./server/dbManager'),
    entitiesManager = require('./server/data/entitiesManager'),
    users = {};

var connectionString = 'mongodb://localhost:27017/mean-demo';
dbManager.connect(connectionString, function ()
{
    console.log('Connected to MongoDB.');
    //dbSeeder.buildMember()
   // dbSeeder.saveEntities();

});


//=====================================================================================
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//========================================  session  =====================================================
var sessionMiddleware = session({
    secret: 'mySecretKey',
    store: new MongoStore({url: 'mongodb://localhost:27017/sessions'})
})
app.use(sessionMiddleware);

//======================================== passport =====================================================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(function (username, password, done)
{
    var user = dal.getUserByEmail(username, function (user)
    {
        if (!user)
        {
            console.log('User Not Found with username ' + username);
            done(null, false);
        }
        //// User exists but wrong password, log the error
        //if (!isValidPassword(user, password)){
        //    console.log('Invalid Password');
        //    return done(null, false,
        //        req.flash('message', 'Invalid Password'));
        //}
        // User and password both match, return user from
        // done method which will be treated like success
        done(null, user);
    });

}))
passport.serializeUser(function (user, done)
{
    done(null, user._id);
});

passport.deserializeUser(function (id, done)
{
    var user = dal.getUserById(id, function (user)
    {

        done(null, user);
    });
});
//=====================================================================================

var done = false

/*Configure the multer.*/

app.use(multer({
    dest: './uploads/',
    rename: function (fieldname, filename)
    {
        //return filename + Date.now();
        return filename;
    },
    onFileUploadStart: function (file)
    {
        done = false;
        console.log(file.originalname + ' is starting ...')
    },
    onFileUploadComplete: function (file)
    {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done = true;
    },
    changeDest: function (dest, req, res)
    {
        //dest = dest + req.params.email;
        dest = '.' + req.originalUrl;
        fse.mkdirs(dest, function (err)
        {
            if (err) return console.error(err);

            console.log("success!")
        });

        return dest;

    }
}));

//===================================== sass ================================================
app.use(sassMiddleware(
    {
        src: __dirname + "/public",
        dest: __dirname + "/public",
        debug: true,
        force: true
    }));
app.use(express.static(path.join(__dirname, 'public')));
//================================= folders shortcuts ====================================================
app.use('/bower_components', express.static(__dirname + '/bower_components'))
app.use('/templates', express.static(__dirname + '/client/templates'))
app.use('/js', express.static(__dirname + '/client/js'))
app.use('/css', express.static(__dirname + '/client/css'))
app.use('/views', express.static(__dirname + '/client/views'))
app.use('/images', express.static(__dirname + '/client/images'))

//======================================== file upload =====================================================
app.post('/fileUpload/:email', function (req, res)
{
    if (done == true)
    {
        var index = req.body.index;
        var width = req.body.width;
        var height = req.body.height;
        var email = req.params.email;
        var file = req.files.file
        req.files.file.index = index;
        req.files.file.width = width;
        req.files.file.height = height;
        // req.files.file.empty = false;
        console.log('index = ' + index + ' email = ' + email + ' width = ' + width + ' height = ' + height);
        // console.dir(req.params.email);
        //res.end("File uploaded.");
        mongodb.db().collection("members").update(
            {
                'email': 'maorof@gmail.com',
                "images.index": index
            },
            {
                "$set": {
                    "images.$": file
                }
            })
    }
    res.end();
});

app.get('/fileUpload/:email/:image', function (req, res)
{
    var email = req.params.email;
    var image = req.params.image;
    var path = 'fileUpload/' + email + '/' + image;
    res.sendfile(path)


})

app.use(function (req, res, next)
{
    if (req.user || req.originalUrl == '/login')
    {
        next();
    } else
    {
        res.redirect('/login');
    }
});
//===========================================================================================================
//app.post('/api/member', dal.create)
app.get('/api/loggedInMember', dal.getMemberFromSession)
app.put('/api/member/:id', dal.updateMember)//todo: remove the id parameter because it is in the member obj
app.get('/api/member/details/:email', dal.getMemberDetails)
app.get('/api/members/count', dal.count)
app.get('/api/members/page/:pageId', dal.getMembersByPage)
app.get('/login', function (req, res)
{
    res.sendFile(__dirname + '/client/login.html');
})

app.get('/chat', function (req, res)
{
    res.sendFile(__dirname + '/client/chat.html');
})

app.get('/logout', function (req, res)
{
    req.logout();
    res.redirect('/login')
})

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/loginSuccess',
        failureRedirect: '/loginFailure'
    })
);

app.get('/loginFailure', function (req, res, next)
{
    res.send('Failed to authenticate');
});

app.get('/loginSuccess', function (req, res, next)
{
    // res.send('Successfully authenticated');
    res.redirect('/register')

});
app.delete('/api/images/:id/:index', function (req, res)
{
    // var filepath = '.' + req.params.filepath;
    var id = req.params.id;
    var index = req.params.index;
    console.log('from delete: ' + id + '	' + index)

    var imageDetails = mongodb.db().collection("members").findOne(
        {
            '_id': mongodb.getId(id)

        },
        {
            images: {
                $elemMatch: {
                    index: index
                }
            }
        }, function (err, result)
        {
            var image = result.images[0];
            // console.log(result[0].images)
            var filepath = image.path;
            console.log(filepath)
            fse.remove(filepath, function (err)
            {
                if (err) return console.error(err)
                var index = req.body.index;

                console.log('image removed from fs!')
            })
            mongodb.db().collection("members").update(
                {
                    'id': id,
                    "images.index": index
                },
                {
                    "$set": {
                        "images.$": {index: index}
                    }
                })
        });

    res.end()
})
app.get('/api/cities/:prefix?', dal.getCities)
//=====================================================================================
app.get('/*', function (req, res)
{

    res.sendFile(__dirname + '/client/index.html');
});
//==================================================================================================
var server = app.listen(3000);
//===================================  socket.io  ==================================================
var io = require('socket.io').listen(server);
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
                var email = user.email
                users[email] = socketId;
                console.log(users);
            });
        }(socketId));

    }

    socket.on('send message', function (data)
    {
        var t = data;
        var receiverEmail = data.receiverEmail;
        var receiverSocket = users[receiverEmail];
        var message = data.message;
        if (io.sockets.connected[receiverSocket])
        {
            io.sockets.connected[receiverSocket].emit('get message', message);
        }
    })

    //socket.on('new user', function (data)
    //{
    //   console.log(data)
    //})
})

