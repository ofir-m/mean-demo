/**
 * Created by maorof on 15/05/15.
 */

app.factory('Member', function($resource)
{
    return $resource('/api/member');
}).factory('Member1', function($resource)
{
    return $resource('/api/member/:id', {},
        {
            update: { method: 'PUT' }
        });
}).factory('MemberDetails', function($resource)
{
    return $resource('/api/member/details/:email');
}).factory('Cities', function($resource)
{
    return $resource('/api/cities/:prefix');
}).factory('Count', function($resource)
{
    return $resource('/api/members/count');
}).factory('Members', function($resource)
{
    return $resource('/api/members/page/:pageId');
}).factory('Genders', function($resource)
{
    return $resource('/api/genders');
}).factory('Habits', function($resource)
{
    return $resource('/api/habits');
}).factory('Zodiacs', function($resource)
{
    return $resource('/api/zodiacs');
}).factory('Images', function($resource)
{
    return $resource('/api/images/:email/:index',
        {},
        {
            remove:
            {
                method: 'DELETE'
            }
        });
});
