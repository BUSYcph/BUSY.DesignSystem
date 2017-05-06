define(['facade', 'polyfills/closest'], function ( facade ) {

    var Messenger = function ( element ) {
        this.element = element;

        this.messageIndex = [];

        this.init();
    };

    Messenger.prototype.init = function () {
        this.enableScripting();

        this.messageIndex = this.messageIndexing();

        facade.subscribe('message:complete', this.beginNextMessage, this);
        facade.subscribe('message:remove', this.removeMessage, this);
        facade.subscribe('messenger:scroll', this.updateScroll, this);

        this.beginNextMessage();
    };

    Messenger.prototype.beginNextMessage = function () {
        var nextMessage = this.messageIndex.shift();

        setTimeout(function () {
            facade.publish('message:incoming:' + nextMessage);
        }, 800);
    };

    Messenger.prototype.messageIndexing = function () {
        var messageIndex = [];

        this.element.querySelectorAll('[data-component="message"]').forEach(function (message) {
            messageIndex.push( message.getAttribute('data-message-id') );
        });

        return messageIndex;
    };

    Messenger.prototype.enableScripting = function () {
        this.element.querySelectorAll('.m-messenger__line--auto-animate').forEach(function(messageLine) {
            messageLine.classList.remove('m-messenger__line--auto-animate');
        });
    };

    Messenger.prototype.updateScroll = function ( messageId ) {
        var message = this.element.querySelector('[data-message-id="'+messageId+'"]');

        message.closest('.m-messenger__line').scrollIntoView(false);
    };

    return Messenger;
    
});