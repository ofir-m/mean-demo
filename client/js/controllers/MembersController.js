app.controller('MembersController', function ($scope, $routeParams, $route, $resource, Member, Members, Count, $state,$compile)
{
    $scope.sumOfPages={}
    var count = Count.get({}, function(data)
    {
    	$scope.sumOfPages = data.result;
    },function(data)
    {
    	//alert(data)
    });
    //$scope.members = Members.query({pageId: $stateParams.pageId}, function (data)
    //{
    //    console.log("members:")
    //    console.log(data)
    //});
    $scope.member = {}
    $scope.$state = $state
    //$scope.pageId = $route.pageId;

    //$state.go('members.page',{pageId:1})



})

