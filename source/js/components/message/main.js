define(['facade'], function (facade) {

    var Message = function (element) {
        this.writingDelay = 900;

        this.element = element;

        this.message = this.element.getAttribute('data-message');
        this.messageId = this.element.getAttribute('data-message-id');
        this.messageLength = this.message.length;
        this.options = this.element.getAttribute('data-options');
        this.skipLoading = this.element.getAttribute('data-skiploading');

        this.init();
    };

    Message.prototype.init = function () {
        facade.subscribe('message:incoming:' + this.messageId, this.showLoading, this);
        facade.subscribe('message:sent:' + this.messageId, this.showContent, this);
    };

    Message.prototype.showLoading = function () {
        var writingTime;

        if (this.skipLoading) {
            this.element.classList.add('a-message--incoming');

            this.scrollIntoView();

            facade.publish('message:sent:' + this.messageId);
        } else {
            // let's provide some 'realistic' writing time
            writingTime = this.writingDelay + (10 * this.messageLength);

            // let's bring it in, and have it shown as loading
            this.element.classList.add('a-message--incoming', 'a-message--loading');
            this.element.innerHTML = '<span></span> <span></span> <span></span>';

            // and make sure it's visible on screen
            this.scrollIntoView();

            setTimeout(function () {
                facade.publish('message:sent:' + this.messageId);
            }.bind(this), writingTime);
        }
    };

    Message.prototype.showContent = function () {
        var oldDims = this.element.getBoundingClientRect();
        var newDims;

        this.element.classList.remove('a-message--loading');
        this.element.innerHTML = '<div class="a-message__text--transparent">' + this.message + '</div>';

        this.scrollIntoView();

        newDims = this.element.getBoundingClientRect();

        this.element.style.width = oldDims.width + 'px';
        this.element.style.height = oldDims.height + 'px';

        setTimeout(function () {
            this.element.style.width = newDims.width + 'px';
            this.element.style.height = newDims.height + 'px';

            this.element.querySelector('.a-message__text--transparent').classList.add('a-message__text');

            if (this.options) {
                this.callForOptions();
            } else {
                this.releaseMe();
            }
        }.bind(this), 100);
    };

    Message.prototype.callForOptions = function () {
        facade.publish('message:options', this.messageId, this);
    };

    Message.prototype.releaseMe = function () {
        facade.publish('message:complete');

        facade.unsubscribe('message:incoming:' + this.messageId);
        facade.unsubscribe('message:sent:' + this.messageId);

        setTimeout(function () {
            this.element.removeAttribute('style');
        }.bind(this), 200);
    };

    Message.prototype.scrollIntoView = function () {
        facade.publish('messenger:scroll', this.messageId);
    };

    return Message;
});