define(['facade', 'jquery'], function ( facade, $ ) {
    var Message = function ( element ) {
        this.element = element;
        this.$element = $(element);

        this.message = this.$element.data('message');
        this.messageId = this.$element.data('messageId');
        this.messagesSinceBirth = -1;
        
        this.messageLength = this.message.length;

        this.init();
    };

    Message.prototype.init = function () {
        facade.subscribe('message:new', this.stayFresh, this);
        facade.subscribe('message:incoming:' + this.messageId, this.showLoading, this);
        facade.subscribe('message:sent:' + this.messageId, this.showContent, this);
    };

    Message.prototype.showLoading = function () {
        var self = this;
        var loadTime = 1000 + (30 * this.messageLength);

        this.$element.addClass( 'message--incoming' );
        this.$element.addClass( 'message--loading' );
        this.$element.html( '<span></span><span></span><span></span>' );

        setTimeout(function () {
            facade.publish('message:sent:' + self.messageId);
        }, loadTime);
    };

    Message.prototype.showContent = function () {
        this.messagesSinceBirth = 0;

        var self = this;

        var oldDims = this.element.getBoundingClientRect();
        var newDims;

        this.$element.removeClass( 'message--loading' );
        this.$element.html('<div class="message__text--transparent">' + this.message + '</div>');

        newDims = this.element.getBoundingClientRect();

        this.element.style.width = oldDims.width + 'px';
        this.element.style.height = oldDims.height + 'px';

        setTimeout(function () {
            self.element.style.width = newDims.width + 'px';
            self.element.style.height = newDims.height + 'px';

            self.$element.find('div').addClass('message__text');
        }, 100);

        this.releaseMe();
    };

    Message.prototype.releaseMe = function () {
        facade.publish('message:complete', this.messageId, this);
        facade.unsubscribe('message:incoming:' + this.messageId);
        facade.unsubscribe('message:sent:' + this.messageId);
    };

    Message.prototype.stayFresh = function () {
        if (this.messagesSinceBirth === -1) return;

        this.messagesSinceBirth = this.messagesSinceBirth + 1;
        
        if (this.messagesSinceBirth > 2) {
            this.tearDown();
        }
    };

    Message.prototype.tearDown = function () {
        //this.$element.html('');

        //facade.publish('message:remove', this.$element );
    };

    return Message;
});