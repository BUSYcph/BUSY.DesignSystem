define(['facade', 'components/message/messages', 'polyfills/closest'], function (facade, messages) {

    var Messenger = function (element) {
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
        facade.subscribe('messenger:hide-options', this.hideOptions, this);

        setTimeout(function () {
            this.beginNextMessage();
        }.bind(this), 1300);
    };

    Messenger.prototype.beginNextMessage = function (immediately) {
        var nextMessage = this.messageIndex.shift();
        var delay = immediately ? 1 : 1000;

        setTimeout(function () {
            facade.publish('message:incoming:' + nextMessage);
        }, delay);
    };

    Messenger.prototype.messageIndexing = function () {
        var messageIndex = [];

        this.list.querySelectorAll('[data-component="message"]').forEach(function (message) {
            messageIndex.push(message.getAttribute('data-message-id'));
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

        var options = this.optionsMap[messageId];

        options.forEach(function (option, i) {
            optionsHTML.push(this.createOption(option));
        }.bind(this));

        this.options.innerHTML = optionsHTML.join('');

        setTimeout(function () {
            this.options.querySelectorAll('.a-message--option').forEach(function (el) {
                el.addEventListener('click', this.clickOption.bind(this));
                el.classList.add('a-message--incoming');
            }.bind(this));
        }.bind(this), 100);
    };

    Messenger.prototype.hideOptions = function () {
        var lastOptions = this.options.querySelector('.a-message--option.a-message--incoming');

        // let's have our options cleaned out completely when transitions are completed
        lastOptions.addEventListener('transitionend', function (e, callee) {
            e.currentTarget.removeEventListener(e.type, callee);
            this.options.innerHTML = '';
        }.bind(this));

        // let's remove the option not selected just a tad after the one selected
        setTimeout(function () {
            this.options.querySelector('.a-message--option.a-message--incoming').classList.remove('a-message--incoming');
        }.bind(this), 200);
    };

    Messenger.prototype.clickOption = function (e, callee) {
        var action = e.currentTarget.getAttribute('data-action');
        var gaLabel = e.currentTarget.innerHTML;

        ga('send', 'event', 'chat', 'option-selected', gaLabel);

        // the next thing we're doing, is removing the options. For this we don't want distinct delays on transitions anymore. We want it to be the option clicked, that leaves first.
        this.options.querySelector('.a-message--option--primary').classList.remove('a-message--option--primary');
        this.options.querySelector('.a-message--option--secondary').classList.remove('a-message--option--secondary');

        e.currentTarget.removeEventListener(e.type, callee);
        e.currentTarget.classList.remove('a-message--incoming');

        switch (action) {
            case 'continue':
                facade.publish('message:complete', true);
                break;
            case 'navigate:services':
                window.location.href = 'services';
                break;
            case 'navigate:about':
                window.location.href = 'about';
                break;
        }

        facade.publish('messenger:hide-options');
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
        } else {
            messageHTML += ' a-message--sender';
        }

        if (message.isCentered) {
            messageHTML += ' a-message--centered';
        }

        if (message.isLarge) {
            messageHTML += ' a-message--large';
        }

        messageHTML += '" data-message="' + message.message + '" data-component="message" data-message-id="' + message.id + '"';

        if (hasOptions) {
            messageHTML += 'data-options="' + message.id + '"';
        }

        if (message.skipLoading) {
            messageHTML += 'data-skiploading="true"';
        }

        messageHTML += '></div>';
        messageHTML += '</li>';

        return messageHTML;
    };

    Messenger.prototype.createOption = function (option) {
        var optionHTML = '';

        optionHTML += '<div class="a-message a-message--option a-message--option--' + option.role + '"';
        optionHTML += ' data-action="' + option.action + '"';
        optionHTML += '>';
        optionHTML += '<div class="a-message__text--transparent a-message__text">' + option.message + '</div>';
        optionHTML += '</div>';

        return optionHTML;
    };

    Messenger.prototype.updateScroll = function (messageId) {
        var message = this.list.querySelector('[data-message-id="' + messageId + '"]');

        message.closest('.m-messenger__line').scrollIntoView(false);
    };

    return Messenger;

});