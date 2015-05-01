app.controller('RegisterController', function($scope, $resource, Member,Member1, MemberDetails, Count, Habits, Genders, Zodiacs, Cities)
{
    //var count = Count.get({}, function(data) {
    //	$scope.count = data.result;
    // alert(data)
    //});
    // MemberDetails.query(
        // {
        //     'email': 'maorof@gmail.com'
        // }, function(data)
        // {
        //     $scope.member = data[0]
        //     console.log(data);

        // });


    //$scope.closeAllSelectBoxes = function($event)
    //{
    //    if (!event) return;
    //    var field = $(event.target).closest('.editor');
    //    if (field.length == 0)
    //    {
    //        $scope.$broadcast('closeSelectBoxes')
    //    }
    //
    //}
    $scope.updateMember = function()
    {
        var member = new Member1($scope.member)
        member.$update({id:$scope.member._id},function(data)
        {
            console.log(data);

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
