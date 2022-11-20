/**
 * skylark-io-readers - The skylark reader io library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-langx-ns/_attach',[],function(){
    return  function attach(obj1,path,obj2) {
        if (typeof path == "string") {
            path = path.split(".");//[path]
        };
        var length = path.length,
            ns=obj1,
            i=0,
            name = path[i++];

        while (i < length) {
            ns = ns[name] = ns[name] || {};
            name = path[i++];
        }

        if (ns[name]) {
            if (obj2) {
                throw new Error("This namespace already exists:" + path);
            }

        } else {
            ns[name] = obj2 || {};
        }
        return ns[name];
    }
});
define('skylark-langx-ns/ns',[
    "./_attach"
], function(_attach) {
    var root = {
    	attach : function(path,obj) {
    		return _attach(root,path,obj);
    	}
    };
    return root;
});

define('skylark-langx-ns/main',[
	"./ns"
],function(skylark){
	return skylark;
});
define('skylark-langx-ns', ['skylark-langx-ns/main'], function (main) { return main; });

define('skylark-io-readers/readers',[
    "skylark-langx-ns"
], function(skylark) {

    return skylark.attach("io.readers");
});

define('skylark-langx-events/events',[
	"skylark-langx-ns"
],function(skylark){
	return skylark.attach("langx.events",{});
});
define('skylark-langx-types/types',[
    "skylark-langx-ns"
],function(skylark){
    var nativeIsArray = Array.isArray, 
        toString = {}.toString;
    
    var type = (function() {
        var class2type = {};

        // Populate the class2type map
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        return function type(obj) {
            return obj == null ? String(obj) :
                class2type[toString.call(obj)] || "object";
        };
    })();

 
    var  isArray = nativeIsArray || function(obj) {
        return object && object.constructor === Array;
    };


    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function/string/element and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * isArrayLike([1, 2, 3])
     * // => true
     *
     * isArrayLike(document.body.children)
     * // => false
     *
     * isArrayLike('abc')
     * // => true
     *
     * isArrayLike(Function)
     * // => false
     */    
    function isArrayLike(obj) {
        return !isString(obj) && !isHtmlNode(obj) && typeof obj.length == 'number' && !isFunction(obj);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * isBoolean(false)
     * // => true
     *
     * isBoolean(null)
     * // => false
     */
    function isBoolean(obj) {
       return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
       //return typeof(obj) === "boolean";
    }

    function isDefined(obj) {
        return typeof obj !== 'undefined';
    }

    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }

   // Is a given value a DOM element?
    function isElement(obj) {
        return !!(obj && obj.nodeType === 1);
    }   

    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            if (obj[name] !== null) {
                return false;
            }
        }
        return true;
    }


    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * isFunction(parseInt)
     * // => true
     *
     * isFunction(/abc/)
     * // => false
     */
    function isFunction(value) {
        return type(value) == "function";
    }



    function isHtmlNode(obj) {
        return obj && obj.nodeType; // obj instanceof Node; //Consider the elements in IFRAME
    }

    function isInstanceOf( /*Object*/ value, /*Type*/ type) {
        //Tests whether the value is an instance of a type.
        if (value === undefined) {
            return false;
        } else if (value === null || type == Object) {
            return true;
        } else if (typeof value === "number") {
            return type === Number;
        } else if (typeof value === "string") {
            return type === String;
        } else if (typeof value === "boolean") {
            return type === Boolean;
        } else if (typeof value === "string") {
            return type === String;
        } else {
            return (value instanceof type) || (value && value.isInstanceOf ? value.isInstanceOf(type) : false);
        }
    }

    function isNull(obj) {
        return obj === null;
    }

    function isNumber(obj) {
        return typeof obj == 'number';
    }

    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;        
        //return type(obj) == "object";
    }

    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }

    function isString(obj) {
        return typeof obj === 'string';
    }

    function isWindow(obj) {
        return obj && obj == obj.window;
    }

    function isSameOrigin(href) {
        if (href) {
            var origin = location.protocol + '//' + location.hostname;
            if (location.port) {
                origin += ':' + location.port;
            }
            return href.startsWith(origin);
        }
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ;
       //|| (isObjectLike(value) && objectToString.call(value) == symbolTag); // modified by lwf
    }

    // Is a given variable undefined?
    function isUndefined(obj) {
        return obj === void 0;
    }


    var INFINITY = 1 / 0,
        MAX_SAFE_INTEGER = 9007199254740991,
        MAX_INTEGER = 1.7976931348623157e+308,
        NAN = 0 / 0;

    /** Used to match leading and trailing whitespace. */
    var reTrim = /^\s+|\s+$/g;

    /** Used to detect bad signed hexadecimal string values. */
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    /** Used to detect binary string values. */
    var reIsBinary = /^0b[01]+$/i;

    /** Used to detect octal string values. */
    var reIsOctal = /^0o[0-7]+$/i;

    /** Used to detect unsigned integer values. */
    var reIsUint = /^(?:0|[1-9]\d*)$/;

    /** Built-in method references without a dependency on `root`. */
    var freeParseInt = parseInt;

    /**
     * Converts `value` to a finite number.
     *
     * @static
     * @memberOf _
     * @since 4.12.0
     * @category Lang
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted number.
     * @example
     *
     * _.toFinite(3.2);
     * // => 3.2
     *
     * _.toFinite(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toFinite(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toFinite('3.2');
     * // => 3.2
     */
    function toFinite(value) {
      if (!value) {
        return value === 0 ? value : 0;
      }
      value = toNumber(value);
      if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
      }
      return value === value ? value : 0;
    }

    /**
     * Converts `value` to an integer.
     *
     * **Note:** This method is loosely based on
     * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
     *
     * @static
     * @memberOf _
     * @param {*} value The value to convert.
     * @returns {number} Returns the converted integer.
     * @example
     *
     * _.toInteger(3.2);
     * // => 3
     *
     * _.toInteger(Number.MIN_VALUE);
     * // => 0
     *
     * _.toInteger(Infinity);
     * // => 1.7976931348623157e+308
     *
     * _.toInteger('3.2');
     * // => 3
     */
    function toInteger(value) {
      var result = toFinite(value),
          remainder = result % 1;

      return result === result ? (remainder ? result - remainder : result) : 0;
    }   

    /**
     * Converts `value` to a number.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to process.
     * @returns {number} Returns the number.
     * @example
     *
     * _.toNumber(3.2);
     * // => 3.2
     *
     * _.toNumber(Number.MIN_VALUE);
     * // => 5e-324
     *
     * _.toNumber(Infinity);
     * // => Infinity
     *
     * _.toNumber('3.2');
     * // => 3.2
     */
    function toNumber(value) {
      if (typeof value == 'number') {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
      }
      if (typeof value != 'string') {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, '');
      var isBinary = reIsBinary.test(value);
      return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
    }





    return skylark.attach("langx.types",{

        isArray: isArray,

        isArrayLike: isArrayLike,

        isBoolean: isBoolean,

        isDefined: isDefined,

        isDocument: isDocument,

        isElement,

        isEmpty : isEmptyObject,

        isEmptyObject: isEmptyObject,

        isFunction: isFunction,

        isHtmlNode: isHtmlNode,

        isNaN : function (obj) {
            return isNaN(obj);
        },

        isNull: isNull,


        isNumber: isNumber,

        isNumeric: isNumber,

        isObject: isObject,

        isPlainObject: isPlainObject,

        isString: isString,

        isSameOrigin: isSameOrigin,

        isSymbol : isSymbol,

        isUndefined: isUndefined,

        isWindow: isWindow,

        type: type,

        toFinite : toFinite,
        toNumber : toNumber,
        toInteger : toInteger
        
    });

});
define('skylark-langx-types/main',[
	"./types"
],function(types){
	return types;
});
define('skylark-langx-types', ['skylark-langx-types/main'], function (main) { return main; });

