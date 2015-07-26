app.controller('MembersPageController', function ($scope, $resource, $routeParams, $stateParams, Member, Members, Count, $state)
{
    console.log($stateParams.pageId)
    $scope.members = Members.query({pageId: $stateParams.pageId}, function (data)
    {
        console.log("members:")
        console.log(data)
    });
})