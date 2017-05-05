define(['facade', 'jquery'], function ( facade, $ ) {
    var Message = function ( element ) {
        this.element = element;
        this.$element = $(element);

        this.message = this.$element.data('message');
        this.messageId = this.$element.data('messageId');
        this.messagesSinceBirth = -1;
        this.messageStale = false;
        
        this.messageLength = this.message.length;

        this.init();
    };

    Message.prototype.init = function () {
        facade.subscribe('message:incoming:' + this.messageId, this.showLoading, this);
        facade.subscribe('message:sent:' + this.messageId, this.showContent, this);
    };

    Message.prototype.showLoading = function () {
        var self = this;
        var isRecipient = this.$element.hasClass('a-message--recipient');

        facade.publish('message:direction', isRecipient);

        // let's provide some 'realistic' writing time
        var writingTime = 1000 + (30 * this.messageLength);

        // let's bring it in, and have it shown as loading
        this.$element.addClass('a-message--incoming');
        this.$element.addClass('a-message--loading');
        this.$element.html('<span></span> <span></span> <span></span>');

        self.beSeen();

        setTimeout(function () {
            facade.publish('message:sent:' + self.messageId);
        }, writingTime);
    };

    Message.prototype.showContent = function () {
        this.messagesSinceBirth = 0;

        var self = this;

        var oldDims = this.element.getBoundingClientRect();
        var newDims;

        this.$element.removeClass('a-message--loading');
        this.$element.html('<div class="a-message__text--transparent">' + this.message + '</div>');
        
        this.beSeen();

        newDims = this.element.getBoundingClientRect();

        this.element.style.width = oldDims.width + 'px';
        this.element.style.height = oldDims.height + 'px';

        setTimeout(function () {
            self.element.style.width = newDims.width + 'px';
            self.element.style.height = newDims.height + 'px';

            self.$element.find('.a-message__text--transparent').addClass('a-message__text');

            self.releaseMe();
        }, 100);
    };

    Message.prototype.releaseMe = function () {
        var self = this;
        
        facade.publish('message:complete', this.messageId, this);

        facade.unsubscribe('message:incoming:' + this.messageId);
        facade.unsubscribe('message:sent:' + this.messageId);

        setTimeout(function() {
            self.$element.removeAttr('style');
        }, 200);
    };

    Message.prototype.beSeen = function () {
        this.element.scrollIntoView(false);
    }

  return Message;
});