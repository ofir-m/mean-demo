app.controller('RegisterController', function($rootScope,$scope, $resource, Member,Member1,LoggedInMember, MemberDetails, Count, Habits, Genders, Zodiacs, Cities)

{


    $scope.updateMember = function()
    {
        var member = new Member1($scope.member)
        member.$update({id:$scope.member._id},function(response)
        {
            alert(response.message)

        });



    }
    $scope.createMember = function()
    {
        var member = new Member($scope.member)
        member.$save(function(data)
        {
            console.log(data);

        });

        //var count = Count.get({}, function(data) {
        //	$scope.count = data.result;

        //});

    }
})
