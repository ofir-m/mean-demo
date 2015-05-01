var entities = ['Gender', 'Habit', 'Zodiac', 'City', 'Age', 'EyeColor','Children','HairColor']
//var entities = ['Gender', 'Habit', 'Zodiac','Age', 'EyeColor','Children','HairColor']
//var entities = ['City']
var traverse = function(func)
{
    for (var i = 0, length = entities.length; i < length; i++)
    {
        var entity = entities[i];
        func(entity)

    };
}
module.exports = entities

module.exports.traverse = traverse
