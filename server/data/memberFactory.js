var xml2js = require('xml2js'),
    fs = require('fs'),
    utils = require('../utils'),
    pluralize = require('pluralize'),
    mongodb = require('../dbManager'),
    async = require("async"),
    faker = require('faker'),
    random = require("random-js")(),
    moment = require('moment'),
    q = require('q'),
//entitiesManager = require('./entitiesManager'),
    dal = require('../dal'),
    parser = new xml2js.Parser();

var MemberFactory = function ()
{

    function getPropertyNameFromEntityName(entityName)
    {
        return pluralize(utils.toCamelCase(entityName));
    }
    this.create100Members= function ()
    {
        for(var i=0;i<100;i++)
        {
            this.createMember();
        }
    }
    this.createMember = function ()
    {
        var member = {};
        member.email = "maorof@gmail.com";
        member.email = faker.internet.email()
        member.username = member.email.match(/^([^@]*)@/)[1];
        member.birthday = moment().subtract(random.integer(18, 80), 'years').format('DD/MM/YYYY')
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
        var entitiesManager = require('./entitiesManager');
        entitiesManager.traverseEntites(function (name, values)
        {
            var property = getPropertyNameFromEntityName(name)
            member[property] = values;
        })
        dal.insertMember(member);
    }


    function createSelectBoxDocument(document, model)
    {
        var item = new model(document);
        item.save();
    }

    this.removeCollection = function (collectionName)
    {
        // mongoose.connection.db.dropCollection(pluralize(collectionName), function(err, result)
        // {
        //     console.log('collection ' + pluralize(collectionName) + ' dropped')
        // });

    }

    this.buildCollection = function (collectionName)
    {
        var filePath = __dirname + '/entitiesManager/' + utils.toPascalCase(collectionName) + 'Items.xml'
        fs.readFile(filePath, function (err, data)
        {
            parser.parseString(data, function (err, result)
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
                }
                ;

            });
        });
    }

    this.buildAllCollections = function ()
    {
        selectboxesEntities.traverse(function (entity)
        {
            //removeCollection(entity);
            buildCollection(entity);

        })
    }
    this.removeAllCollections = function (collectionName)
    {
        selectboxesEntities.traverse(function (entity)
        {
            removeCollection(entity);
            //removeCollection(entity);

        })
    }
}


module.exports = new MemberFactory();

