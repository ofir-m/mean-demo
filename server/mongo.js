var mongodb = require('mongodb');
var client = mongodb.MongoClient      ;
var myDb;

module.exports = {
    connect: function(dburl, callback)
    {
        client.connect(dburl,
            function(err, db)
            {
                myDb = db;
                if (callback)
                {
                    callback();
                }
            });
    },
    db: function()
    {
        return myDb;
    },
    close: function()
    {
        myDb.close();
    },
    getId: function (id)
    {
      return new mongodb.ObjectID(id);
    }
};
