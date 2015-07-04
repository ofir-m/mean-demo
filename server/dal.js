var mongodb = require('./mongo'),
    Member = require('./models/Member');

module.exports.create = function (req, res)
{
    var member = new Member(req.body);
    member.save();
    res.end();
}

module.exports.updateMember = function (req, res)
{
    // var id = req.params.id;
    var member = req.body;
    console.log(member)
    var id = mongodb.getId(member._id);
    delete member._id;
    mongodb.db().collection('members').update({_id: id}, member, function (err, data)
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

module.exports.getAllMembers = function (req, res)
{
    Member.find(
        {}).exec(function (err, result)
        {
            res.send(result);
        });
}

module.exports.getMembersByPage = function (req, res)
{
    var pageId = req.params.pageId
    mongodb.db().collection("members").find({}, {skip: 6 * (pageId - 1), limit: 6}).toArray(function (err, docs)
    {
        res.send(docs);
    });
}

module.exports.getCities = function (req, res)
{
    var email = 'maorof@gmail.com';
    var prefix = req.params.prefix;
    var regex = new RegExp("^" + prefix);
    console.log(prefix)
    mongodb.db().collection("members")
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
module.exports.getUserById = function (id,callback)
{
      var id = mongodb.getId(id);
    var user=null;
    mongodb.db().collection("members").findOne(
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
module.exports.getUser = function (email,callback)
{
 //  var id = mongodb.getId(id);
    var user=null;
    mongodb.db().collection("members").findOne(
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
module.exports.getMemberDetailsFromSession = function (req, res)
{
    console.log('asfdasadsf')
    res.send(req.user);


}
module.exports.getMemberDetails = function (req, res)
{
    var email = req.params.email;
    mongodb.db().collection("members").findOne(
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

module.exports.count = function (req, res)
{
    mongodb.db().collection("members").count({}, function (err, docs)
        {
            res.send(
                {
                    'result': docs
                });
        });
}
