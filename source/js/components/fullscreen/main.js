define(function() {
    'use strict';

    var scrollDirection, hold, panels, self;

    var FullScreen = function (element) {
        self = this;

        this.element = element;

        panels = this.element.querySelectorAll('.full-screen-panel').length;
        hold = false;
        scrollDirection;

        this.init();
    };

    FullScreen.prototype.init = function () {
        this.element.style.transform = 'translateY(0)';

        this.element.addEventListener('wheel', function(e) {
            if (e.deltaY < 0) {
                scrollDirection = 'down';
            }
            if (e.deltaY > 0) {
                scrollDirection = 'up';
            }
            e.stopPropagation();
        });

        this.element.addEventListener('wheel', this.scrollY);
        
        this.swipe(this.element);
    };

    FullScreen.prototype.scrollY = function (obj) {
        var slength, plength, pan, step = 100,
            vh = window.innerHeight / 100,
            vmin = Math.min(window.innerHeight, window.innerWidth) / 100;
        
        if ((this !== undefined && this.id === 'fullscreen') || (obj !== undefined && obj.id === 'fullscreen')) {
            pan = this || obj;
            plength = parseInt(pan.offsetHeight / vh, 10);
        }
        if (pan === undefined) {
            return;
        }

        plength = plength || parseInt(pan.offsetHeight / vmin, 10);
        slength = parseInt(pan.style.transform.replace('translateY(', ''), 10);
        
        if (scrollDirection === 'up' && Math.abs(slength) < (plength - plength / panels)) {
            slength = slength - step;
        } else if (scrollDirection === 'down' && slength < 0) {
            slength = slength + step;
        } else if (scrollDirection === 'top') {
            slength = 0;
        }
        if (hold === false) {
            hold = true;
            pan.style.transform = 'translateY(' + slength + 'vh)';
            setTimeout(function() {
                hold = false;
            }, 1000);
        }
    };
        
    FullScreen.prototype.swipe = function (obj) {
        var swdir,
            sX,
            sY,
            dX,
            dY,
            threshold = 100,
            /*[min distance traveled to be considered swipe]*/
            slack = 50,
            /*[max distance allowed at the same time in perpendicular direction]*/
            alT = 500,
            /*[max time allowed to travel that distance]*/
            elT, /*[elapsed time]*/
            stT; /*[start time]*/
        obj.addEventListener('touchstart', function(e) {
            var tchs = e.changedTouches[0];
            swdir = 'none';
            sX = tchs.pageX;
            sY = tchs.pageY;
            stT = new Date().getTime();
            //e.preventDefault();
        }, false);

        obj.addEventListener('touchmove', function(e) {
            e.preventDefault(); /*[prevent scrolling when inside DIV]*/
        }, false);

        obj.addEventListener('touchend', function(e) {
            var tchs = e.changedTouches[0];
            dX = tchs.pageX - sX;
            dY = tchs.pageY - sY;
            elT = new Date().getTime() - stT;
            if (elT <= alT) {
                if (Math.abs(dX) >= threshold && Math.abs(dY) <= slack) {
                    swdir = (dX < 0) ? 'left' : 'right';
                } else if (Math.abs(dY) >= threshold && Math.abs(dX) <= slack) {
                    swdir = (dY < 0) ? 'up' : 'down';
                }
                if (obj.id === 'fullscreen') {
                    if (swdir === 'up') {
                        scrollDirection = swdir;
                        self.scrollY(obj);
                    } else if (swdir === 'down' && obj.style.transform !== 'translateY(0)') {
                        scrollDirection = swdir;
                        self.scrollY(obj);

                    }
                    e.stopPropagation();
                }
            }
        }, false);
    }

    return FullScreen;
});