(function (ctx, undefined) {

    /**
     * A fast, elegant, powerful, and cross platform JavaScript OOP library.
     * Support statics, singleton, super call, private, mixins, inherits and more.
     * 
     * @class ovy
     * @singleton
     */
    var ovy = {},
        AUTO_ID = 1000,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        CONFIG_RESERVED_KEYS = ['extend', 'constructor', 'statics', 'mixins', 'inherits'],
        TemplateClass = function () {};

    /**
     * Apply function.
     *
     *     @example
     *     var defaults = { foo: 'foo', bar: 'bar' };
     *     var config = { bar: 'bar2', tap: 'tap', constructor: function() {} }
     *
     *     var object = ovy.apply(defaults, config, ['constructor']);
     *
     *     // Result
     *     // {
     *     //     foo: 'foo',
     *     //     bar: 'bar2',
     *     //     tap: 'tap'
     *     // }
     * 
     * @param  {Object} object Target object (keys in this object will be overwrited).
     * @param  {Object} config Source object.
     * @param  {Array} filter Array of keys to omit.
     * @return {Object}
     */
    ovy.apply = function (object, config, filter) {
        if (object && config && typeof config === 'object') {
            var key;

            for (key in config) {
                if (!filter || filter.indexOf(key) == -1) {
                    object[key] = config[key];
                }
            }
        }

        return object;
    };

    ovy.apply(ovy, {
        /**
         * Return unique numerical id.
         * 
         * @param  {String} prefix
         * @return {String}
         */
        uid: function(prefix) {
            return (prefix ? prefix.toString() : '') + (++AUTO_ID);
        },
        /**
         * Test if variable is null, undefined or is empty string or is empty array.
         * 
         * @param  {Mixed} value Value to test.
         * @param  {Boolean} allowEmptyString Allow string to be empty.
         * @return {Boolean} 
         */
        isEmpty: function (value, allowEmptyString) {
            return (value === null) || (value === undefined) || (!allowEmptyString ? value === '' : false) || (ovy.isArray(value) && value.length === 0);
        },
        /**
         * Returns true if passed value is Array, false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isArray: ('isArray' in Array) ? Array.isArray : function (value) {
            return toString.call(value) === '[object Array]';
        },
        /**
         * Returns true if passed value is Function, false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isFunction: function (value) {
            return value && typeof value === 'function';
        },
        /**
         * Returns true if passed value is Object, false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isObject: function (value) {
            return value && typeof value === 'object';
        },
        /**
         * Returns true if passed value is simple Object, false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isSimpleObject: function (value) {
            return value instanceof Object && value.constructor === Object;
        },
        /**
         * Returns true if passed value is primitive (string, number, boolean), 
         * false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isPrimitive: function (value) {
            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },
        /**
         * Returns true if passed value is finite number, false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isNumber: function (value) {
            return typeof value === 'number' && isFinite(value);
        },
        /**
         * Returns true if passed value is finite numeric, false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isNumeric: function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },
        /**
         * Returns true if passed value is string, false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isString: function (value) {
            return typeof value === 'string';
        },
        /**
         * Returns true if passed value is boolean, false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isBoolean: function (value) {
            return typeof value === 'boolean';
        },
        /**
         * Returns true if passed value is defined, false otherwise.
         * 
         * @param  {Mixed} value Value to test.
         * @return {Boolean}
         */
        isDefined: function (value) {
            return typeof value !== 'undefined';
        },
        /**
         * Returns true if the passed value is iterable, false otherwise
         * 
         * @param {Object} value The value to test
         * @return {Boolean}
         */
        isIterable: function (value) {
            var type = typeof value,
                checkLength = false;
            if (value && type != 'string') {
                // Functions have a length property, so we need to filter them out
                if (type == 'function') {
                    // In Safari, NodeList/HTMLCollection both return "function" when using typeof, so we need
                    // to explicitly check them here.
//                        if (Ext.isSafari) {
//                            checkLength = value instanceof NodeList || value instanceof HTMLCollection;
//                        }
                } else {
                    checkLength = true;
                }
            }
            return checkLength ? value.length !== undefined : false;
        }
    });

    ovy.apply(ovy, {
        /**
         * Copies all the properties of object to object if they don't already exists.
         * @param  {Object} object Target object.
         * @param  {Object} config Source object
         * @param  {Array} filter Keys to omit.
         * @return {Object}
         */
        applyIf: function (object, config, filter) {
            var property;

            if (object) {
                for (key in config) {
                    if ( ! filter || filter.indexOf(key) == -1) {
                        if (object[key] === undefined) {
                            object[key] = config[key];
                        }
                    }
                }
            }

            return object;
        },

        merge: function (destination) {
            var i = 1,
                ln = arguments.length,
                mergeFn = ovy.merge,
                cloneFn = ovy.clone,
                object, key, value, sourceKey;

            for (; i < ln; i++) {
                object = arguments[i];

                for (key in object) {
                    value = object[key];
                    if (value && value.constructor === Object) {
                        sourceKey = destination[key];
                        if (sourceKey && sourceKey.constructor === Object) {
                            mergeFn(sourceKey, value);
                        }
                        else {
                            destination[key] = cloneFn(value);
                        }
                    }
                    else {
                        destination[key] = value;
                    }
                }
            }

            return destination;
        },

        clone: function (item) {
            var type,
                i,
                clone,
                key;

            if (item === null || item === undefined) {
                return item;
            }

            type = toString.call(item);

            // Date
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            // Array
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = ovy.clone(item[i]);
                }
            }
            // Object
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = ovy.clone(item[key]);
                }
            }

            return clone || item;
        },

        chain: function (object) {
            TemplateClass.prototype = object;
            var result = new TemplateClass();
            TemplateClass.prototype = null;
            return result;
        },
        ns: function() {
            var root, i, len, ns, j, sublen, part;

            for (i = 0, len = arguments.length; i < len; i++) {
                root = ctx;
                ns = arguments[i].split('.');

                for (j = 0, sublen = ns.length; j < sublen; j++) {
                    part = ns[j];

                    if ( ! root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }               
            }

            return root;
        },
        proxy: function(fn, scope) {
            return function() {
                fn.apply(scope, arguments);
            }
        }
    });

    function Base() {}

    /**
     * Defines new class.
     * 
     * @param  {String|Object} className Class name or class members (collection 
     * of class members in key-value pairs)
     * @param  {Object} data (optional) Class members if first param is class name.
     * @return {Object}
     */
    function define(className, data) {
        data = ovy.isString(className) ? (data || {}) : className;
        data.$className = className || null;

        return extend(typeof data.extend == 'function' ? data.extend : Base, data);
    }

    function makeCtor(parent) {
        if (parent.constructor === Object) {
            return function () {
            };
        } else {
            return ofwrap(parent.constructor);
        }
    }

    function ofwrap(fn) {
        var Cls;
        switch (fn.length) {
            case 0:
                Cls = function () { fn.call(this); };
                break;
            case 1:
                Cls = function (a) { fn.call(this, a); };
                break;
            case 2:
                Cls = function (a1, a2) { fn.call(this, a1, a2); };
                break;
            case 3:
                Cls = function (a1, a2, a3) { fn.call(this, a1, a2, a3); };
                break;
            case 4:
            default:
                Cls = function () { fn.apply(this, arguments); };
        }
        return Cls;
    }

    function extend(parentClass, data) {
        if (!data) {
            data = parentClass;
            parentClass = Base;
        }
        var parent = parentClass.prototype,
            prototype = ovy.chain(parent),
            body = (ovy.isFunction(data) ? data.call(prototype, parent, parentClass) : data) || {},
            cls;

        if (ovy.isFunction(body)) {
            cls = body;
        } else if (body.constructor !== Object) {
            cls = body.constructor;
        } else {
            cls = makeCtor(parent);
        }

        prototype.constructor = cls;
        cls.prototype = prototype;

        // the '$super' property of class refers to its super prototype        
        cls.$super = parent;

        // the '$superclass' property of class refers to its super class
        // cls.$superclass is for backward compatibility use cls.$parent instead
        cls.$parent = cls.$superclass = parentClass;

        if (typeof body === 'object') {
            process(cls, body, prototype);
            if (body.singleton) {
                cls = new cls();
            }
        }

        return cls;
    }

    function process(targetClass, data, targetPrototype) {
        var prototype = targetPrototype || targetClass.prototype,
            statics = data.statics,
            mixins = data.mixins,
            inherits = data.inherits;

        if (statics) {
            // copy static properties from statics to class
            ovy.apply(targetClass, statics);
        }
        if (mixins) {
            processMixins(targetClass, mixins, targetPrototype)
        }
        if (inherits) {
            processInherits(targetClass, inherits, targetPrototype);
        }

        ovy.apply(prototype, data, CONFIG_RESERVED_KEYS);

        if (data.toString !== Object.prototype.toString) {
            prototype.toString = data.toString;
        }
    }

    function processInherits(targetClass, inherits, targetPrototype) {
        var i, ln;

        if (!targetPrototype) {
            targetPrototype = targetClass.prototype;
        }

        if (inherits instanceof Array) {
            for (i = 0, ln = inherits.length; i < ln; i++) {
                mixin(targetClass, null, inherits[i], targetPrototype);
            }
        }
        else {
            for (var mixinName in inherits) {
                if (inherits.hasOwnProperty(mixinName)) {
                    mixin(targetClass, null, inherits[mixinName], targetPrototype);
                }
            }
        }
    }

    function processMixins(targetClass, mixins, targetPrototype) {
        var name, item, i, ln;

        if (!targetPrototype) {
            targetPrototype = targetClass.prototype;
        }

        if (mixins instanceof Array) {
            for (i = 0, ln = mixins.length; i < ln; i++) {
                item = mixins[i];
                name = item.prototype.mixinId || item.$mixinId;
                if (!name) {
                    name = item.$mixinId = ovy.uid('mixin_');
                }

                mixin(targetClass, name, item, targetPrototype);
            }
        }
        else {
            for (var mixinName in mixins) {
                if (mixins.hasOwnProperty(mixinName)) {
                    mixin(targetClass, mixinName, mixins[mixinName], targetPrototype);
                }
            }
        }
    }

    function mixin(target, name, mixinClass, targetPrototype) {
        var mixin = mixinClass.prototype,
            prototype = targetPrototype || target.prototype,
            key;

        if (name) {
            if (!prototype.hasOwnProperty('mixins')) {
                if ('mixins' in prototype) {
                    prototype.mixins = ovy.chain(prototype.mixins);
                }
                else {
                    prototype.mixins = {};
                }
            }
        }

        for (key in mixin) {
            if (name && (key === 'mixins')) {
                ovy.merge(prototype.mixins, mixin[key]);
            }
            else if (typeof prototype[key] == 'undefined' && key != 'mixinId') {
                prototype[key] = mixin[key];
            }
        }
        if (name) {
            prototype.mixins[name] = mixin;
        }
    }

    // expose oop functions
    ovy.define = define;
    ovy.extend = extend;
    ovy.mixins = function (targetClass, mixins) {
        return processMixins(targetClass, mixins);
    };
    ovy.inherits = function (targetClass, inherits) {
        return processInherits(targetClass, inherits);
    };

    if (typeof module !== "undefined" && module.exports) {              // NodeJS/CommonJS
        module.exports = ovy;
    } else {
        var _ovy = ctx.ovy,
            _Ovy = ctx.Ovy;
        ctx.Ovy = ctx.ovy = ovy;
        ovy.noConflict = function () {
            if (ctx.ovy === ovy) {
                ctx.ovy = _ovy;
            }
            if (ctx.Ovy === ovy) {
                ctx.Ovy = _Ovy;
            }
            return ovy;
        }
    }

})(this, [][0]);