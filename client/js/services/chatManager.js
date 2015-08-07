app.service('chatManager', function ($compile,$rootScope)
{

    var self = this;
    var taskbar = $('#taskbar')

    this.addChat = function (scope,receiverEmail)
    {
        var chatElement = $compile('<chat member="member" receiver-email="'+receiverEmail+'"></chat>')(scope);
        taskbar.append(chatElement);
    }
    this.removeChat = function (scope,receiverEmail)
    {

    }
    this.connect = function ($rootScope)
    {
       $rootScope.socket=io.connect();
    }
    


});