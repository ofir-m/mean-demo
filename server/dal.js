var dbManager = require('./dbManager');
//var dbSeeder = require('./data/dbSeeder');
//var entitiesManager= require('./data/entitiesManager');
var q = require('q');
var Dal= function ()
{
    var self=this;
    //dbManager.on('db connected', function ()
    //{
    //    self.init();
    //})


    this.getEntitiesFromDb = function (entities)
    {
        var deferred = q.defer();
        dbManager.db.collection('entities').findOne(function (err,entities)
        {
            if(err)
            {
                deferred.reject(err)
            }
            deferred.resolve(entities)
        });
        return deferred.promise
    }

    this.insertMember = function (member)
    {
        dbManager.db.collection('members').insert(member);
    }



    this.insertEntities = function (entities)
    {
        var deferred = q.defer();
        dbManager.db.collection('entities').insertOne(entities,function (err,result)
        {
            if(err)
            {
                deferred.reject(err)
            }
            entities=result.ops["0"]
            deferred.resolve(entities)
        });
        return deferred.promise
    }

    this.updateMember = function (req, res)
    {
        // var id = req.params.id;
        var member = req.body;
        console.log(member)
        var id = dbManager.getId(member._id);
        delete member._id;
        dbManager.db.collection('members').update({_id: id}, member, function (err, data)
        {
            var d = data;
            var response;
            if (err)
            {
                response = {'message': 'member update failed'};
            }
            else
            {

                response = {'message': 'member updated successfully'};
            }
            res.send(response);
        })

    }


    this.getMembersByPage = function (req, res)
    {
        var pageId = req.params.pageId
        dbManager.db.collection("members").find({}, {skip: 6 * (pageId - 1), limit: 6}).toArray(function (err, docs)
        {
            res.send(docs);
        });
    }

    this.getCities = function (req, res)
    {
        var email = 'maorof@gmail.com';
        var prefix = req.params.prefix;
        var regex = new RegExp("^" + prefix);
        console.log(prefix)
        dbManager.db.collection("members")
            .aggregate(
            {
                $match: {
                    email: email
                }
            },
            {
                $unwind: '$cities'
            },
            {
                $match: {
                    'cities.name': regex
                }
            },
            {
                $group: {
                    _id: 'email',
                    cities: {
                        $push: '$cities'
                    }
                }
            },
            function (err, result)
            {
                if (!result[0])
                {
                    res.send([]);
                }
                else
                {
                    res.send(result[0].cities.sort());
                }


            });

    }
    this.getUserById = function (id,callback)
    {
        var id = dbManager.getId(id);
        var user=null;
        dbManager.db.collection("members").findOne(
            {
                '_id':  id
            }, function (err, member)
            {
                if  (member)
                {
                    var cities = member.cities
                    for (var i = 0, length = cities.length; i < length; i++)
                    {
                        var city = cities[i];
                        if (city.selected)
                        {
                            member.city = city;
                            console.log(city.name)
                        }
                    }
                    user= member;
                }
                callback(user)
            })

    }
    this.getUserByEmail = function (email,callback)
    {
        //  var id = dbManager.getId(id);
        var user=null;
        dbManager.db.collection("members").findOne(
            {
                'email':  email
            }, function (err, member)
            {
                if  (member)
                {
                    var cities = member.cities
                    for (var i = 0, length = cities.length; i < length; i++)
                    {
                        var city = cities[i];
                        if (city.selected)
                        {
                            member.city = city;
                            console.log(city.name)
                        }
                    }
                    user= member;
                }
                callback(user)
            })

    }
    this.getUserById = function (id,callback)
    {
        var id = dbManager.getId(id);
        var user=null;
        dbManager.db.collection("members").findOne(
            {
                '_id':  id
            }, function (err, member)
            {
                if  (member)
                {
                    var cities = member.cities
                    for (var i = 0, length = cities.length; i < length; i++)
                    {
                        var city = cities[i];
                        if (city.selected)
                        {
                            member.city = city;
                            console.log(city.name)
                        }
                    }
                    user= member;
                }
                callback(user)
            })

    }
    this.getMemberFromSession = function (req, res)
    {
        console.log('asfdasadsf')
        res.send(req.user);


    }
    this.getMemberDetails = function (req, res)
    {
        var email = req.params.email;
        dbManager.db.collection("members").findOne(
            {
                'email': email
            }, function (err, member)
            {
                var cities = member.cities
                for (var i = 0, length = cities.length; i < length; i++)
                {
                    var city = cities[i];
                    if (city.selected)
                    {
                        member.city = city;
                        console.log(city.name)
                    }
                }
                res.send(member);
                console.log(email)
            })


    }

    this.count = function (req, res)
    {
        dbManager.db.collection("members").count({}, function (err, docs)
        {
            res.send(
                {
                    'result': docs
                });
        });
    }

}


module.exports = new Dal()