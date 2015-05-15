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
    var id = req.params.id;
    var member = req.body;
    console.log(member)
    member._id = mongodb.getId(member._id);
    mongodb.db().collection('members').update({}, member, function (err, data)
    {
        var d = data;
        console.log('member updated successfully');
    })
    res.end();
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
    Member.find().skip(6 * (pageId - 1)).limit(6).exec(function (err, result)
    {
        res.send(result);
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
    //mongodb.db().collection("members")
    //    .aggregate(
    //    {
    //        $match:
    //        {
    //            email: email
    //        }
    //    },
    //    {
    //        $unwind: '$cities'
    //    },
    //    {
    //        $match:
    //        {
    //            'cities.selected': true
    //        }
    //    },
    //    {
    //        $group:
    //        {
    //            _id: email,
    //            email:
    //            {
    //                $push: '$email'
    //            },
    //            birthday:
    //            {
    //                $push: '$birthday'
    //            },
    //            city:
    //            {
    //                $push: '$cities'
    //            },
    //            habits:
    //            {
    //                $push: '$habits'
    //            },
    //            genders:
    //            {
    //                $push: '$genders'
    //            },
    //            zodiacs:
    //            {
    //                $push: '$zodiacs'
    //            },
    //            eyeColors:
    //            {
    //                $push: '$eyeColors'
    //            },
    //            hairColors:
    //            {
    //                $push: '$hairColors'
    //            },
    //            images:
    //            {
    //                $push: '$images'
    //            }
    //        }
    //    }, function(err, item)
    //    {
    //        res.send(item);
    //        console.log(email)
    //    })


}

module.exports.count = function (req, res)
{
    Member.count(
        {}, function (err, result)
        {
            res.send(
                {
                    'result': result
                });
        });
}
