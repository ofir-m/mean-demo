var xml2js = require('xml2js'),
    fs = require('fs'),
    utils = require('../utils'),
    pluralize = require('pluralize'),
    selectboxesEntities = require('./selectboxesEntities'),
    Selectbox = require('../models/selectbox'),
    Member = require('../models/Member'),
    mongodb = require('../mongo'),
    async = require("async"),
    chance = require('chance').Chance(),
    faker=require('faker'),
    random = require("random-js")(),
    moment = require('moment'),
    parser = new xml2js.Parser();


var buildMembers = function()
{

}
var buildMember = function()
{
    var member = new Member();
    member.email = "maorof@gmail.com";
    member.email =faker.internet.email()
    member.birthday=moment().subtract(random.integer(18, 80), 'years').format('DD/MM/YYYY')
    member.images = [
    {
        index: '1'
    },
    {
        index: '2'
    },
    {
        index: '3'
    },
    {
        index: '4'
    }];
    async.forEach(selectboxesEntities, function(entity, callback)
    {
        buildMemberCollection(member, entity, callback);
    }, function(err)
    {
        if (err) return next(err);
        mongodb.db().collection('members').insert(member)
    });



}

function getFilePathByCollectionName(collectionName)
{
    var filename = utils.toPascalCase(collectionName) + 'Items.xml';
    return __dirname + '/selectboxes/' + filename;
}

function getMemberPropertyByCollectionName(collectionName)
{
    return pluralize(utils.toCamelCase(collectionName));
}
var buildMemberCollection = function(member, collectionName, callback)
    {
        var filePath = getFilePathByCollectionName(collectionName);
        fs.readFile(filePath, function(err, data)
        {
            var memberProp = getMemberPropertyByCollectionName(collectionName);
            parser.parseString(data, function(err, result)
            {

                var nodes = result.options.option;
                var arr = [];
                var length = nodes.length;

                var selectedId = random.integer(1, length);

                var selected = false;
                for (var i = 0; i < length; i++)
                {
                    var item = nodes[i].$;

                    //if (item.id == selectedId &&memberProp=='cities')
                        if (item.id == selectedId)
                    {
                        selected = true;
                        console.log(memberProp + '   ' + item.id + '   ' + item.name)
                    }
                    else
                    {
                        selected = false;
                    }
                    var selectbox = new Selectbox(item.id, item.name, selected)
                    arr.push(selectbox)
                };
                // console.log(memberProp)
                member[memberProp] = arr;
                callback()
            });
        });
    }

var buildAllMemberCollections = function(member)
{
    selectboxesEntities.traverse(function(entity)
    {
        //removeCollection(entity);
        buildMemberCollection(member, entity);

    })
}

function createSelectBoxDocument(document, model)
{
    var item = new model(document);
    item.save();
}

var removeCollection = function(collectionName)
{
    // mongoose.connection.db.dropCollection(pluralize(collectionName), function(err, result)
    // {
    //     console.log('collection ' + pluralize(collectionName) + ' dropped')
    // });

}

var buildCollection = function(collectionName)
{
    var filePath = __dirname + '/selectboxes/' + utils.toPascalCase(collectionName) + 'Items.xml'
    fs.readFile(filePath, function(err, data)
    {
        parser.parseString(data, function(err, result)
        {
            var model = selectboxes[utils.toCamelCase(collectionName)]
            var items = result.options.option;

            for (var i = 0, length = items.length; i < length; i++)
            {
                var document = items[i].$;
                console.log(document.id + '     ' + document.name)
                    // if (document.id ==3 || document.id == 5) {
                    //  document.selected = true
                    // } else {
                    //  document.selected = false;
                    // }
                createSelectBoxDocument(document, model);
            };

        });
    });
}

var buildAllCollections = function()
{
    selectboxesEntities.traverse(function(entity)
    {
        //removeCollection(entity);
        buildCollection(entity);

    })
}
var removeAllCollections = function(collectionName)
{
    selectboxesEntities.traverse(function(entity)
    {
        removeCollection(entity);
        //removeCollection(entity);

    })
}


module.exports.removeCollection = removeCollection;
module.exports.buildCollection = buildCollection;
module.exports.buildAllCollections = buildAllCollections;
module.exports.removeAllCollections = removeAllCollections;
module.exports.buildMember = buildMember;
module.exports.buildMemberCollection = buildMemberCollection;
