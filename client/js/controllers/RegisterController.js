app.controller('RegisterController', function($rootScope,$scope, $resource, Member,Member1,LoggedInMember, MemberDetails, Count, Habits, Genders, Zodiacs, Cities)

{


    $scope.updateMember = function()
    {
        var member = new Member1($scope.me)
        member.$update({id:$scope.me._id},function(response)
        {
            alert(response.message)

        });



    }
    $scope.createMember = function()
    {
        var member = new Member($scope.me)
        member.$save(function(data)
        {
            console.log(data);

        });

        //var count = Count.get({}, function(data) {
        //	$scope.count = data.result;

        //});

    }
})
