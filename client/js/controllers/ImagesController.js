app.controller('ImagesController', function($scope, $resource, Member, MemberDetails, Count, Habits, Genders, Zodiacs, Cities)
{
    $scope.number = 4;
    $scope.getNumber = function(num)
    {
        return new Array(num);
    }

})
