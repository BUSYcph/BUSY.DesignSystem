define(['facade', 'components/message/messages', 'polyfills/closest'], function ( facade, messages ) {

    var Messenger = function ( element ) {
        this.element = element;
        this.list = this.element.querySelector('.m-messenger__list');
        this.options = this.element.querySelector('.m-messenger__options');

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
        facade.subscribe('message:options', this.showOptions, this);
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

        this.list.querySelectorAll('[data-component="message"]').forEach(function (message) {
            messageIndex.push( message.getAttribute('data-message-id') );
        });

        return messageIndex;
    };

    Messenger.prototype.enableScripting = function () {
        this.list.innerHTML = '';

        this.mapOptions();
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
        var messagesHTML = [];

        messages.forEach(function (message, i) {
            messagesHTML.push(this.createMessage(message));
        }.bind(this));      

        this.list.innerHTML = messagesHTML.join('');

        this.messagesReady();
    };

    Messenger.prototype.showOptions = function (messageId) {
        var optionsHTML = [];
        console.log(this.optionsMap);
        var options = this.optionsMap[messageId];

        options.forEach(function(option, i) {
            optionsHTML.push(this.createOption(option));
        }.bind(this));

        this.options.innerHTML = optionsHTML.join('');
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

    Messenger.prototype.createOption = function (option) {
        var optionHTML = '';

        optionHTML += '<div class="a-message a-message--option a-message--option--'+option.role+'"';
        optionHTML += ' data-action="'+option.action+'"';
        optionHTML += '>';
        optionHTML += '<div class="a-message__text--transparent a-message__text">'+option.message+'</div>';
        optionHTML += '</div>';

        return optionHTML;
    };

    Messenger.prototype.updateScroll = function ( messageId ) {
        var message = this.list.querySelector('[data-message-id="'+messageId+'"]');

        message.closest('.m-messenger__line').scrollIntoView(false);
    };

    return Messenger;
    
});