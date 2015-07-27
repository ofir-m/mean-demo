app.controller('ChatsController', function ($scope, $element,$rootScope, $resource, $compile)
{
    $scope.chats=[];
    var self=this;
    $scope.addChat = function (receiverEmail)
    {
        var childScope = $scope.$new();
        var chatElement = $compile('<chat receiver-email="'+receiverEmail+'"></chat>')(childScope);
        $element.append(chatElement);
        $scope.chats.push(chatElement)
    }

    $scope.$on('startChat', function(event, receiverEmail)
    {
        //var receiverEmail=data.receiverEmail;
        $scope.addChat(receiverEmail);


    });
    this.removeChat = function (scope,receiverEmail)
    {

    }
    $scope.documentClicked = function ($event)
    {


    }


})