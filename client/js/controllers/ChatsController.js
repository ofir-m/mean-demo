app.controller('ChatsController', function ($scope, $element,$rootScope, $resource, $compile)
{
    $scope.chats={};
    var self=this;
    var socket =$rootScope.socket;
    $scope.message = '';
    $scope.addChat = function (memberEmail,memberUsername,message)
    {
        var childScope = $scope.$new();
        var initialMessage='';
        if(message)
        {
            initialMessage=message;
        }
        var chatElement = $compile('<chat the-initial-message="'+initialMessage +'" the-member-username="'+memberUsername+'" the-member-email="'+memberEmail+'"></chat>')(childScope);


        $element.append(chatElement);
        $scope.chats[memberEmail]=chatElement;
    }

    $scope.$on('startChat', function(event, memberEmail,memberUsername)
    {
        //var receiverEmail=data.receiverEmail;
        $scope.addChat(memberEmail,memberUsername);


    });
    $scope.$on('chat closed', function(event, memberEmail)
    {

        $scope.removeChat(memberEmail);


    });
    $scope.removeChat = function (memberEmail)
    {

        delete $scope.chats[memberEmail];
    }
    socket.on('get message', function (message,senderEmail,receiverEmail,senderUsername,receiverUsername,toMySelf)
    {
        if(!$scope.chats[senderEmail] && senderEmail!=$rootScope.me.email)
        {
            $scope.addChat(senderEmail,senderUsername,message);
        }
        else{
            $rootScope.$broadcast('message arrived',{message:message,senderEmail:senderEmail,receiverEmail:receiverEmail})
        }



    })
    this.removeChat = function (scope,receiverEmail)
    {

    }
    $scope.documentClicked = function ($event)
    {


    }


})