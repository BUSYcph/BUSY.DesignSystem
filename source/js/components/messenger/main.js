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
        facade.subscribe('message:entered', this.updateScroll, this);
        facade.subscribe('message:direction', this.hackDirection, this);

        this.beginNextMessage();
    };

    Messenger.prototype.beginNextMessage = function () {
        var nextMessage = this.messageIndex.shift();

        setTimeout(function () {
            facade.publish('message:incoming:' + nextMessage);
        }, 800);
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

    Messenger.prototype.hackDirection = function (isRecipient) {
        var direction = isRecipient ? 'ltr' : 'rtl';

        this.$element.css({
            'direction' : direction
        });
    }

    return Messenger;
});