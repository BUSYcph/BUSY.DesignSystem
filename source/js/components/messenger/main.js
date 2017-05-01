define(['facade', 'jquery'], function ( facade, $ ) {
    var Messenger = function ( element ) {
        this.element = element;
        this.$element = $(element);

        this.messageIndex = [];

        this.init();
    };

    Messenger.prototype.init = function () {
        this.enableScripting();
        this.messageIndex = this.messageIndexing();

        facade.subscribe('message:complete', this.beginNextMessage, this);
        facade.subscribe('message:remove', this.removeMessage, this);

        this.beginNextMessage();
    };

    Messenger.prototype.beginNextMessage = function () {
        var nextMessage = this.messageIndex.shift();

        setTimeout(function () {
            facade.publish('message:incoming:' + nextMessage);
            facade.publish('message:new');
        }, 500);
    };

    Messenger.prototype.messageIndexing = function () {
        var index = [];
        
        this.$element.find('[data-component="message"]').each(function () {
            index.push( $(this).data('messageId') );
        });

        return index;
    };

    Messenger.prototype.enableScripting = function () {
        this.$element.find('.m-messenger__line--auto-animate').removeClass('m-messenger__line--auto-animate');
    };

    Messenger.prototype.removeMessage = function ( element ) {
        var messageLine = element.closest('.m-messenger__line');

        setTimeout(function () {
            messageLine.css({
                width: '0px',
                height: '0px',
                minWidth: '0px',
                minHeight: '0px'
            });
        }, 500);
    };

    return Messenger;
});