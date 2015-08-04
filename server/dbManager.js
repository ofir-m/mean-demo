var mongodb = require('mongodb');
var client = mongodb.MongoClient;
var EventEmitter = require("events").EventEmitter;
var util         = require("util");
var DbManager= function ()
{
    EventEmitter.call(this);
    var self=this;
    this.db=null;
    this.connect= function (connectionString, callback)
    {
        client.connect(connectionString, function (err, db)
        {
            self.db = db;
            self.emit('db connected');
            if (callback)
            {
                callback();
            }
        });
    },

    this.close= function ()
    {
        this.db.close();
    },
    this.getId= function (id)
    {
        return new mongodb.ObjectID(id);
    }
}

util.inherits(DbManager, EventEmitter);

module.exports=new DbManager();

