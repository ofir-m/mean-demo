app.service('chatManager', function ($compile)
{

    var self = this;
    var taskbar = $('#taskbar')

    this.addChat = function (scope,receiverEmail)
    {
        var el = $compile('<chat member="member" receiver-email="'+receiverEmail+'"></chat>')(scope);
        taskbar.append(el);
    }


});