var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    passport = require('passport'),
    passportLocal = require('passport-local').Strategy,
    expressSession = require('express-session'),
    cookieParser = require('cookie-parser'),
    fs = require("fs"),
    fse = require('fs-extra'),
    dal = require('./server/dal.js'),
    dbBuilder = require('./server/data/dbBuilder.js'),
    util = require('util'),
    sassMiddleware = require('node-sass-middleware'),
    inspect = require('eyes').inspector(),
    path = require('path'),
    chance = require('chance').Chance(),
    mongodb = require('./server/mongo');

var connectionString = 'mongodb://localhost:27017/mean-demo';
mongodb.connect(connectionString, function ()
{
    console.log('Connected to MongoDB.');
    dbBuilder.buildMember()

});


//=====================================================================================
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({secret: 'mySecretKey'}));

//=====================================================================================
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(function (username, password, done)
{
    var user = dal.getUser(username, function (user)
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
//=====================================================================================

var done = false

/*Configure the multer.*/

app.use(multer(
    {
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

//=====================================================================================
app.use(sassMiddleware(
    {
        src: __dirname + "/public",
        dest: __dirname + "/public",
        debug: true,
        force: true
    }));
app.use(express.static(path.join(__dirname, 'public')));
//=====================================================================================
app.use('/bower_components', express.static(__dirname + '/bower_components'))
app.use('/templates', express.static(__dirname + '/client/templates'))
app.use('/js', express.static(__dirname + '/client/js'))
app.use('/css', express.static(__dirname + '/client/css'))
app.use('/views', express.static(__dirname + '/client/views'))
app.use('/images', express.static(__dirname + '/client/images'))
//=====================================================================================
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
app.post('/api/member', dal.create)
app.put('/api/member/:id', dal.updateMember)//todo: remove the id parameter because it is in the member obj
app.get('/api/member/details/:email', dal.getMemberDetails)
app.get('/api/members/count', dal.count)
app.get('/api/members/page/:pageId', dal.getMembersByPage)
app.get('/login', function (req, res)
{
    res.sendFile(__dirname + '/client/login.html');
})



//app.post('/login', passport.authenticate('local'), function (req, res)
//{
//    res.sendFile(__dirname + '/client/login.html');
//})
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
    res.send('Successfully authenticated');
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
//=====================================================================================
app.listen(3000);
