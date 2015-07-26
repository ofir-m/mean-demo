app.controller('SiteController', function ($scope,$rootScope,LoggedInMember, $resource, Member, MemberDetails, Count, Habits, Genders, Zodiacs, Cities,$compile,chatManager)
{

    LoggedInMember.get(
        {


        }, function (member)
        {

            $rootScope.member = member;
            $rootScope.me = member;
            console.log(member);

        });

    $scope.documentClicked = function ($event)
    {
        if (!event) return;
        var clickedInField = $(event.target).closest('.editor').length > 0;
        if (!clickedInField)
        {
            $scope.$broadcast('documentClicked')
        }


    }

    $scope.createMember = function ()
    {
        var member = new Member($scope.member)
        member.$save(function (data)
        {
            console.log(data);

        });

        //var count = Count.get({}, function(data) {
        //	$scope.count = data.result;

        //});

    }
})
