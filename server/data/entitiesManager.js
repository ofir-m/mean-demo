var xml2js = require('xml2js'),
    fs = require('fs'),
    utils = require('../utils'),
    pluralize = require('pluralize'),
    dbManager = require('../dbManager'),
    dal = require('../dal'),
    async = require("async"),
    random = require("random-js")(),
    moment = require('moment'),
    q = require('q'),
    memberFactory=require('../data/memberFactory'),
    parser = new xml2js.Parser();

var EntitiesManager = function ()
{
    var self = this;
    this.entities = {
        'Gender': [],
        'Habit': [],
        'Zodiac': [],
        'City': [],
        'Age': [],
        'EyeColor': [],
        'Children': [],
        'HairColor': []
    }

    this.traverseEntites= function (callback)
    {
        for(var name in this.entities)
        {
            var values=this.entities[name];
            callback(name,values);
        }
    }
    dbManager.on('db connected', function ()
    {
        dal.getEntitiesFromDb().then(function (dbEntities)
        {
            if (dbEntities)
            {
                return dbEntities;

            } else
            {
                return self.populateEntitesfromXml().then(function (entities)
                {
                    return dal.insertEntities(entities)
                });
            }
        }).then(function (dbEntities)
        {
            self.entities = dbEntities;
           // memberFactory.create100Members();
        });
    })


    var Entity = function (id, name, selected)
    {
        this.id = id;
        this.name = name;
        this.selected = selected;
    }


    this.populateEntitesfromXml = function ()
    {
        var deferred = q.defer();
        var promises = [];
        for (var name in this.entities)
        {
            var promise = getEntityValues(name);
            promises.push(promise);
        }
        q.all(promises).then(function (result)
            {
                for (var i = 0, len = result.length; i < len; i++)
                {
                    var obj = result[i];
                    self.entities[obj.name] = obj.values;
                }
                deferred.resolve(self.entities)
            },
            function (err)
            {
                deferred.reject(err)
            }
        )
        return deferred.promise;
    }
    //function adjustEntityName(entity)
    //{
    //    return pluralize(utils.toCamelCase(entity));
    //}

    function getEntityFilePathByName(name)
    {
        var filename = utils.toPascalCase(name) + 'Items.xml';
        return __dirname + '/entities/' + filename;
    }

    function getEntityValues(name)
    {
        var deferred = q.defer();
        var filePath = getEntityFilePathByName(name);
        fs.readFile(filePath, function (err, data)
        {
            if (err)
            {
                deferred.reject(err)
            }
            parser.parseString(data, function (err, result)
            {
                if (err)
                {
                    deferred.reject(err)
                }
                var nodes = result.options.option;
                var values = [];
                var length = nodes.length;
                var selectedId = random.integer(1, length);
                var selected = false;
                for (var i = 0; i < length; i++)
                {
                    var item = nodes[i].$;
                    //selected = item.id == selectedId ? true : false;
                    //var entity = new Entity(item.id, item.name, selected)
                    var entity = new Entity(item.id, item.name, false)
                    values.push(entity)
                }
                var obj = {name: name, values: values}
                deferred.resolve(obj)
            });
        });
        return deferred.promise;
    }
}
module.exports = new EntitiesManager();
