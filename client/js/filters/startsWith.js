/**
 * Created by maorof on 15/05/15.
 */
app.filter('startsWith', function ()
{
    function strStartsWith(str, prefix)
    {
        return (str).indexOf(prefix) === 0;
    }

    return function (items, prefix)
    {
        var filtered = [];
        if(!items||prefix.length<2)return filtered;
        for (var i = 0; i < items.length; i++)
        {
            var item = items[i];
            if(strStartsWith(item.name, prefix))
            {
                filtered.push(item);
            }
        }
        return filtered;
    };
});
