var utils = {

    toCamelCase: function(str)
    {
        return str.substr(0, 1).toLowerCase() + str.substr(1);
    },

    toPascalCase: function(str)
    {
        return str.substr(0, 1).toUpperCase() + str.substr(1);
    }

}

module.exports = utils;