define('skylark-langx-objects/objects',[
    "skylark-langx-ns",
    "skylark-langx-types"
],function(skylark,types){

    return skylark.attach("langx.objects",{
        attach : skylark.attach
    });

});
define('skylark-langx-objects/all-keys',[
    "skylark-langx-types",
    "./objects"
],function(types,objects){

    // Retrieve all the property names of an object.
    function allKeys(obj) {
        if (!types.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }

    return objects.allKeys = allKeys;

});
define('skylark-langx-objects/assign',[
	"skylark-langx-types",
	"./objects"
],function(types,objects) {

	return objects.assign = Object.assign;
});
define('skylark-langx-objects/to-key',[
	"skylark-langx-types",
	"./objects"
],function(types,objects) {

	const isSymbol = types.isSymbol,
		  isString = types.isString;

	/** Used as references for various `Number` constants. */
	const INFINITY = 1 / 0

	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (isString(value) || isSymbol(value)) {
	    return value
	  }
	  const result = `${value}`
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
	}

	return objects.toKey = toKey;

});
define('skylark-langx-objects/is-key',[
	"skylark-langx-types",
	"./objects"
],function(types,objects) {

	const isSymbol = types.isSymbol,
		  isArray = types.isArray;

	/** Used to match property names within property paths. */
	const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
	const reIsPlainProp = /^\w*$/

	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false
	  }
	  const type = typeof value
	  if (type === 'number' || type === 'boolean' || value == null || isSymbol(value)) {
	    return true
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object))
	}

	return objects.isKey = isKey;
});
define('skylark-langx-objects/_cast_path',[
	"skylark-langx-types",
	"./objects",
	"./is-key"
],function(types,objects,isKey) {
	const charCodeOfDot = '.'.charCodeAt(0)
	const reEscapeChar = /\\(\\)?/g
	const rePropName = RegExp(
	  // Match anything that isn't a dot or bracket.
	  '[^.[\\]]+' + '|' +
	  // Or match property names within brackets.
	  '\\[(?:' +
	    // Match a non-string expression.
	    '([^"\'][^[]*)' + '|' +
	    // Or match strings (supports escaping characters).
	    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
	  ')\\]'+ '|' +
	  // Or match "" as the space between consecutive dots or empty brackets.
	  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
	  , 'g')

	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	const stringToPath = ((string) => {
	  const result = []
	  if (string.charCodeAt(0) === charCodeOfDot) {
	    result.push('')
	  }
	  string.replace(rePropName, (match, expression, quote, subString) => {
	    let key = match
	    if (quote) {
	      key = subString.replace(reEscapeChar, '$1')
	    }
	    else if (expression) {
	      key = expression.trim()
	    }
	    result.push(key)
	  })
	  return result
	});

	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value, object) {
	  if (types.isArray(value)) {
	    return value
	  }
	  return isKey(value, object) ? [value] : stringToPath(value)
	}

	return castPath;
});
define('skylark-langx-objects/get',[
	"skylark-langx-types",
	"./objects",
	"./to-key",
	"./_cast_path"
],function(types,objects,toKey,castPath) {

	/**
	 * The base implementation of `get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = castPath(path, object)

	  let index = 0
	  const length = path.length

	  while (object != null && index < length) {
	    object = object[toKey(path[index++])]
	  }
	  return (index && index == length) ? object : undefined
	}


	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is returned in its place.
	 *
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @see has, hasIn, set, unset
	 * @example
	 *
	 * const object = { 'a': [{ 'b': { 'c': 3 } }] }
	 *
	 * get(object, 'a[0].b.c')
	 * // => 3
	 *
	 * get(object, ['a', '0', 'b', 'c'])
	 * // => 3
	 *
	 * get(object, 'a.b.c', 'default')
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  const result = object == null ? undefined : baseGet(object, path)
	  return result === undefined ? defaultValue : result
	}

	return objects.get = get;
});
define('skylark-langx-objects/base-at',[
	"./objects",
	"./get"
],function(objects,get) {

	/**
	 * The base implementation of `at` without support for individual paths.
	 *
	 * @param {Object} object The object to iterate over.
	 * @param {string[]} paths The property paths to pick.
	 * @returns {Array} Returns the picked elements.
	 */
	function baseAt(object, paths) {
	  let index = -1
	  const length = paths.length
	  const result = new Array(length)
	  const skip = object == null

	  while (++index < length) {
	    result[index] = skip ? undefined : get(object, paths[index])
	  }
	  return result
	}

	return objects.baseAt = baseAt;
});
define('skylark-langx-objects/clone',[
    "skylark-langx-types",
    "./objects"
],function(types,objects) {
    var isPlainObject = types.isPlainObject,
        isArray = types.isArray;

    function clone( /*anything*/ src,checkCloneMethod) {
        var copy;
        if (src === undefined || src === null) {
            copy = src;
        } else if (checkCloneMethod && src.clone) {
            copy = src.clone();
        } else if (isArray(src)) {
            copy = [];
            for (var i = 0; i < src.length; i++) {
                copy.push(clone(src[i]));
            }
        } else if (isPlainObject(src)) {
            copy = {};
            for (var key in src) {
                copy[key] = clone(src[key]);
            }
        } else {
            copy = src;
        }

        return copy;

    }

    return objects.clone = clone;
});
define('skylark-langx-objects/defaults',[
    "./objects",
    "./all-keys"
],function(objects,allKeys){
  // An internal function for creating assigner functions.
  function createAssigner(keysFunc, defaults) {
      return function(obj) {
        var length = arguments.length;
        if (defaults) obj = Object(obj);  
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
          var source = arguments[index],
              keys = keysFunc(source),
              l = keys.length;
          for (var i = 0; i < l; i++) {
            var key = keys[i];
            if (!defaults || obj[key] === void 0) obj[key] = source[key];
          }
        }
        return obj;
     };
  }
  
  return objects.defaults = createAssigner(allKeys, true);
});
define('skylark-langx-objects/each',[
    "./objects"
],function(objects) {

    function each(obj, callback,isForEach) {
        var length, key, i, undef, value;

        if (obj) {
            length = obj.length;

            if (length === undef) {
                // Loop object items
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        value = obj[key];
                        if ((isForEach ? callback.call(value, value, key) : callback.call(value, key, value) ) === false) {
                            break;
                        }
                    }
                }
            } else {
                // Loop array items
                for (i = 0; i < length; i++) {
                    value = obj[i];
                    if ((isForEach ? callback.call(value, value, i) : callback.call(value, i, value) )=== false) {
                        break;
                    }
                }
            }
        }

        return this;
    }

    return objects.each = each;
});
define('skylark-langx-objects/_mixin',[
    "skylark-langx-types",
    "./objects"
],function(types,objects) {

    var isPlainObject = types.isPlainObject;

    function _mixin(target, source, deep, safe) {
        for (var key in source) {
            //if (!source.hasOwnProperty(key)) {
            //    continue;
            //}
            if (safe && target[key] !== undefined) {
                continue;
            }
            // if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            //    if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
            if (deep && isPlainObject(source[key])) {
                if (!isPlainObject(target[key])) {
                    target[key] = {};
                }
                //if (isArray(source[key]) && !isArray(target[key])) {
                //    target[key] = [];
                //}
                _mixin(target[key], source[key], deep, safe);
            } else if (source[key] !== undefined) {
                target[key] = source[key]
            }
        }
        return target;
    }

    return _mixin;
});
define('skylark-langx-objects/_parse_mixin_args',[
    "skylark-langx-types",
    "./objects"
],function(types,objects) {

    var slice = Array.prototype.slice,
        isBoolean = types.isBoolean;

    function _parseMixinArgs(args) {
        var params = slice.call(arguments, 0),
            target = params.shift(),
            deep = false;
        if (isBoolean(params[params.length - 1])) {
            deep = params.pop();
        }

        return {
            target: target,
            sources: params,
            deep: deep
        };
    }
    
    return _parseMixinArgs;
});
define('skylark-langx-objects/mixin',[
	"skylark-langx-types",
	"./objects",
  "./_mixin",
  "./_parse_mixin_args"
],function(types,objects,_mixin,_parseMixinArgs) {


    function mixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, false);
        });
        return args.target;
    }


    return objects.mixin = mixin;
	
});
define('skylark-langx-objects/extend',[
    "./objects",
    "./mixin"
],function(objects,mixin) {
    var slice = Array.prototype.slice;

    function extend(target) {
        var deep, args = slice.call(arguments, 1);
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        if (args.length == 0) {
            args = [target];
            target = this;
        }
        args.forEach(function(arg) {
            mixin(target, arg, deep);
        });
        return target;
    }

    return objects.extend = extend;
});
define('skylark-langx-objects/for-each',[
 	"./objects",
 	"./each"
],function(objects,each){

    function forEach (obj, fn) {
    	if (!obj) {
    		return;
    	}
     	if (obj.forEach) {
     		obj.forEach(fn);
     	} else {
     		each(obj,fn,true);
     	}
    }

	return objects.forEach = forEach;
});
define('skylark-langx-objects/has',[
    "skylark-langx-types",
    "./objects"
],function(types,objects){
    var hasOwnProperty = Object.prototype.hasOwnProperty;

    function has(obj, path) {
        if (!types.isArray(path)) {
            return obj != null && hasOwnProperty.call(obj, path);
        }
        var length = path.length;
        for (var i = 0; i < length; i++) {
            var key = path[i];
            if (obj == null || !hasOwnProperty.call(obj, key)) {
                return false;
            }
            obj = obj[key];
        }
        return !!length;
    }

    return objects.has = has;
});
define('skylark-langx-objects/includes',[
    "./objects"
],function(objects) {

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }



    return objects.includes = includes;
});
define('skylark-langx-objects/is-equal',[
	"skylark-langx-types",
	"./objects"
],function(types,objects) {
    var isFunction = types.isFunction;


    // Internal recursive comparison function for `isEqual`.
    var eq, deepEq;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    eq = function(a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // `null` or `undefined` only equal to itself (strict comparison).
        if (a == null || b == null) return false;
        // `NaN`s are equivalent, but non-reflexive.
        if (a !== a) return b !== b;
        // Exhaust primitive checks
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
        return deepEq(a, b, aStack, bStack);
    };

    // Internal recursive comparison function for `isEqual`.
    deepEq = function(a, b, aStack, bStack) {
        // Unwrap any wrapped objects.
        //if (a instanceof _) a = a._wrapped;
        //if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN.
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
            case '[object Symbol]':
                return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;
            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                               isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = Object.keys(a), key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (Object.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(b[key]!==undefined && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };


   // Perform a deep comparison to check if two objects are equal.
    function isEqual(a, b) {
        return eq(a, b);
    }

    return objects.isEqual = isEqual;
	
});
define('skylark-langx-objects/keys',[
    "skylark-langx-types",
    "./objects",
    "./has"
],function(types,objects,has){

    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`.
    function keys(obj) {
        if (!types.isObject(obj)) return [];  
        var keys = [];
        for (var key in obj) if (has(obj, key)) keys.push(key);
        return keys;
    }

    return objects.keys = keys;
});
define('skylark-langx-objects/is-match',[
    "skylark-langx-types",
    "./objects",
    "./keys"
],function(types,objects,keys) {

    // Returns whether an object has a given set of `key:value` pairs.
    function isMatch(object, attrs) {
        var keys = keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
          var key = keys[i];
          if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    }    

    return objects.isMatch = isMatch;
});
define('skylark-langx-objects/omit',[
    "./objects",
    "./mixin"
],function(objects,mixin) {

   // Return a copy of the object without the blacklisted properties.
    function omit(obj, prop1,prop2) {
        if (!obj) {
            return null;
        }
        var result = mixin({},obj);
        for(var i=1;i<arguments.length;i++) {
            var pn = arguments[i];
            if (pn in obj) {
                delete result[pn];
            }
        }
        return result;

    }
    
    return objects.omit = omit;
});
define('skylark-langx-objects/pick',[
    "./objects"
],function(objects) {

   // Return a copy of the object only containing the whitelisted properties.
    function pick(obj,prop1,prop2) {
        if (!obj) {
            return null;
        }
        var result = {};
        for(var i=1;i<arguments.length;i++) {
            var pn = arguments[i];
            if (pn in obj) {
                result[pn] = obj[pn];
            }
        }
        return result;
    }
    
    return objects.pick = pick;
});
define('skylark-langx-objects/remove-items',[
    "skylark-langx-types",
    "./objects"
],function(types,objects){
    function removeItem(items, item) {
        if (types.isArray(items)) {
            var idx = items.indexOf(item);
            if (idx != -1) {
                items.splice(idx, 1);
            }
        } else if (types.isPlainObject(items)) {
            for (var key in items) {
                if (items[key] == item) {
                    delete items[key];
                    break;
                }
            }
        }

        return this;
    }

    return objects.removeItem = removeItem;
});
define('skylark-langx-objects/result',[
  "skylark-langx-types",
  "./objects",
  "./to-key",
  "./_cast_path"
],function(types,objects,toKey,castPath) {
	var isArray = types.isArray,
		isFunction = types.isFunction;

  /**
   * This method is like `get` except that if the resolved value is a
   * function it's invoked with the `this` binding of its parent object and
   * its result is returned.
   *
   * @since 0.1.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to resolve.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * const object = { 'a': [{ 'b': { 'c1': 3, 'c2': () => 4 } }] }
   *
   * result(object, 'a[0].b.c1')
   * // => 3
   *
   * result(object, 'a[0].b.c2')
   * // => 4
   *
   * result(object, 'a[0].b.c3', 'default')
   * // => 'default'
   *
   * result(object, 'a[0].b.c3', () => 'default')
   * // => 'default'
   */
  function result(object, path, defaultValue) {
    path = castPath(path, object)

    let index = -1
    let length = path.length

    // Ensure the loop is entered when path is empty.
    if (!length) {
      length = 1
      object = undefined
    }
    while (++index < length) {
      let value = object == null ? undefined : object[toKey(path[index])]
      if (value === undefined) {
        index = length
        value = defaultValue
      }
      object = isFunction(value) ? value.call(object) : value
    }
    return object
  }

  return objects.result = result;	
});
define('skylark-langx-objects/safe-mixin',[
	"./objects",
  "./_mixin",
  "./_parse_mixin_args"
],function(objects,_mixin,_parseMixinArgs) {

    function safeMixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, true);
        });
        return args.target;
    }

    return objects.safeMixin = safeMixin;
});
define('skylark-langx-objects/scall',[
    "./objects"
],function(objects) {
    const  slice = Array.prototype.slice;

    function scall(obj,method,arg1,arg2) {
        if (obj && obj[method]) {
            var args = slice.call(arguments, 2);

            return obj[method].apply(obj,args);
        }
    }

    return objects.scall = scall;
});
define('skylark-langx-objects/is-index',[
	"skylark-langx-types",
	"./objects"
],function(types,objects) {
	/** Used as references for various `Number` constants. */
	const MAX_SAFE_INTEGER = 9007199254740991

	/** Used to detect unsigned integer values. */
	const reIsUint = /^(?:0|[1-9]\d*)$/

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  const type = typeof value
	  length = length == null ? MAX_SAFE_INTEGER : length

	  return !!length &&
	    (type === 'number' ||
	      (type !== 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length)
	}

	return objects.isIndex = isIndex;
});
define('skylark-langx-objects/set',[
	"skylark-langx-types",
	"./objects",
	"./_cast_path",
	"./is-index",
	"./to-key"
],function(types,objects,castPath,isIndex,toKey) {
	/**
	 * The base implementation of `set`.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The path of the property to set.
	 * @param {*} value The value to set.
	 * @param {Function} [customizer] The function to customize path creation.
	 * @returns {Object} Returns `object`.
	 */
	function baseSet(object, path, value, customizer) {
	  if (!types.isObject(object)) {
	    return object
	  }
	  path = castPath(path, object)

	  const length = path.length
	  const lastIndex = length - 1

	  let index = -1
	  let nested = object

	  while (nested != null && ++index < length) {
	    const key = toKey(path[index])
	    let newValue = value

	    if (index != lastIndex) {
	      const objValue = nested[key]
	      newValue = customizer ? customizer(objValue, key, nested) : undefined
	      if (newValue === undefined) {
	        newValue = types.isObject(objValue)
	          ? objValue
	          : (isIndex(path[index + 1]) ? [] : {})
	      }
	    }
	    nested[key] = newValue; //  assignValues() lwf
	    nested = nested[key];
	  }
	  return object
	}

	/**
	 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
	 * it's created. Arrays are created for missing index properties while objects
	 * are created for all other missing properties. Use `setWith` to customize
	 * `path` creation.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The path of the property to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns `object`.
	 * @see has, hasIn, get, unset
	 * @example
	 *
	 * const object = { 'a': [{ 'b': { 'c': 3 } }] }
	 *
	 * set(object, 'a[0].b.c', 4)
	 * console.log(object.a[0].b.c)
	 * // => 4
	 *
	 * set(object, ['x', '0', 'y', 'z'], 5)
	 * console.log(object.x[0].y.z)
	 * // => 5
	 */
	function set(object, path, value) {
	  return object == null ? object : baseSet(object, path, value)
	}


	return objects.set = set;

});
 define('skylark-langx-objects/shadow',[
	"./objects"
],function(objects) {

    function shadow(obj, prop, value) {
        Object.defineProperty(obj, prop, {
            value,
            enumerable: true,
            configurable: true,
            writable: false
        });
        return value;
    }

    return objects.shadow = shadow;
});
define('skylark-langx-objects/unset',[
	"skylark-langx-types",
	"./objects",
	"./set"
],function(types,objects,set) {

	/**
	 * Removes the property at `path` of `object`.
	 *
	 * **Note:** This method mutates `object`.
	 *
	 * @since 4.0.0
	 * @category Object
	 * @param {Object} object The object to modify.
	 * @param {Array|string} path The path of the property to unset.
	 * @returns {boolean} Returns `true` if the property is deleted, else `false`.
	 * @see get, has, set
	 * @example
	 *
	 * const object = { 'a': [{ 'b': { 'c': 7 } }] }
	 * unset(object, 'a[0].b.c')
	 * // => true
	 *
	 * console.log(object)
	 * // => { 'a': [{ 'b': {} }] }
	 *
	 * unset(object, ['a', '0', 'b', 'c'])
	 * // => true
	 *
	 * console.log(object)
	 * // => { 'a': [{ 'b': {} }] }
	 */
	function unset(object, path) {
	  return object == null ? true : set(object, path,undefined)
	}

	return objects.unset = unset;
});
define('skylark-langx-objects/values',[
    "skylark-langx-types",
    "./objects",
    "./all-keys"
],function(types,objects,allKeys){
    // Retrieve the values of an object's properties.
    function values(obj) {
        var keys = allKeys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    }

    return objects.values = values;
});
define('skylark-langx-objects/main',[
	"./objects",
	"./all-keys",
	"./assign",
	"./base-at",
	"./clone",
	"./defaults",
	"./each",
	"./extend",
	"./for-each",
	"./get",
	"./has",
	"./includes",
	"./is-equal",
	"./is-key",
	"./is-match",
	"./keys",
	"./mixin",
	"./omit",
	"./pick",
	"./remove-items",
	"./result",
	"./safe-mixin",
	"./scall",
	"./set",
	"./shadow",
	"./to-key",
	"./unset",
	"./values"
],function(objects){
	return objects;
});
define('skylark-langx-objects', ['skylark-langx-objects/main'], function (main) { return main; });

define('skylark-langx-funcs/funcs',[
  "skylark-langx-ns",
],function(skylark,types,objects){
        



    function noop() {
    }




    return skylark.attach("langx.funcs",{
        noop : noop,

        returnTrue: function() {
            return true;
        },

        returnFalse: function() {
            return false;
        }

    });
});
define('skylark-langx-funcs/rest-arguments',[
	"./funcs"
],function(funcs){

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  }

  return funcs.restArguments = restArguments;	
});
define('skylark-langx-funcs/bind-all',[
	"./funcs",
	"./rest-arguments"
],function(funcs,restArguments){

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  return funcs.bindAll = restArguments(function(obj, keys) {
    ///keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = obj[key].bind(obj);
    }
  });

});

define('skylark-langx-funcs/defer',[
    "skylark-langx-types",
    "./funcs"
],function(types,funcs){

    function defer(fn,trigger,args,context) {
        var ret = {
            cancel : null
        },
        fn1 = fn;

        if (!types.isNumber(trigger) && !types.isFunction(trigger)) {
            context = args;
            args = trigger;
            trigger = 0;
        }

        if (args) {
            fn1 = function() {
                fn.apply(context,args);
            };
        }

        if (types.isFunction(trigger)) {
            var canceled = false;
            trigger(function(){
                if (!canceled) {
                    fn1();
                }
            });

            ret.cancel = function() {
                canceled = true;
            }

        } else {
            var  id;
            if (trigger == 0 && requestAnimationFrame) {
                id = requestAnimationFrame(fn1);
                ret.cancel = function() {
                    return cancelAnimationFrame(id);
                };
            } else {
                id = setTimeout(fn1,trigger);
                ret.cancel = function() {
                    return clearTimeout(id);
                };
            }            
        }

        return ret;
    }

    return funcs.defer = defer;
});
define('skylark-langx-funcs/debounce',[
	"./funcs",
    "./defer"
],function(funcs,defer){
   
    function debounce(fn, wait,useAnimationFrame) {
        var timeout,
            defered,
            debounced = function () {
                var context = this, args = arguments;
                var later = function () {
                    timeout = null;
                    if (useAnimationFrame) {
                        defered = defer(fn,args,context);
                    } else {
                        fn.apply(context, args);
                    }
                };

                cancel();
                timeout = setTimeout(later, wait);

                return {
                    cancel 
                };
            },
            cancel = debounced.cancel = function () {
                if (timeout) {
                    clearTimeout(timeout);
                }
                if (defered) {
                    defered.cancel();
                }
                timeout = void 0;
                defered = void 0;
            };

        return debounced;
    }

    return funcs.debounce = debounce;

});
define('skylark-langx-funcs/delegate',[
  "skylark-langx-objects",
  "./funcs"
],function(objects,funcs){
	var mixin = objects.mixin;

    var delegate = (function() {
        // boodman/crockford delegation w/ cornford optimization
        function TMP() {}
        return function(obj, props) {
            TMP.prototype = obj;
            var tmp = new TMP();
            TMP.prototype = null;
            if (props) {
                mixin(tmp, props);
            }
            return tmp; // Object
        };
    })();

    return funcs.delegate = delegate;

});
define('skylark-langx-funcs/loop',[
	"./funcs"
],function(funcs){

	/**
	 * Animation timer is a special type of timer that uses the requestAnimationFrame method.
	 *
	 * This timer calls the method with the same rate as the screen refesh rate.
	 * 
	 * Loop time can be changed dinamically.
	 *
	 * @class AnimationTimer
	 * @param {Function} callback Timer callback function.
	 */
	function AnimationTimer(callback)
	{
		this.callback = callback;

		this.running = false;
		this.id = -1;
	}

	/**
	 * Start timer, is the timer is already running dosen't do anything.
	 * 
	 * @method start
	 */
	AnimationTimer.prototype.start = function()
	{
		if(this.running)
		{
			return;
		}

		this.running = true;

		var self = this;
		function run()
		{
			self.callback();

			if(self.running)
			{
				self.id = requestAnimationFrame(run);
			}
		}

		run();
	};

	/**
	 * Stop animation timer.
	 * 
	 * @method stop
	 */
	AnimationTimer.prototype.stop = function()
	{
		this.running = false;
		cancelAnimationFrame(this.id);
	};

	function loop(fn) {
		return new AnimationTimer(fn);
    }

    return funcs.loop = loop;
});
define('skylark-langx-funcs/negate',[
	"./funcs"
],function(funcs){
   
    /**
     * Creates a function that negates the result of the predicate `func`. The
     * `func` predicate is invoked with the `this` binding and arguments of the
     * created function.
     * @category Function
     * @param {Function} predicate The predicate to negate.
     * @returns {Function} Returns the new negated function.
     * @example
     *
     * function isEven(n) {
     *   return n % 2 == 0
     * }
     *
     * filter([1, 2, 3, 4, 5, 6], negate(isEven))
     * // => [1, 3, 5]
     */
    function negate(predicate) {
      if (typeof predicate !== 'function') {
        throw new TypeError('Expected a function')
      }
      return function(...args) {
        return !predicate.apply(this, args)
      }
    }


    return funcs.negate = negate;

});
define('skylark-langx-funcs/proxy',[
  "skylark-langx-types",
	"./funcs"
],function(types,funcs){
    var slice = Array.prototype.slice,
        isFunction = types.isFunction,
        isString = types.isString;

    function proxy(fn, context) {
        var args = (2 in arguments) && slice.call(arguments, 2)
        if (isFunction(fn)) {
            var proxyFn = function() {
                return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
            }
            return proxyFn;
        } else if (isString(context)) {
            if (args) {
                args.unshift(fn[context], fn)
                return proxy.apply(null, args)
            } else {
                return proxy(fn[context], fn);
            }
        } else {
            throw new TypeError("expected function");
        }
    }

    return funcs.bind = funcs.proxy = proxy;

});
define('skylark-langx-funcs/template',[
  "skylark-langx-objects",
  "./funcs",
  "./proxy"
],function(objects,funcs,proxy){
    //ref : underscore
    var slice = Array.prototype.slice;
   
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    var templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;


    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
      "'":      "'",
      '\\':     '\\',
      '\r':     'r',
      '\n':     'n',
      '\t':     't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };

    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;


    function template(text, data, settings) {
        var render;
        settings = objects.defaults({}, settings,templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
          (settings.escape || noMatch).source,
          (settings.interpolate || noMatch).source,
          (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
          source += text.slice(index, offset)
              .replace(escaper, function(match) { return '\\' + escapes[match]; });

          if (escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
          }
          if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
          }
          if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
          }
          index = offset + match.length;
          return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
          "print=function(){__p+=__j.call(arguments,'');};\n" +
          source + 'return __p;\n';

        try {
          render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
          e.source = source;
          throw e;
        }

        if (data) {
          return render(data,this)
        }
        var template = proxy(function(data) {
          return render.call(this, data,this);
        },this);

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
    }

    template.templateSettings = funcs.templateSettings = templateSettings;

    return funcs.template = template;

});
define('skylark-langx-funcs/throttle',[
  "./funcs"
],function(funcs){

    const throttle = function (fn, wait) {
        let last = window.performance.now();
        const throttled = function (...args) {
            const now = window.performance.now();
            if (now - last >= wait) {
                fn(...args);
                last = now;
            }
        };
        return throttled;
    };

    /*
    function throttle(func, delay) {
        var timer = null;

        return function() {
            var context = this,
                args = arguments;

            if ( timer === null ) {
                timer = setTimeout(function() {
                    func.apply(context, args);
                    timer = null;
                }, delay);
            }
        };
    }
    */


    return funcs.throttle = throttle;
});
define('skylark-langx-funcs/main',[
	"./funcs",
	"./bind-all",
	"./debounce",
	"./defer",
	"./delegate",
	"./loop",
	"./negate",
	"./proxy",
	"./rest-arguments",
	"./template",
	"./throttle"
],function(funcs){
	return funcs;
});
define('skylark-langx-funcs', ['skylark-langx-funcs/main'], function (main) { return main; });

define('skylark-langx-constructs/constructs',[
  "skylark-langx-ns"
],function(skylark){

    return skylark.attach("langx.constructs",{});
});
define('skylark-langx-constructs/inherit',[
	"./constructs"
],function(constructs){

    function inherit(ctor,base) {
        ///var f = function() {};
        ///f.prototype = base.prototype;
        ///
        ///ctor.prototype = new f();

	    if ((typeof base !== "function") && base) {
	      throw new TypeError("Super expression must either be null or a function");
	    }

	    ctor.prototype = Object.create(base && base.prototype, {
	      constructor: {
	        value: ctor,
	        writable: true,
	        configurable: true
	      }
	    });

	    if (base) {
	    	//tor.__proto__ = base;
	    	Object.setPrototypeOf(ctor, base);
	    } 
    }

    return constructs.inherit = inherit
});
define('skylark-langx-arrays/arrays',[
  "skylark-langx-ns"
],function(skylark){
    return skylark.attach("langx.arrays");
});
define('skylark-langx-arrays/base-find-index',[
  "./arrays"
],function(arrays){
    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for iteratee shorthands.
     *
     * @param {Array} array The array to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
          index = fromIndex + (fromRight ? 1 : -1);

      while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    return arrays.baseFindIndex = baseFindIndex;
});
define('skylark-langx-arrays/base-indexof',[
  "./arrays",
  "./base-find-index"
],function(arrays,baseFindIndex){

    /**
     * The base implementation of `isNaN` without support for number objects.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     */
    function baseIsNaN(value) {
      return value !== value;
    }

    /**
     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
     *
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1,
          length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }
	
	return arrays.baseIndexOf = baseIndexOf;
});
define('skylark-langx-arrays/filter',[
  "./arrays"
],function(arrays){
   var _filter = Array.prototype.filter;
 
    function filter(array,func) {
      return _filter.call(array,func);
    }

    return arrays.filter = filter;
	
});
define('skylark-langx-arrays/compact',[
  "./arrays",
  "./filter"
],function(arrays,filter){

    function compact(array) {
        return filter(array, function(item) {
            return item != null;
        });
    }

    return arrays.compact = compact;
});
define('skylark-langx-arrays/in-array',[
  "./arrays"
],function(arrays){
    function inArray(item, array) {
        if (!array) {
            return -1;
        }
        var i;

        if (array.indexOf) {
            return array.indexOf(item);
        }

        i = array.length;
        while (i--) {
            if (array[i] === item) {
                return i;
            }
        }

        return -1;
    }

    return arrays.inArray = inArray;
	
});
define('skylark-langx-arrays/contains',[
  "./arrays",
  "./in-array"
],function(arrays,inArray){

    function contains(array,item) {
      return inArray(item,array);
    }
	
	return arrays.contains = contains;
});
define('skylark-langx-arrays/flatten',[
  "skylark-langx-types",
  "./arrays"
],function(types,arrays){

    function flatten(array) {
        if (types.isArrayLike(array)) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                if (types.isArrayLike(item)) {
                    for (var j = 0; j < item.length; j++) {
                        result.push(item[j]);
                    }
                } else {
                    result.push(item);
                }
            }
            return result;
        } else {
            return array;
        }
        //return array.length > 0 ? concat.apply([], array) : array;
    }

    return arrays.flatten = flatten;
});
define('skylark-langx-arrays/difference',[
  "skylark-langx-funcs",
  "./arrays",
  "./flatten",
  "./filter",
  "./contains"
],function(funcs,arrays,flatten,filter,contains){
   // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    var difference  = funcs.restArguments(function(array, rest) {
      rest = flatten(rest, true, true);
      return filter(array, function(value){
        return !contains(rest, value);
      });
    });

    return arrays.difference = difference;
	
});
define('skylark-langx-arrays/find',[
  "./arrays"
],function(arrays){
    var _find = Array.prototype.find;

    function find(array,func) {
      return _find.call(array,func);
    }

    return arrays.find = find;
});
define('skylark-langx-arrays/first',[
  "./arrays"
],function(arrays){
    function first(items,n) {
      if (n) {
          return items.slice(0,n);
      } else {
          return items[0];
      }
    }

    return arrays.first = first;
});
define('skylark-langx-arrays/grep',[
  "skylark-langx-objects",
  "./arrays"
],function(objects,arrays){
    function grep(array, callback) {
        var out = [];

        objects.each(array, function(i, item) {
            if (callback(item, i)) {
                out.push(item);
            }
        });

        return out;
    }

    return arrays.grep = grep;
});
define('skylark-langx-arrays/indexof',[
  "./arrays"
],function(arrays){

    function indexOf(array,item) {
      return array.indexOf(item);
    }

    return arrays.indexOf = indexOf;
});
define('skylark-langx-arrays/last',[
  "./arrays"
],function(arrays){
    // Get the last element of an array. 
    function last(arr) {
        return arr[arr.length - 1];     
    }

    return arrays.last = last;
});
define('skylark-langx-arrays/make-array',[
	"skylark-langx-types",
 	"./arrays"
],function(types,arrays){
    function makeArray(obj, offset, startWith) {
       if (types.isArrayLike(obj) ) {
        return (startWith || []).concat(Array.prototype.slice.call(obj, offset || 0));
      }

      // array of single index
      return [ obj ];             
    }

	return arrays.makeArray = makeArray;	
});
define('skylark-langx-arrays/map',[
	"skylark-langx-types",
  	"./arrays",
  	"./flatten"
],function(types,arrays,flatten){
    function map(elements, callback) {
        var value, values = [],
            i, key
        if (types.isArrayLike(elements))
            for (i = 0; i < elements.length; i++) {
                value = callback.call(elements[i], elements[i], i);
                if (value != null) values.push(value)
            }
        else
            for (key in elements) {
                value = callback.call(elements[key], elements[key], key);
                if (value != null) values.push(value)
            }
        return flatten(values)
    }

    return arrays.map = map;
});
define('skylark-langx-arrays/merge',[
  "./arrays"
],function(arrays){

    function merge( first, second ) {
      var l = second.length,
          i = first.length,
          j = 0;

      if ( typeof l === "number" ) {
        for ( ; j < l; j++ ) {
          first[ i++ ] = second[ j ];
        }
      } else {
        while ( second[j] !== undefined ) {
          first[ i++ ] = second[ j++ ];
        }
      }

      first.length = i;

      return first;
    }

    return arrays.merge = merge;
	
});
define('skylark-langx-arrays/pull-at',[
  "skylark-langx-types",
  "skylark-langx-objects",
  "./arrays"
],function(types,objects,arrays){

	/**
	 * Removes elements from `array` corresponding to `indexes` and returns an
	 * array of removed elements.
	 *
	 * **Note:** Unlike `at`, this method mutates `array`.
	 *
	 * @category Array
	 * @param {Array} array The array to modify.
	 * @param {...(number|number[])} [indexes] The indexes of elements to remove.
	 * @returns {Array} Returns the new array of removed elements.
	 * @see pull, pullAll, pullAllBy, pullAllWith, remove, reject
	 * @example
	 *
	 * const array = ['a', 'b', 'c', 'd']
	 * const pulled = pullAt(array, [1, 3])
	 *
	 * console.log(array)
	 * // => ['a', 'c']
	 *
	 * console.log(pulled)
	 * // => ['b', 'd']
	 */
	function pullAt(array, ...indexes) {
	  const length = array == null ? 0 : array.length
	  const result = objects.baseAt(array, indexes)

	  indexes.sort(function(a, b) {
  		return a - b;
	  });

	  for (let i= indexes.length-1;i>=0;i--) {
	  	array.slice(indexes[i],1);
	  }

	  return result
	}

	return arrays.pullAt = pullAt;
});

define('skylark-langx-arrays/reduce',[
  "./arrays"
],function(arrays){

    function reduce(array,callback,initialValue) {
        return Array.prototype.reduce.call(array,callback,initialValue);
    }

    return arrays.reduce = reduce;	
});
define('skylark-langx-arrays/uniq',[
  "./arrays",
  "./filter"
],function(arrays,filter){

    function uniq(array) {
        return filter(array, function(item, idx) {
            return array.indexOf(item) == idx;
        })
    }
	
	return arrays.uniq = uniq;
});
define('skylark-langx-arrays/without',[
	"skylark-langx-funcs",
  "./arrays",
  "./difference"
],function(funcs,arrays,difference){

    // Return a version of the array that does not contain the specified value(s).
    var without = funcs.restArguments(function(array, otherArrays) {
      return difference(array, otherArrays);
    });

    return arrays.without = without;
});
define('skylark-langx-arrays/main',[
	"./arrays",
	"./base-find-index",
	"./base-indexof",
	"./compact",
	"./contains",
	"./difference",
	"./filter",
	"./find",
	"./first",
	"./flatten",
	"./grep",
	"./in-array",
	"./indexof",
	"./last",
	"./make-array",
	"./map",
	"./merge",
	"./pull-at",
	"./reduce",
	"./uniq",
	"./without"
],function(arrays){
	return arrays;
});
define('skylark-langx-arrays', ['skylark-langx-arrays/main'], function (main) { return main; });

define('skylark-langx-constructs/klass',[
  "skylark-langx-ns",
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
  "./constructs",
  "./inherit"
],function(skylark,types,objects,arrays,constructs,inherit){
    var uniq = arrays.uniq,
        has = objects.has,
        mixin = objects.mixin,
        isArray = types.isArray,
        isDefined = types.isDefined;

/* for reference 
 function klass(props,parent) {
    var ctor = function(){
        this._construct();
    };
    ctor.prototype = props;
    if (parent) {
        ctor._proto_ = parent;
        props.__proto__ = parent.prototype;
    }
    return ctor;
}

// Type some JavaScript code here.
let animal = klass({
  _construct(){
      this.name = this.name + ",hi";
  },
    
  name: "Animal",
  eat() {         // [[HomeObject]] == animal
    alert(`${this.name} eats.`);
  }
    
    
});


let rabbit = klass({
  name: "Rabbit",
  _construct(){
      super._construct();
  },
  eat() {         // [[HomeObject]] == rabbit
    super.eat();
  }
},animal);

let longEar = klass({
  name: "Long Ear",
  eat() {         // [[HomeObject]] == longEar
    super.eat();
  }
},rabbit);
*/
    


    var f1 = function() {
        function extendClass(ctor, props, options) {
            // Copy the properties to the prototype of the class.
            var proto = ctor.prototype,
                _super = ctor.superclass.prototype,
                noOverrided = options && options.noOverrided,
                overrides = options && options.overrides || {};

            for (var name in props) {
                if (name === "constructor") {
                    continue;
                }

                // Check if we're overwriting an existing function
                var prop = props[name];
                if (typeof props[name] == "function") {
                    proto[name] =  !prop._constructor && !noOverrided && typeof _super[name] == "function" ?
                          (function(name, fn, superFn) {
                            return function() {
                                var tmp = this.overrided;

                                // Add a new ._super() method that is the same method
                                // but on the super-class
                                this.overrided = superFn;

                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);

                                this.overrided = tmp;

                                return ret;
                            };
                        })(name, prop, _super[name]) :
                        prop;
                } else if (types.isPlainObject(prop) && prop!==null && (prop.get)) {
                    Object.defineProperty(proto,name,prop);
                } else {
                    proto[name] = prop;
                }
            }
            return ctor;
        }

        function serialMixins(ctor,mixins) {
            var result = [];

            mixins.forEach(function(mixin){
                if (has(mixin,"__mixins__")) {
                     throw new Error("nested mixins");
                }
                var clss = [];
                while (mixin) {
                    clss.unshift(mixin);
                    mixin = mixin.superclass;
                }
                result = result.concat(clss);
            });

            result = uniq(result);

            result = result.filter(function(mixin){
                var cls = ctor;
                while (cls) {
                    if (mixin === cls) {
                        return false;
                    }
                    if (has(cls,"__mixins__")) {
                        var clsMixines = cls["__mixins__"];
                        for (var i=0; i<clsMixines.length;i++) {
                            if (clsMixines[i]===mixin) {
                                return false;
                            }
                        }
                    }
                    cls = cls.superclass;
                }
                return true;
            });

            if (result.length>0) {
                return result;
            } else {
                return false;
            }
        }

        function mergeMixins(ctor,mixins) {
            var newCtor =ctor;
            for (var i=0;i<mixins.length;i++) {
                var xtor = new Function();

                inherit(xtor,newCtor)
                //xtor.prototype = Object.create(newCtor.prototype);
                //xtor.__proto__ = newCtor;
                xtor.superclass = null;
                mixin(xtor.prototype,mixins[i].prototype);
                xtor.prototype.__mixin__ = mixins[i];
                newCtor = xtor;
            }

            return newCtor;
        }

        function _constructor ()  {
            if (this._construct) {
                return this._construct.apply(this, arguments);
            } else  if (this.init) {
                return this.init.apply(this, arguments);
            }
        }

        return function createClass(props, parent, mixins,options) {
            if (isArray(parent)) {
                options = mixins;
                mixins = parent;
                parent = null;
            }
            parent = parent || Object;

            if (isDefined(mixins) && !isArray(mixins)) {
                options = mixins;
                mixins = false;
            }

            var innerParent = parent;

            if (mixins) {
                mixins = serialMixins(innerParent,mixins);
            }

            if (mixins) {
                innerParent = mergeMixins(innerParent,mixins);
            }

            var klassName = props.klassName || "",
                ctor = new Function(
                    "return function " + klassName + "() {" +
                    "var inst = this," +
                    " ctor = arguments.callee;" +
                    "if (!(inst instanceof ctor)) {" +
                    "inst = Object.create(ctor.prototype);" +
                    "}" +
                    "return ctor._constructor.apply(inst, arguments) || inst;" + 
                    "}"
                )();


            // Populate our constructed prototype object
            ///ctor.prototype = Object.create(innerParent.prototype);

            // Enforce the constructor to be what we expect
            ///ctor.prototype.constructor = ctor;
  
            // And make this class extendable
            ///ctor.__proto__ = innerParent;

            inherit(ctor,innerParent);

            ctor.superclass = parent;

            if (!ctor._constructor) {
                ctor._constructor = _constructor;
            } 

            if (mixins) {
                ctor.__mixins__ = mixins;
            }

            if (!ctor.partial) {
                ctor.partial = function(props, options) {
                    return extendClass(this, props, options);
                };
            }
            if (!ctor.inherit) {
                ctor.inherit = function(props, mixins,options) {
                    return createClass(props, this, mixins,options);
                };
            }

            ctor.partial(props, options);

            return ctor;
        };
    }

    var createClass = f1();

    return constructs.klass = createClass;
});
define('skylark-langx-constructs/main',[
	"./constructs",
	"./inherit",
	"./klass"
],function(constructs){
	return constructs;
});
define('skylark-langx-constructs', ['skylark-langx-constructs/main'], function (main) { return main; });

define('skylark-langx-klass/klass',[
  "skylark-langx-ns",
  "skylark-langx-constructs"
],function(skylark,constructs){

    return skylark.attach("langx.klass",constructs.klass);
});
define('skylark-langx-klass/main',[
	"./klass"
],function(klass){
	return klass;
});
define('skylark-langx-klass', ['skylark-langx-klass/main'], function (main) { return main; });

define('skylark-langx-hoster/hoster',[
    "skylark-langx-ns"
],function(skylark){
	// The javascript host environment, brower and nodejs are supported.
	var hoster = {
		"isBrowser" : true, // default
		"isNode" : null,
		"global" : this,
		"browser" : null,
		"node" : null
	};

	if (typeof process == "object" && process.versions && process.versions.node && process.versions.v8) {
		hoster.isNode = true;
		hoster.isBrowser = false;
	}

	hoster.global = (function(){
		if (typeof global !== 'undefined' && typeof global !== 'function') {
			// global spec defines a reference to the global object called 'global'
			// https://github.com/tc39/proposal-global
			// `global` is also defined in NodeJS
			return global;
		} else if (typeof window !== 'undefined') {
			// window is defined in browsers
			return window;
		}
		else if (typeof self !== 'undefined') {
			// self is defined in WebWorkers
			return self;
		}
		return this;
	})();

	var _document = null;

	Object.defineProperty(hoster,"document",function(){
		if (!_document) {
			var w = typeof window === 'undefined' ? require('html-element') : window;
			_document = w.document;
		}

		return _document;
	});

	if (hoster.global.CustomEvent === undefined) {
		hoster.global.CustomEvent = function(type,props) {
			this.type = type;
			this.props = props;
		};
	}

	if (hoster.isBrowser) {
	    function uaMatch( ua ) {
		    ua = ua.toLowerCase();

			//IE11OrLess = !!navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie|iemobile)/i),
			//Edge = !!navigator.userAgent.match(/Edge/i),
			//FireFox = !!navigator.userAgent.match(/firefox/i),
			//Safari = !!(navigator.userAgent.match(/safari/i) && !navigator.userAgent.match(/chrome/i) && !navigator.userAgent.match(/android/i)),
			//IOS = !!(navigator.userAgent.match(/iP(ad|od|hone)/i)),

		    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		      /(msie) ([\w.]+)/.exec( ua ) ||
		      ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		      [];

		    return {
		      browser: match[ 1 ] || '',
		      version: match[ 2 ] || '0'
		    };
	  	};

	    var matched = uaMatch( navigator.userAgent );

	    var browser = hoster.browser = {};

	    if ( matched.browser ) {
	      browser[ matched.browser ] = true;
	      browser.version = matched.version;
	    }

	    // Chrome is Webkit, but Webkit is also Safari.
	    if ( browser.chrome ) {
	      browser.webkit = true;
	    } else if ( browser.webkit ) {
	      browser.safari = true;
	    }
	}

	hoster.detects = {};

	return  skylark.attach("langx.hoster",hoster);
});
define('skylark-langx-hoster/detects/mobile',[
    "../hoster"
],function(hoster){
    //refer : https://github.com/kaimallea/isMobile

    var appleIphone = /iPhone/i;
    var appleIpod = /iPod/i;
    var appleTablet = /iPad/i;
    var appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
    var androidPhone = /\bAndroid(?:.+)Mobile\b/i;
    var androidTablet = /Android/i;
    var amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
    var amazonTablet = /Silk/i;
    var windowsPhone = /Windows Phone/i;
    var windowsTablet = /\bWindows(?:.+)ARM\b/i;
    var otherBlackBerry = /BlackBerry/i;
    var otherBlackBerry10 = /BB10/i;
    var otherOpera = /Opera Mini/i;
    var otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
    var otherFirefox = /Mobile(?:.+)Firefox\b/i;
    var isAppleTabletOnIos13 = function (navigator) {
        return (typeof navigator !== 'undefined' &&
            navigator.platform === 'MacIntel' &&
            typeof navigator.maxTouchPoints === 'number' &&
            navigator.maxTouchPoints > 1 &&
            typeof MSStream === 'undefined');
    };
    function createMatch(userAgent) {
        return function (regex) { return regex.test(userAgent); };
    }
    
    function detectMobile(param) {
        var nav = {
            userAgent: '',
            platform: '',
            maxTouchPoints: 0
        };
        if (!param && typeof navigator !== 'undefined') {
            nav = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                maxTouchPoints: navigator.maxTouchPoints || 0
            };
        }
        else if (typeof param === 'string') {
            nav.userAgent = param;
        }
        else if (param && param.userAgent) {
            nav = {
                userAgent: param.userAgent,
                platform: param.platform,
                maxTouchPoints: param.maxTouchPoints || 0
            };
        }
        var userAgent = nav.userAgent;
        var tmp = userAgent.split('[FBAN');
        if (typeof tmp[1] !== 'undefined') {
            userAgent = tmp[0];
        }
        tmp = userAgent.split('Twitter');
        if (typeof tmp[1] !== 'undefined') {
            userAgent = tmp[0];
        }
        var match = createMatch(userAgent);
        var result = {
            apple: {
                phone: match(appleIphone) && !match(windowsPhone),
                ipod: match(appleIpod),
                tablet: !match(appleIphone) &&
                    (match(appleTablet) || isAppleTabletOnIos13(nav)) &&
                    !match(windowsPhone),
                universal: match(appleUniversal),
                device: (match(appleIphone) ||
                    match(appleIpod) ||
                    match(appleTablet) ||
                    match(appleUniversal) ||
                    isAppleTabletOnIos13(nav)) &&
                    !match(windowsPhone)
            },
            amazon: {
                phone: match(amazonPhone),
                tablet: !match(amazonPhone) && match(amazonTablet),
                device: match(amazonPhone) || match(amazonTablet)
            },
            android: {
                phone: (!match(windowsPhone) && match(amazonPhone)) ||
                    (!match(windowsPhone) && match(androidPhone)),
                tablet: !match(windowsPhone) &&
                    !match(amazonPhone) &&
                    !match(androidPhone) &&
                    (match(amazonTablet) || match(androidTablet)),
                device: (!match(windowsPhone) &&
                    (match(amazonPhone) ||
                        match(amazonTablet) ||
                        match(androidPhone) ||
                        match(androidTablet))) ||
                    match(/\bokhttp\b/i)
            },
            windows: {
                phone: match(windowsPhone),
                tablet: match(windowsTablet),
                device: match(windowsPhone) || match(windowsTablet)
            },
            other: {
                blackberry: match(otherBlackBerry),
                blackberry10: match(otherBlackBerry10),
                opera: match(otherOpera),
                firefox: match(otherFirefox),
                chrome: match(otherChrome),
                device: match(otherBlackBerry) ||
                    match(otherBlackBerry10) ||
                    match(otherOpera) ||
                    match(otherFirefox) ||
                    match(otherChrome)
            },
            any: false,
            phone: false,
            tablet: false
        };
        result.any =
            result.apple.device ||
                result.android.device ||
                result.windows.device ||
                result.other.device;
        result.phone =
            result.apple.phone || result.android.phone || result.windows.phone;
        result.tablet =
            result.apple.tablet || result.android.tablet || result.windows.tablet;
        return result;
    }

    return hoster.detects.mobile = detectMobile;
});

define('skylark-langx-hoster/is-mobile',[
    "./hoster",
    "./detects/mobile"
],function(hoster,detectMobile){
    if (hoster.isMobile == undefined) {
        hoster.isMobile = detectMobile();
    }

    return hoster.isMobile;
});

define('skylark-langx-hoster/main',[
	"./hoster",
	"./is-mobile"
],function(hoster){
	return hoster;
});
define('skylark-langx-hoster', ['skylark-langx-hoster/main'], function (main) { return main; });

define('skylark-langx-events/event',[
  "skylark-langx-objects",
  "skylark-langx-funcs",
  "skylark-langx-klass",
  "skylark-langx-hoster",
    "./events"
],function(objects,funcs,klass,events){
    var eventMethods = {
        preventDefault: "isDefaultPrevented",
        stopImmediatePropagation: "isImmediatePropagationStopped",
        stopPropagation: "isPropagationStopped"
     };
        

    function compatible(event, source) {
        if (source || !event.isDefaultPrevented) {
            if (!source) {
                source = event;
            }

            objects.each(eventMethods, function(name, predicate) {
                var sourceMethod = source[name];
                event[name] = function() {
                    this[predicate] = funcs.returnTrue;
                    return sourceMethod && sourceMethod.apply(source, arguments);
                }
                event[predicate] = funcs.returnFalse;
            });
        }
        return event;
    }


    /*
    var Event = klass({
        _construct : function(type,props) {
            CustomEvent.call(this,type.props);
            objects.safeMixin(this, props);
            compatible(this);
        }
    },CustomEvent);
    */

    class Event extends CustomEvent {
        constructor(type,props) {
            super(type,props);
            objects.safeMixin(this, props);
            compatible(this);
        } 
    }


    Event.compatible = compatible;

    return events.Event = Event;
    
});
define('skylark-langx-events/listener',[
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
  "skylark-langx-klass",
  "./events",
  "./event"
],function(types,objects,arrays,klass,events,Event){
    var slice = Array.prototype.slice,
        compact = arrays.compact,
        isDefined = types.isDefined,
        isUndefined = types.isUndefined,
        isPlainObject = types.isPlainObject,
        isFunction = types.isFunction,
        isBoolean = types.isBoolean,
        isString = types.isString,
        isEmptyObject = types.isEmptyObject,
        mixin = objects.mixin,
        safeMixin = objects.safeMixin;


    var Listener = klass({

        listenTo: function(obj, event, selector,callback, /*used internally*/ one) {
            if (!obj) {
                return this;
            }

            if (types.isPlainObject(event)){
                //listenTo(obj,callbacks,one)
                if (types.isBoolean(selector)) {
                    one = selector;
                    selector = null;
                } else if (types.isBoolean(callback)) {
                    one = callback;
                }
                var callbacks = event;
                for (var name in callbacks) {

                    var match = name.match( /^([\w:-]*)\s*(.*)$/ );
                    var name1 = match[ 1 ];
                    var selector1 = match[ 2 ] || selector;

                    if (selector1) {
                        this.listenTo(obj,name1,selector1,callbacks[name],one);
                    } else {
                        this.listenTo(obj,name1,callbacks[name],one);
                    }

                }
                return this;
            }

            if (isBoolean(callback)) {
                one = callback;
                callback = selector;
                selector = null;
            } else if (isBoolean(selector)) {
                one = selector;
                callback = selector = null;
            } else if (isUndefined(callback)){
                one = false;
                callback = selector;
                selector = null;
            }



            if (!callback) {
                callback = "handleEvent";
            }
            
            // Bind callbacks on obj,
            if (isString(callback)) {
                callback = this[callback];
            }

            var emitter = this.ensureListenedEmitter(obj)

            if (one) {
                if (selector) {
                    emitter.one(event, selector,callback, this);
                } else {
                    emitter.one(event, callback, this);
                }
            } else {
                 if (selector) {
                    emitter.on(event, selector, callback, this);
                } else {
                    emitter.on(event, callback, this);
                }
            }

            //keep track of them on listening.
            var listeningTo = this._listeningTo || (this._listeningTo = []),
                listening;

            for (var i = 0; i < listeningTo.length; i++) {
                if (listeningTo[i].obj == obj) {
                    listening = listeningTo[i];
                    break;
                }
            }
            if (!listening) {
                listeningTo.push(
                    listening = {
                        obj: obj,
                        events: {}
                    }
                );
            }
            var listeningEvents = listening.events,
                listeningEvent = listeningEvents[event] = listeningEvents[event] || [];
            if (listeningEvent.indexOf(callback) == -1) {
                listeningEvent.push(callback);
            }

            return this;
        },

        listenToOnce: function(obj, event,selector, callback) {
            return this.listenTo(obj, event,selector, callback, 1);
        },

        unlistenTo: function(obj, event, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) {
                return this;
            }

            if (isString(callback)) {
                callback = this[callback];
            }

            for (var i = 0; i < listeningTo.length; i++) {
                var listening = listeningTo[i];

                if (obj && obj != listening.obj) {
                    continue;
                }

                var listeningEvents = listening.events;

                for (var eventName in listeningEvents) {
                    if (event && event != eventName) {
                        continue;
                    }

                    var listeningEvent = listeningEvents[eventName];

                    if (!listeningEvent) { 
                        continue;
                    }

                    for (var j = 0; j < listeningEvent.length; j++) {
                        if (!callback || callback == listeningEvent[i]) {
                            let emitter = this.ensureListenedEmitter(listening.obj);
                            emitter.off(eventName, listeningEvent[i], this);
                            listeningEvent[i] = null;
                        }
                    }

                    listeningEvent = listeningEvents[eventName] = compact(listeningEvent);

                    if (isEmptyObject(listeningEvent)) {
                        listeningEvents[eventName] = null;
                    }

                }

                if (isEmptyObject(listeningEvents)) {
                    listeningTo[i] = null;
                }
            }

            listeningTo = this._listeningTo = compact(listeningTo);
            if (isEmptyObject(listeningTo)) {
                this._listeningTo = null;
            }

            return this;
        },

        ensureListenedEmitter : function(obj) {
            return obj;
        }
    });

    return events.Listener = Listener;

});
define('skylark-langx-events/emitter',[
  "skylark-langx-types",
  "skylark-langx-objects",
  "skylark-langx-arrays",
  "skylark-langx-klass",
  "./events",
  "./event",
  "./listener"
],function(types,objects,arrays,klass,events,Event,Listener){
    var slice = Array.prototype.slice,
        compact = arrays.compact,
        isDefined = types.isDefined,
        isPlainObject = types.isPlainObject,
        isFunction = types.isFunction,
        isString = types.isString,
        isEmptyObject = types.isEmptyObject,
        mixin = objects.mixin,
        safeMixin = objects.safeMixin;

    function parse(event) {
        var segs = ("" + event).split(".");
        return {
            name: segs[0],
            ns: segs.slice(1).join(" ")
        };
    }

    
    var queues  = new Map();


    var Emitter = Listener.inherit({
        _prepareArgs : function(e,args) {
            if (isDefined(args)) {
                args = [e].concat(args);
            } else {
                args = [e];
            }
            return args;
        },

        on: function(events, selector, data, callback, ctx, /*used internally*/ one) {
            var self = this,
                _hub = this._hub || (this._hub = {});

            if (isPlainObject(events)) {
                ctx = callback;
                each(events, function(type, fn) {
                    self.on(type, selector, data, fn, ctx, one);
                });
                return this;
            }

            if (!isString(selector) && !isFunction(callback)) {
                ctx = callback;
                callback = data;
                data = selector;
                selector = undefined;
            }

            if (isFunction(data)) {
                ctx = callback;
                callback = data;
                data = null;
            }

            if (!callback ) {
                throw new Error("No callback function");
            } else if (!isFunction(callback)) {
                throw new Error("The callback  is not afunction");
            }

            if (isString(events)) {
                events = events.split(/\s/)
            }

            events.forEach(function(event) {
                var parsed = parse(event),
                    name = parsed.name,
                    ns = parsed.ns;

                (_hub[name] || (_hub[name] = [])).push({
                    fn: callback,
                    selector: selector,
                    data: data,
                    ctx: ctx,
                    ns : ns,
                    one: one
                });
            });

            return this;
        },

        one: function(events, selector, data, callback, ctx) {
            return this.on(events, selector, data, callback, ctx, 1);
        },

        emit: function(e /*,argument list*/ ) {
            if (!this._hub) {
                return this;
            }

            var self = this;

            if (isString(e)) {
                e = new Event(e); //new CustomEvent(e);
            }

            Object.defineProperty(e,"target",{
                value : this
            });

            var args = slice.call(arguments, 1);

            args = this._prepareArgs(e,args);

            [e.type || e.name, "all"].forEach(function(eventName) {
                var parsed = parse(eventName),
                    name = parsed.name,
                    ns = parsed.ns;

                var listeners = self._hub[name];
                if (!listeners) {
                    return;
                }

                var len = listeners.length,
                    reCompact = false;

                for (var i = 0; i < len; i++) {
                    if (e.isImmediatePropagationStopped && e.isImmediatePropagationStopped()) {
                        return this;
                    }
                    var listener = listeners[i];
                    if (ns && (!listener.ns ||  !listener.ns.startsWith(ns))) {
                        continue;
                    }

                    if (listener.data) {
                        e.data = mixin({}, listener.data, e.data);
                    }
                    if (args.length == 2 && isPlainObject(args[1])) {
                        e.data = e.data || {};
                        mixin(e.data,args[1]);
                    }

                    listener.fn.apply(listener.ctx, args);
                    if (listener.one) {
                        listeners[i] = null;
                        reCompact = true;
                    }
                }

                if (reCompact) {
                    self._hub[eventName] = compact(listeners);
                }

            });
            return this;
        },

        queueEmit : function (event) {
            const type = event.type || event;
            let map = queues.get(this);
            if (!map) {
                map = new Map();
                queues.set(this, map);
            }
            const oldTimeout = map.get(type);
            map.delete(type);
            window.clearTimeout(oldTimeout);
            const timeout = window.setTimeout(() => {
                if (map.size === 0) {
                    map = null;
                    queues.delete(this);
                }
                this.trigger(event);
            }, 0);
            map.set(type, timeout);
        },

        listened: function(event) {
            var evtArr = ((this._hub || (this._events = {}))[event] || []);
            return evtArr.length > 0;
        },

        off: function(events, callback) {
            if (!events) {
              this._hub = null;
              return;
            }
            var _hub = this._hub || (this._hub = {});
            if (isString(events)) {
                events = events.split(/\s/)
            }

            events.forEach(function(event) {
                var parsed = parse(event),
                    name = parsed.name,
                    ns = parsed.ns;

                var evts = _hub[name];

                if (evts) {
                    var liveEvents = [];

                    if (callback || ns) {
                        for (var i = 0, len = evts.length; i < len; i++) {
                            
                            if (callback && evts[i].fn !== callback && evts[i].fn._ !== callback) {
                                liveEvents.push(evts[i]);
                                continue;
                            } 

                            if (ns && (!evts[i].ns || evts[i].ns.indexOf(ns)!=0)) {
                                liveEvents.push(evts[i]);
                                continue;
                            }
                        }
                    }

                    if (liveEvents.length) {
                        _hub[name] = liveEvents;
                    } else {
                        delete _hub[name];
                    }

                }
            });

            return this;
        },

        trigger  : function() {
            return this.emit.apply(this,arguments);
        },

        queueTrigger : function (event) {
            return this.queueEmit.apply(this,arguments);
        }

    });


    return events.Emitter = Emitter;

});
define('skylark-langx-events/create-event',[
	"./events",
	"./event"
],function(events,Event){
    function createEvent(type,props) {
        //var e = new CustomEvent(type,props);
        //return safeMixin(e, props);
        return new Event(type,props);
    };

    return events.createEvent = createEvent;	
});
define('skylark-langx-events/main',[
	"./events",
	"./event",
	"./listener",
	"./emitter",
	"./create-event"
],function(events){
	return events;
});
define('skylark-langx-events', ['skylark-langx-events/main'], function (main) { return main; });

define('skylark-io-readers/_reader',[
    "skylark-langx-events",
    "./readers"
], function(events,readers) {

    'use strict';

    var Reader = events.Emitter.inherit({
        klassName: "Reader",
        _construct :  function(data) {
            this.data = data;
            this.length = data.length;
            this.index = 0;
            this.zero = 0;
        },

        checkOffset: function (offset) {
            this.checkIndex(this.index + offset);
        },
        checkIndex: function (newIndex) {
            if (this.length < this.zero + newIndex || newIndex < 0) {
                throw new Error('End of data reached (data length = ' + this.length + ', asked index = ' + newIndex + '). Corrupted zip ?');
            }
        },
        setIndex: function (newIndex) {
            this.checkIndex(newIndex);
            this.index = newIndex;
        },
        skip: function (n) {
            this.setIndex(this.index + n);
        },
        byteAt: function () {
        },
        readInt: function (size) {
            var result = 0, i;
            this.checkOffset(size);
            for (i = this.index + size - 1; i >= this.index; i--) {
                result = (result << 8) + this.byteAt(i);
            }
            this.index += size;
            return result;
        },
        readString: function (size) {
            return utils.transformTo('string', this.readData(size));
        },
        readData: function () {
        },
        lastIndexOfSignature: function () {
        },
        readAndCheckSignature: function () {
        },
        readDate: function () {
            var dostime = this.readInt(4);
            return new Date(Date.UTC((dostime >> 25 & 127) + 1980, (dostime >> 21 & 15) - 1, dostime >> 16 & 31, dostime >> 11 & 31, dostime >> 5 & 63, (dostime & 31) << 1));
        }

    });

    return readers.Reader = Reader;
});
define('skylark-io-readers/array-reader',[
    "./readers",
    './_reader'
], function (readers,Reader) {
    'use strict';

    var ArrayReader = Reader.inherit({
        klassName: "ArrayReader",
        _construct :  function(data) {
            Reader.prototype._construct.call(this,data);
            for (var i = 0; i < this.data.length; i++) {
                data[i] = data[i] & 255;
            }            
        },


        byteAt : function (i) {
            return this.data[this.zero + i];
        },

        lastIndexOfSignature : function (sig) {
            var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
            for (var i = this.length - 4; i >= 0; --i) {
                if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
                    return i - this.zero;
                }
            }
            return -1;
        },

        readAndCheckSignature : function (sig) {
            var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3), data = this.readData(4);
            return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
        },

        readData : function (size) {
            this.checkOffset(size);
            if (size === 0) {
                return [];
            }
            var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
            this.index += size;
            return result;
        }
    });

    return readers.ArrayReader = ArrayReader;
});
define('skylark-io-readers/uint8-array-reader',[
    "./readers",
    './array-reader'
], function (readers,ArrayReader) {
    'use strict';

    var Uint8ArrayReader = ArrayReader.inherit({
        klassName: "Uint8ArrayReader",

        readData : function (size) {
            this.checkOffset(size);
            if (size === 0) {
                return new Uint8Array(0);
            }
            var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
            this.index += size;
            return result;
        }
    });


    return readers.Uint8ArrayReader = Uint8ArrayReader;

});
define('skylark-io-readers/buffer-reader',[
    "./readers",
    './uint8-array-reader'
], function (readers,Reader) {
    'use strict';


    var BufferReader = ArrayReader.inherit({
        klassName: "BufferReader",

        readData : function (size) {
            this.checkOffset(size);
            var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
            this.index += size;
            return result;
        }
    });


    return readers.BufferReader = BufferReader;
});
define('skylark-io-readers/string-reader',[
    "./readers",
    './_reader'
], function (readers,Reader) {
    'use strict';

    var StringReader = Reader.inherit({
        klassName: "StringReader",

        byteAt : function (i) {
            return this.data.charCodeAt(this.zero + i);
        },

        lastIndexOfSignature : function (sig) {
            return this.data.lastIndexOf(sig) - this.zero;
        },

        readAndCheckSignature : function (sig) {
            var data = this.readData(4);
            return sig === data;
        },

        readData : function (size) {
            this.checkOffset(size);
            var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
            this.index += size;
            return result;
        }
    });
    
    return readers.StringReader = StringReader;
});
define('skylark-io-readers/main',[
    "./readers",
    "./array-reader",
    "./buffer-reader",
    "./string-reader",
    "./uint8-array-reader"
], function(readers) {

	return readers;
});
define('skylark-io-readers', ['skylark-io-readers/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-io-readers-all.js.map
