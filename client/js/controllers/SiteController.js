app.controller('SiteController', function($scope, $resource, Member, MemberDetails, Count, Habits, Genders, Zodiacs, Cities)
{
    //var count = Count.get({}, function(data) {
    //	$scope.count = data.result;
    // alert(data)
    //});
    MemberDetails.get(
    {
        'email': 'maorof@gmail.com'
    }, function(member)
    {
        //for(var i=0;i<member.cities.length;i++)
        //{
        //    var city=member.cities[i];
        //    if(city.selected)
        //    {
        //        member.city =city;
        //        console.log(city.name)
        //    }
        //
        //}
        $scope.member = member;
        console.log(member);

    });

    $scope.closeAllSelectBoxes = function($event)
    {
        if (!event) return;
        var clickedInField = $(event.target).closest('.editor').length>0;
        if (!clickedInField)
        {
            $scope.$broadcast('closeSelectBoxes')
        }

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
