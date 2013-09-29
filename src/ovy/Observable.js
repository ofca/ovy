define('ovy/ObservableEvent', function() {

    /**
     * Observable class.
     *
     * @class ovy.ObservableEvent
     */
    function ObservableEvent(o) {
        this.stopped = false;
        this.args = o.args || [];
    };

    ObservableEvent.prototype = {
        constructor: ObservableEvent,
        stop: function() {
            this.stopped = true;
        }
    };

    function Observable() {
        var me = this;

        me.events = {};
    };

    return ObservableEvent;

});

define('ovy/Observable', ['ovy/ObservableEvent'], function(ObservableEvent) {

    /**
     * Observable class.
     *
     * @class ovy.Observable
     * @abstract
     */
    function Observable() {};

    Observable.prototype = {
        constructor: Observable,
        /**
         * @property {Object} events List of events available in this component
         * and attached listeners to them.
         * @protected
         * @readonly
         */
        events: {},
        /**
         * Adds event.
         * 
         * @param {String} name Event name.
         * @private
         * @return {ovy.Observable}
         */
        addEvent: function(name) {
            var me = this,
                i = arguments.length,
                events = me.events;
            
            while (i--) {
                if ( ! events[arguments[i]]) {
                    events[arguments[i]] = [];
                }
            }

            return this;
        }, // eo addEvent
        /**
         * Adds listener to event.
         * 
         *     this.addListener('eventName', function(){}, this, {});
         * 
         * @param {String}   e  Event name.
         * @param {Function} fn Function to call on event fire.
         * @param {Object} [scope=Object which fire the event] The scope in which the handler function is executed.
         * @param {Object} [o]  Additional options passed to event.
         * 
         * Additional configuration:
         *
         * - **once** : Boolean 
         *
         *   Call listener only once, and remove them.
         *
         * @return {this}
         */
        addListener: function(e, fn, scope, o) {
            if (this.events[e]) {
                this.events[e].push({
                    fn: fn,
                    once: o.once || false,
                    scope: scope || null
                });
            }

            return this;
        }, // eo addListener
        addListeners: function(list) {
            var evt, handler;

            for (evt in list) {
                if (typeof handler == 'object') {
                    this.addListener(evt, handler.fn, handler.scope, handler);
                } else {
                    this.addListener(evt, list[evt]);
                }
            }

            return this;
        },
        /**
         * Fires specified event.
         * 
         * @param  {String} name Event name
         * @param  {Array} args Arguments passed to listeners.
         * @return {this}
         */
        fireEvent: function(name, args) {
            var me = this,
                evt = me.events[name],
                event = new ObservableEvent({
                    args: args
                }),
                i = 0, 
                len = evt.length,
                listenerArgs = [event].concat(args),
                listener,
                arr = [];

            if ( ! evt || ! e.length) {
                return this;
            }

            for (; i < len, listener = evt[i]; i++) {
                listener.fn.apply(me, listenerArgs);

                if ( ! evt.once) {
                    arr.push(listener);
                }

                if (event.stopped) {
                    break;
                }
            }

            me.events[name] = arr;

            return this;
        } // eo fireEvent
    };

    return Observable;

});