define(['facade', 'components/message/messages', 'polyfills/closest'], function ( facade, messages ) {

    var Messenger = function ( element ) {
        this.element = element;

        this.messageIndex = [];
        this.optionsMap = {}

        this.init();
    };

    Messenger.prototype.init = function () {
        this.enableScripting();
    };

    Messenger.prototype.messagesReady = function () {
        facade.publish('loader:refresh');

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
        }, 1000);
    };

    Messenger.prototype.messageIndexing = function () {
        var messageIndex = [];

        this.element.querySelectorAll('[data-component="message"]').forEach(function (message) {
            messageIndex.push( message.getAttribute('data-message-id') );
        });

        return messageIndex;
    };

    Messenger.prototype.enableScripting = function () {
        this.element.innerHTML = '';

        this.populateMessages();
    };

    Messenger.prototype.mapOptions = function () {
        var optionsMap = this.optionsMap;
        
        messages.forEach(function (message, i) {
            if (typeof message.options !== 'undefined') {
                optionsMap[message.id] = message.options;
            }
        });
    };

    Messenger.prototype.populateMessages = function () {
        var self = this;
        var messagesHTML = [];

        messages.forEach(function (message, i) {
            messagesHTML.push(self.createMessage(message));
        });      

        this.element.innerHTML = messagesHTML.join('');

        this.messagesReady();
    };

    Messenger.prototype.createMessage = function (message) {
        var messageHTML = '';
        var hasOptions = typeof message.options !== 'undefined';

        messageHTML += '<li class="m-messenger__line';

        if (!message.isRecipient) {
            messageHTML += ' t-text--right';
        }
        messageHTML += '">';
        
        messageHTML += '<div class="a-message a-message--messenger';

        if (message.isRecipient) {
            messageHTML += ' a-message--recipient';
        }else{
            messageHTML += ' a-message--sender';
        }
        messageHTML += '" data-message="'+ message.message +'" data-component="message" data-message-id="'+ message.id +'"';

        if (hasOptions) {
            messageHTML += 'data-options="'+ message.id +'"';
        }

        messageHTML += '></div>';
        messageHTML += '</li>';

        return messageHTML;
    };

    Messenger.prototype.updateScroll = function ( messageId ) {
        var message = this.element.querySelector('[data-message-id="'+messageId+'"]');

        message.closest('.m-messenger__line').scrollIntoView(false);
    };

    return Messenger;
    
});