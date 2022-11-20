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

        isInstanceOf,

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

define('skylark-langx-binary/binary',[
  "skylark-langx-ns",
],function(skylark){
	"use strict";


	/**
	 * Create arraybuffer from binary string
	 *
	 * @method fromBinaryString
	 * @param {String} str
	 * @return {Arraybuffer} data
	 */
	function fromBinaryString(str) {
		var length = str.length;
		var arraybuffer = new ArrayBuffer(length);
		var view = new Uint8Array(arraybuffer);

		for(var i = 0; i < length; i++)
		{
			view[i] = str.charCodeAt(i);
		}

		return arraybuffer;
	}

	/**
	 * Create arraybuffer from base64 string
	 *
	 * @method fromBase64
	 * @param {String} base64
	 * @return {Arraybuffer} data
	 */
	function fromBase64(str){
		var encoding = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var length = str.length / 4 * 3;
		var arraybuffer = new ArrayBuffer(length);
		var view = new Uint8Array(arraybuffer);

		var a, b, c, d;

		for(var i = 0, j = 0; i < length; i += 3)
		{
			a = encoding.indexOf(str.charAt(j++));
			b = encoding.indexOf(str.charAt(j++));
			c = encoding.indexOf(str.charAt(j++));
			d = encoding.indexOf(str.charAt(j++));

			view[i] = (a << 2) | (b >> 4);
			if(c !== 64)
			{
				view[i+1] = ((b & 15) << 4) | (c >> 2);
			}
			if(d !== 64)
			{
				view[i+2] = ((c & 3) << 6) | d;
			}
		}

		return arraybuffer;
	}

	/**
	 * Create arraybuffer from Nodejs buffer
	 *
	 * @method fromBuffer
	 * @param {Buffer} buffer
	 * @return {Arraybuffer} data
	 */
	function fromBuffer(buffer)	{
		var array = new ArrayBuffer(buffer.length);
		var view = new Uint8Array(array);

		for(var i = 0; i < buffer.length; i++)
		{
			view[i] = buffer[i];
		}

		return array;

		//Faster but the results is failing the "instanceof ArrayBuffer" test
		//return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
	}

    function readInt8(data, offset) {
        return data[offset] << 24 >> 24;
    }
    function readUint16(data, offset) {
        return data[offset] << 8 | data[offset + 1];
    }
    function readUint32(data, offset) {
        return (data[offset] << 24 | data[offset + 1] << 16 | data[offset + 2] << 8 | data[offset + 3]) >>> 0;
    }


	return skylark.attach("langx.binary",{
		fromBase64,
		fromBinaryString,
		fromBuffer,
		readInt8,
		readUint16,
		readUint32
	});
});
define('skylark-langx-binary/base64',[],function(){
  'use strict'
  var exports = {};

  exports.byteLength = byteLength
  exports.toByteArray = toByteArray
  exports.fromByteArray = fromByteArray

  var lookup = []
  var revLookup = []
  var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  // Support decoding URL-safe base64 strings, as Node.js does.
  // See: https://en.wikipedia.org/wiki/Base64#URL_applications
  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63

  function getLens (b64) {
    var len = b64.length

    if (len % 4 > 0) {
      throw new Error('Invalid string. Length must be a multiple of 4')
    }

    // Trim off extra bytes after placeholder bytes are found
    // See: https://github.com/beatgammit/base64-js/issues/42
    var validLen = b64.indexOf('=')
    if (validLen === -1) validLen = len

    var placeHoldersLen = validLen === len
      ? 0
      : 4 - (validLen % 4)

    return [validLen, placeHoldersLen]
  }

  // base64 is 4/3 + up to two characters of the original data
  function byteLength (b64) {
    var lens = getLens(b64)
    var validLen = lens[0]
    var placeHoldersLen = lens[1]
    return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
  }

  function _byteLength (b64, validLen, placeHoldersLen) {
    return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
  }

  function toByteArray (b64) {
    var tmp
    var lens = getLens(b64)
    var validLen = lens[0]
    var placeHoldersLen = lens[1]

    var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

    var curByte = 0

    // if there are placeholders, only get up to the last complete 4 chars
    var len = placeHoldersLen > 0
      ? validLen - 4
      : validLen

    var i
    for (i = 0; i < len; i += 4) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 18) |
        (revLookup[b64.charCodeAt(i + 1)] << 12) |
        (revLookup[b64.charCodeAt(i + 2)] << 6) |
        revLookup[b64.charCodeAt(i + 3)]
      arr[curByte++] = (tmp >> 16) & 0xFF
      arr[curByte++] = (tmp >> 8) & 0xFF
      arr[curByte++] = tmp & 0xFF
    }

    if (placeHoldersLen === 2) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 2) |
        (revLookup[b64.charCodeAt(i + 1)] >> 4)
      arr[curByte++] = tmp & 0xFF
    }

    if (placeHoldersLen === 1) {
      tmp =
        (revLookup[b64.charCodeAt(i)] << 10) |
        (revLookup[b64.charCodeAt(i + 1)] << 4) |
        (revLookup[b64.charCodeAt(i + 2)] >> 2)
      arr[curByte++] = (tmp >> 8) & 0xFF
      arr[curByte++] = tmp & 0xFF
    }

    return arr
  }

  function tripletToBase64 (num) {
    return lookup[num >> 18 & 0x3F] +
      lookup[num >> 12 & 0x3F] +
      lookup[num >> 6 & 0x3F] +
      lookup[num & 0x3F]
  }

  function encodeChunk (uint8, start, end) {
    var tmp
    var output = []
    for (var i = start; i < end; i += 3) {
      tmp =
        ((uint8[i] << 16) & 0xFF0000) +
        ((uint8[i + 1] << 8) & 0xFF00) +
        (uint8[i + 2] & 0xFF)
      output.push(tripletToBase64(tmp))
    }
    return output.join('')
  }

  function fromByteArray (uint8) {
    var tmp
    var len = uint8.length
    var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
    var parts = []
    var maxChunkLength = 16383 // must be multiple of 3

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
      parts.push(encodeChunk(
        uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)
      ))
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
      tmp = uint8[len - 1]
      parts.push(
        lookup[tmp >> 2] +
        lookup[(tmp << 4) & 0x3F] +
        '=='
      )
    } else if (extraBytes === 2) {
      tmp = (uint8[len - 2] << 8) + uint8[len - 1]
      parts.push(
        lookup[tmp >> 10] +
        lookup[(tmp >> 4) & 0x3F] +
        lookup[(tmp << 2) & 0x3F] +
        '='
      )
    }

    return parts.join('')
  }

  return exports;
});
define('skylark-langx-binary/ieee754',[],function(){
  'use strict'
  var exports = {};

  exports.read = function (buffer, offset, isLE, mLen, nBytes) {
    var e, m
    var eLen = (nBytes * 8) - mLen - 1
    var eMax = (1 << eLen) - 1
    var eBias = eMax >> 1
    var nBits = -7
    var i = isLE ? (nBytes - 1) : 0
    var d = isLE ? -1 : 1
    var s = buffer[offset + i]

    i += d

    e = s & ((1 << (-nBits)) - 1)
    s >>= (-nBits)
    nBits += eLen
    for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

    m = e & ((1 << (-nBits)) - 1)
    e >>= (-nBits)
    nBits += mLen
    for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

    if (e === 0) {
      e = 1 - eBias
    } else if (e === eMax) {
      return m ? NaN : ((s ? -1 : 1) * Infinity)
    } else {
      m = m + Math.pow(2, mLen)
      e = e - eBias
    }
    return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
  }

  exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
    var e, m, c
    var eLen = (nBytes * 8) - mLen - 1
    var eMax = (1 << eLen) - 1
    var eBias = eMax >> 1
    var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
    var i = isLE ? 0 : (nBytes - 1)
    var d = isLE ? 1 : -1
    var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

    value = Math.abs(value)

    if (isNaN(value) || value === Infinity) {
      m = isNaN(value) ? 1 : 0
      e = eMax
    } else {
      e = Math.floor(Math.log(value) / Math.LN2)
      if (value * (c = Math.pow(2, -e)) < 1) {
        e--
        c *= 2
      }
      if (e + eBias >= 1) {
        value += rt / c
      } else {
        value += rt * Math.pow(2, 1 - eBias)
      }
      if (value * c >= 2) {
        e++
        c /= 2
      }

      if (e + eBias >= eMax) {
        m = 0
        e = eMax
      } else if (e + eBias >= 1) {
        m = ((value * c) - 1) * Math.pow(2, mLen)
        e = e + eBias
      } else {
        m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
        e = 0
      }
    }

    for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

    e = (e << mLen) | m
    eLen += mLen
    for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

    buffer[offset + i - d] |= s * 128
  }

  return exports;
});

define('skylark-langx-binary/memory',[
  "./binary",
  "./base64",
  "./ieee754"
],function(binary,base64,ieee754){
  /*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   */
  /* eslint-disable no-proto */

  'use strict'


  Memory.INSPECT_MAX_BYTES = 50

  var K_MAX_LENGTH = 0x7fffffff
  Memory.kMaxLength = K_MAX_LENGTH

  /**
   * If `Memory.TYPED_ARRAY_SUPPORT`:
   *   === true    Use Uint8Array implementation (fastest)
   *   === false   Print warning and recommend using `buffer` v4.x which has an Object
   *               implementation (most compatible, even IE6)
   *
   * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
   * Opera 11.6+, iOS 4.2+.
   *
   * We report that the browser does not support typed arrays if the are not subclassable
   * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
   * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
   * for __proto__ and has a buggy typed array implementation.
   */
  Memory.TYPED_ARRAY_SUPPORT = typedArraySupport()

  if (!Memory.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
      typeof console.error === 'function') {
    console.error(
      'This browser lacks typed array (Uint8Array) support which is required by ' +
      '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
    )
  }

  function typedArraySupport () {
    // Can typed array instances can be augmented?
    try {
      var arr = new Uint8Array(1)
      arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
      return arr.foo() === 42
    } catch (e) {
      return false
    }
  }

  Object.defineProperty(Memory.prototype, 'parent', {
    get: function () {
      if (!(this instanceof Memory)) {
        return undefined
      }
      return this.buffer
    }
  })

  Object.defineProperty(Memory.prototype, 'offset', {
    get: function () {
      if (!(this instanceof Memory)) {
        return undefined
      }
      return this.byteOffset
    }
  })

  function reserveMemory (length) {
    if (length > K_MAX_LENGTH) {
      throw new RangeError('Invalid typed array length')
    }
    // Return an augmented `Uint8Array` instance
    var buf = new Uint8Array(length)
    buf.__proto__ = Memory.prototype
    return buf
  }

  /**
   * The Memory constructor returns instances of `Uint8Array` that have their
   * prototype changed to `Memory.prototype`. Furthermore, `Memory` is a subclass of
   * `Uint8Array`, so the returned instances will have all the node `Memory` methods
   * and the `Uint8Array` methods. Square bracket notation works as expected -- it
   * returns a single octet.
   *
   * The `Uint8Array` prototype remains unmodified.
   */

  function Memory (arg, encodingOrOffset, length) {
    // Common case.
    if (typeof arg === 'number') {
      if (typeof encodingOrOffset === 'string') {
        throw new Error(
          'If encoding is specified then the first argument must be a string'
        )
      }
      return allocUnsafe(arg)
    }
    return from(arg, encodingOrOffset, length)
  }

  // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Memory[Symbol.species] === Memory) {
    Object.defineProperty(Memory, Symbol.species, {
      value: null,
      configurable: true,
      enumerable: false,
      writable: false
    })
  }

  Memory.poolSize = 8192 // not used by this implementation

  function from (value, encodingOrOffset, length) {
    if (typeof value === 'number') {
      throw new TypeError('"value" argument must not be a number')
    }

    if (isArrayBuffer(value) || (value && isArrayBuffer(value.buffer))) {
      return fromArrayBuffer(value, encodingOrOffset, length)
    }

    if (typeof value === 'string') {
      return fromString(value, encodingOrOffset)
    }

    return fromObject(value)
  }

  /**
   * Functionally equivalent to Memory(arg, encoding) but throws a TypeError
   * if value is a number.
   * Memory.from(str[, encoding])
   * Memory.from(array)
   * Memory.from(buffer)
   * Memory.from(arrayBuffer[, byteOffset[, length]])
   **/
  Memory.from = function (value, encodingOrOffset, length) {
    return from(value, encodingOrOffset, length)
  }

  // Note: Change prototype *after* Memory.from is defined to workaround Chrome bug:
  // https://github.com/feross/buffer/pull/148
  Memory.prototype.__proto__ = Uint8Array.prototype
  Memory.__proto__ = Uint8Array

  function assertSize (size) {
    if (typeof size !== 'number') {
      throw new TypeError('"size" argument must be of type number')
    } else if (size < 0) {
      throw new RangeError('"size" argument must not be negative')
    }
  }

  function alloc (size, fill, encoding) {
    assertSize(size)
    if (size <= 0) {
      return reserveMemory(size)
    }
    if (fill !== undefined) {
      // Only pay attention to encoding if it's a string. This
      // prevents accidentally sending in a number that would
      // be interpretted as a start offset.
      return typeof encoding === 'string'
        ? reserveMemory(size).fill(fill, encoding)
        : reserveMemory(size).fill(fill)
    }
    return reserveMemory(size)
  }

  /**
   * Creates a new filled Memory instance.
   * alloc(size[, fill[, encoding]])
   **/
  Memory.alloc = function (size, fill, encoding) {
    return alloc(size, fill, encoding)
  }

  function allocUnsafe (size) {
    assertSize(size)
    return reserveMemory(size < 0 ? 0 : checked(size) | 0)
  }

  /**
   * Equivalent to Memory(num), by default creates a non-zero-filled Memory instance.
   * */
  Memory.allocUnsafe = function (size) {
    return allocUnsafe(size)
  }
  /**
   * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Memory instance.
   */
  Memory.allocUnsafeSlow = function (size) {
    return allocUnsafe(size)
  }

  function fromString (string, encoding) {
    if (typeof encoding !== 'string' || encoding === '') {
      encoding = 'utf8'
    }

    if (!Memory.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }

    var length = byteLength(string, encoding) | 0
    var buf = reserveMemory(length)

    var actual = buf.write(string, encoding)

    if (actual !== length) {
      // Writing a hex string, for example, that contains invalid characters will
      // cause everything after the first invalid character to be ignored. (e.g.
      // 'abxxcd' will be treated as 'ab')
      buf = buf.slice(0, actual)
    }

    return buf
  }

  function fromArrayLike (array) {
    var length = array.length < 0 ? 0 : checked(array.length) | 0
    var buf = reserveMemory(length)
    for (var i = 0; i < length; i += 1) {
      buf[i] = array[i] & 255
    }
    return buf
  }

  function fromArrayBuffer (array, byteOffset, length) {
    if (byteOffset < 0 || array.byteLength < byteOffset) {
      throw new RangeError('"offset" is outside of buffer bounds')
    }

    if (array.byteLength < byteOffset + (length || 0)) {
      throw new RangeError('"length" is outside of buffer bounds')
    }

    var buf
    if (byteOffset === undefined && length === undefined) {
      buf = new Uint8Array(array)
    } else if (length === undefined) {
      buf = new Uint8Array(array, byteOffset)
    } else {
      buf = new Uint8Array(array, byteOffset, length)
    }

    // Return an augmented `Uint8Array` instance
    buf.__proto__ = Memory.prototype
    return buf
  }

  function fromObject (obj) {
    if (Memory.isBuffer(obj)) {
      var len = checked(obj.length) | 0
      var buf = reserveMemory(len)

      if (buf.length === 0) {
        return buf
      }

      obj.copy(buf, 0, 0, len)
      return buf
    }

    if (obj) {
      if (ArrayBuffer.isView(obj) || 'length' in obj) {
        if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
          return reserveMemory(0)
        }
        return fromArrayLike(obj)
      }

      if (obj.type === 'Memory' && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data)
      }
    }

    throw new TypeError('The first argument must be one of type string, Memory, ArrayBuffer, Array, or Array-like Object.')
  }

  function checked (length) {
    // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
    // length is NaN (which is otherwise coerced to zero.)
    if (length >= K_MAX_LENGTH) {
      throw new RangeError('Attempt to allocate Memory larger than maximum ' +
                           'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
    }
    return length | 0
  }

  function SlowBuffer (length) {
    if (+length != length) { // eslint-disable-line eqeqeq
      length = 0
    }
    return Memory.alloc(+length)
  }

  Memory.isMemory = Memory.isBuffer = function isMemory (b) {
    return b != null && b._isBuffer === true
  }

  Memory.compare = function compare (a, b) {
    if (!Memory.isMemory(a) || !Memory.isMemory(b)) {
      throw new TypeError('Arguments must be Buffers')
    }

    if (a === b) return 0

    var x = a.length
    var y = b.length

    for (var i = 0, len = Math.min(x, y); i < len; ++i) {
      if (a[i] !== b[i]) {
        x = a[i]
        y = b[i]
        break
      }
    }

    if (x < y) return -1
    if (y < x) return 1
    return 0
  }

  Memory.isEncoding = function isEncoding (encoding) {
    switch (String(encoding).toLowerCase()) {
      case 'hex':
      case 'utf8':
      case 'utf-8':
      case 'ascii':
      case 'latin1':
      case 'binary':
      case 'base64':
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return true
      default:
        return false
    }
  }

  Memory.concat = function concat (list, length) {
    if (!Array.isArray(list)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }

    if (list.length === 0) {
      return Memory.alloc(0)
    }

    var i
    if (length === undefined) {
      length = 0
      for (i = 0; i < list.length; ++i) {
        length += list[i].length
      }
    }

    var buffer = Memory.allocUnsafe(length)
    var pos = 0
    for (i = 0; i < list.length; ++i) {
      var buf = list[i]
      if (ArrayBuffer.isView(buf)) {
        buf = Memory.from(buf)
      }
      if (!Memory.isMemory(buf)) {
        throw new TypeError('"list" argument must be an Array of Buffers')
      }
      buf.copy(buffer, pos)
      pos += buf.length
    }
    return buffer
  }

  function byteLength (string, encoding) {
    if (Memory.isMemory(string)) {
      return string.length
    }
    if (ArrayBuffer.isView(string) || isArrayBuffer(string)) {
      return string.byteLength
    }
    if (typeof string !== 'string') {
      string = '' + string
    }

    var len = string.length
    if (len === 0) return 0

    // Use a for loop to avoid recursion
    var loweredCase = false
    for (;;) {
      switch (encoding) {
        case 'ascii':
        case 'latin1':
        case 'binary':
          return len
        case 'utf8':
        case 'utf-8':
        case undefined:
          return utf8ToBytes(string).length
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return len * 2
        case 'hex':
          return len >>> 1
        case 'base64':
          return base64ToBytes(string).length
        default:
          if (loweredCase) return utf8ToBytes(string).length // assume utf8
          encoding = ('' + encoding).toLowerCase()
          loweredCase = true
      }
    }
  }
  Memory.byteLength = byteLength


  /**
   * Create arraybuffer from memory
   *
   * @method toArrayBuffer
   * @param {Buffer} buffer
   * @return {Arraybuffer} data
   */
  Memory.toArrayBuffer = function(memory) {
    var array = new ArrayBuffer(memory.length);
    var view = new Uint8Array(array);

    for(var i = 0; i < memory.length; i++){
      view[i] = memory[i];
    }

    return array;

    //Faster but the results is failing the "instanceof ArrayBuffer" test
    //return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  }

  function slowToString (encoding, start, end) {
    var loweredCase = false

    // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
    // property of a typed array.

    // This behaves neither like String nor Uint8Array in that we set start/end
    // to their upper/lower bounds if the value passed is out of range.
    // undefined is handled specially as per ECMA-262 6th Edition,
    // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
    if (start === undefined || start < 0) {
      start = 0
    }
    // Return early if start > this.length. Done here to prevent potential uint32
    // coercion fail below.
    if (start > this.length) {
      return ''
    }

    if (end === undefined || end > this.length) {
      end = this.length
    }

    if (end <= 0) {
      return ''
    }

    // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
    end >>>= 0
    start >>>= 0

    if (end <= start) {
      return ''
    }

    if (!encoding) encoding = 'utf8'

    while (true) {
      switch (encoding) {
        case 'hex':
          return hexSlice(this, start, end)

        case 'utf8':
        case 'utf-8':
          return utf8Slice(this, start, end)

        case 'ascii':
          return asciiSlice(this, start, end)

        case 'latin1':
        case 'binary':
          return latin1Slice(this, start, end)

        case 'base64':
          return base64Slice(this, start, end)

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return utf16leSlice(this, start, end)

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
          encoding = (encoding + '').toLowerCase()
          loweredCase = true
      }
    }
  }

  // This property is used by `Memory.isMemory` 
  // to detect a Memory instance. 
  Memory.prototype._isMemory = true

  function swap (b, n, m) {
    var i = b[n]
    b[n] = b[m]
    b[m] = i
  }

  Memory.prototype.swap16 = function swap16 () {
    var len = this.length
    if (len % 2 !== 0) {
      throw new RangeError('Memory size must be a multiple of 16-bits')
    }
    for (var i = 0; i < len; i += 2) {
      swap(this, i, i + 1)
    }
    return this
  }

  Memory.prototype.swap32 = function swap32 () {
    var len = this.length
    if (len % 4 !== 0) {
      throw new RangeError('Memory size must be a multiple of 32-bits')
    }
    for (var i = 0; i < len; i += 4) {
      swap(this, i, i + 3)
      swap(this, i + 1, i + 2)
    }
    return this
  }

  Memory.prototype.swap64 = function swap64 () {
    var len = this.length
    if (len % 8 !== 0) {
      throw new RangeError('Memory size must be a multiple of 64-bits')
    }
    for (var i = 0; i < len; i += 8) {
      swap(this, i, i + 7)
      swap(this, i + 1, i + 6)
      swap(this, i + 2, i + 5)
      swap(this, i + 3, i + 4)
    }
    return this
  }

  Memory.prototype.toString = function toString () {
    var length = this.length
    if (length === 0) return ''
    if (arguments.length === 0) return utf8Slice(this, 0, length)
    return slowToString.apply(this, arguments)
  }

  Memory.prototype.toLocaleString = Memory.prototype.toString

  Memory.prototype.equals = function equals (b) {
    if (!Memory.isMemory(b)) throw new TypeError('Argument must be a Memory')
    if (this === b) return true
    return Memory.compare(this, b) === 0
  }

  Memory.prototype.inspect = function inspect () {
    var str = ''
    var max = Memory.INSPECT_MAX_BYTES
    if (this.length > 0) {
      str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
      if (this.length > max) str += ' ... '
    }
    return '<Memory ' + str + '>'
  }

  Memory.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
    if (!Memory.isMemory(target)) {
      throw new TypeError('Argument must be a Memory')
    }

    if (start === undefined) {
      start = 0
    }
    if (end === undefined) {
      end = target ? target.length : 0
    }
    if (thisStart === undefined) {
      thisStart = 0
    }
    if (thisEnd === undefined) {
      thisEnd = this.length
    }

    if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
      throw new RangeError('out of range index')
    }

    if (thisStart >= thisEnd && start >= end) {
      return 0
    }
    if (thisStart >= thisEnd) {
      return -1
    }
    if (start >= end) {
      return 1
    }

    start >>>= 0
    end >>>= 0
    thisStart >>>= 0
    thisEnd >>>= 0

    if (this === target) return 0

    var x = thisEnd - thisStart
    var y = end - start
    var len = Math.min(x, y)

    var thisCopy = this.slice(thisStart, thisEnd)
    var targetCopy = target.slice(start, end)

    for (var i = 0; i < len; ++i) {
      if (thisCopy[i] !== targetCopy[i]) {
        x = thisCopy[i]
        y = targetCopy[i]
        break
      }
    }

    if (x < y) return -1
    if (y < x) return 1
    return 0
  }

  // Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
  // OR the last index of `val` in `buffer` at offset <= `byteOffset`.
  //
  // Arguments:
  // - buffer - a Memory to search
  // - val - a string, Memory, or number
  // - byteOffset - an index into `buffer`; will be clamped to an int32
  // - encoding - an optional encoding, relevant is val is a string
  // - dir - true for indexOf, false for lastIndexOf
  function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
    // Empty buffer means no match
    if (buffer.length === 0) return -1

    // Normalize byteOffset
    if (typeof byteOffset === 'string') {
      encoding = byteOffset
      byteOffset = 0
    } else if (byteOffset > 0x7fffffff) {
      byteOffset = 0x7fffffff
    } else if (byteOffset < -0x80000000) {
      byteOffset = -0x80000000
    }
    byteOffset = +byteOffset  // Coerce to Number.
    if (numberIsNaN(byteOffset)) {
      // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
      byteOffset = dir ? 0 : (buffer.length - 1)
    }

    // Normalize byteOffset: negative offsets start from the end of the buffer
    if (byteOffset < 0) byteOffset = buffer.length + byteOffset
    if (byteOffset >= buffer.length) {
      if (dir) return -1
      else byteOffset = buffer.length - 1
    } else if (byteOffset < 0) {
      if (dir) byteOffset = 0
      else return -1
    }

    // Normalize val
    if (typeof val === 'string') {
      val = Memory.from(val, encoding)
    }

    // Finally, search either indexOf (if dir is true) or lastIndexOf
    if (Memory.isMemory(val)) {
      // Special case: looking for empty string/buffer always fails
      if (val.length === 0) {
        return -1
      }
      return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
    } else if (typeof val === 'number') {
      val = val & 0xFF // Search for a byte value [0-255]
      if (typeof Uint8Array.prototype.indexOf === 'function') {
        if (dir) {
          return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
        } else {
          return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
        }
      }
      return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
    }

    throw new TypeError('val must be string, number or Memory')
  }

  function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
    var indexSize = 1
    var arrLength = arr.length
    var valLength = val.length

    if (encoding !== undefined) {
      encoding = String(encoding).toLowerCase()
      if (encoding === 'ucs2' || encoding === 'ucs-2' ||
          encoding === 'utf16le' || encoding === 'utf-16le') {
        if (arr.length < 2 || val.length < 2) {
          return -1
        }
        indexSize = 2
        arrLength /= 2
        valLength /= 2
        byteOffset /= 2
      }
    }

    function read (buf, i) {
      if (indexSize === 1) {
        return buf[i]
      } else {
        return buf.readUInt16BE(i * indexSize)
      }
    }

    var i
    if (dir) {
      var foundIndex = -1
      for (i = byteOffset; i < arrLength; i++) {
        if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
          if (foundIndex === -1) foundIndex = i
          if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
        } else {
          if (foundIndex !== -1) i -= i - foundIndex
          foundIndex = -1
        }
      }
    } else {
      if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
      for (i = byteOffset; i >= 0; i--) {
        var found = true
        for (var j = 0; j < valLength; j++) {
          if (read(arr, i + j) !== read(val, j)) {
            found = false
            break
          }
        }
        if (found) return i
      }
    }

    return -1
  }

  Memory.prototype.includes = function includes (val, byteOffset, encoding) {
    return this.indexOf(val, byteOffset, encoding) !== -1
  }

  Memory.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
  }

  Memory.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
    return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
  }

  function hexWrite (buf, string, offset, length) {
    offset = Number(offset) || 0
    var remaining = buf.length - offset
    if (!length) {
      length = remaining
    } else {
      length = Number(length)
      if (length > remaining) {
        length = remaining
      }
    }

    var strLen = string.length

    if (length > strLen / 2) {
      length = strLen / 2
    }
    for (var i = 0; i < length; ++i) {
      var parsed = parseInt(string.substr(i * 2, 2), 16)
      if (numberIsNaN(parsed)) return i
      buf[offset + i] = parsed
    }
    return i
  }

  function utf8Write (buf, string, offset, length) {
    return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
  }

  function asciiWrite (buf, string, offset, length) {
    return blitBuffer(asciiToBytes(string), buf, offset, length)
  }

  function latin1Write (buf, string, offset, length) {
    return asciiWrite(buf, string, offset, length)
  }

  function base64Write (buf, string, offset, length) {
    return blitBuffer(base64ToBytes(string), buf, offset, length)
  }

  function ucs2Write (buf, string, offset, length) {
    return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
  }

  Memory.prototype.write = function write (string, offset, length, encoding) {
    // Memory#write(string)
    if (offset === undefined) {
      encoding = 'utf8'
      length = this.length
      offset = 0
    // Memory#write(string, encoding)
    } else if (length === undefined && typeof offset === 'string') {
      encoding = offset
      length = this.length
      offset = 0
    // Memory#write(string, offset[, length][, encoding])
    } else if (isFinite(offset)) {
      offset = offset >>> 0
      if (isFinite(length)) {
        length = length >>> 0
        if (encoding === undefined) encoding = 'utf8'
      } else {
        encoding = length
        length = undefined
      }
    } else {
      throw new Error(
        'Memory.write(string, encoding, offset[, length]) is no longer supported'
      )
    }

    var remaining = this.length - offset
    if (length === undefined || length > remaining) length = remaining

    if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
      throw new RangeError('Attempt to write outside buffer bounds')
    }

    if (!encoding) encoding = 'utf8'

    var loweredCase = false
    for (;;) {
      switch (encoding) {
        case 'hex':
          return hexWrite(this, string, offset, length)

        case 'utf8':
        case 'utf-8':
          return utf8Write(this, string, offset, length)

        case 'ascii':
          return asciiWrite(this, string, offset, length)

        case 'latin1':
        case 'binary':
          return latin1Write(this, string, offset, length)

        case 'base64':
          // Warning: maxLength not taken into account in base64Write
          return base64Write(this, string, offset, length)

        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return ucs2Write(this, string, offset, length)

        default:
          if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
          encoding = ('' + encoding).toLowerCase()
          loweredCase = true
      }
    }
  }

  Memory.prototype.toJSON = function toJSON () {
    return {
      type: 'Memory',
      data: Array.prototype.slice.call(this._arr || this, 0)
    }
  }

  function base64Slice (buf, start, end) {
    if (start === 0 && end === buf.length) {
      return base64.fromByteArray(buf)
    } else {
      return base64.fromByteArray(buf.slice(start, end))
    }
  }

  function utf8Slice (buf, start, end) {
    end = Math.min(buf.length, end)
    var res = []

    var i = start
    while (i < end) {
      var firstByte = buf[i]
      var codePoint = null
      var bytesPerSequence = (firstByte > 0xEF) ? 4
        : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
        : 1

      if (i + bytesPerSequence <= end) {
        var secondByte, thirdByte, fourthByte, tempCodePoint

        switch (bytesPerSequence) {
          case 1:
            if (firstByte < 0x80) {
              codePoint = firstByte
            }
            break
          case 2:
            secondByte = buf[i + 1]
            if ((secondByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
              if (tempCodePoint > 0x7F) {
                codePoint = tempCodePoint
              }
            }
            break
          case 3:
            secondByte = buf[i + 1]
            thirdByte = buf[i + 2]
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
              if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
                codePoint = tempCodePoint
              }
            }
            break
          case 4:
            secondByte = buf[i + 1]
            thirdByte = buf[i + 2]
            fourthByte = buf[i + 3]
            if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
              tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
              if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
                codePoint = tempCodePoint
              }
            }
        }
      }

      if (codePoint === null) {
        // we did not generate a valid codePoint so insert a
        // replacement char (U+FFFD) and advance only 1 byte
        codePoint = 0xFFFD
        bytesPerSequence = 1
      } else if (codePoint > 0xFFFF) {
        // encode to utf16 (surrogate pair dance)
        codePoint -= 0x10000
        res.push(codePoint >>> 10 & 0x3FF | 0xD800)
        codePoint = 0xDC00 | codePoint & 0x3FF
      }

      res.push(codePoint)
      i += bytesPerSequence
    }

    return decodeCodePointsArray(res)
  }

  // Based on http://stackoverflow.com/a/22747272/680742, the browser with
  // the lowest limit is Chrome, with 0x10000 args.
  // We go 1 magnitude less, for safety
  var MAX_ARGUMENTS_LENGTH = 0x1000

  function decodeCodePointsArray (codePoints) {
    var len = codePoints.length
    if (len <= MAX_ARGUMENTS_LENGTH) {
      return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
    }

    // Decode in chunks to avoid "call stack size exceeded".
    var res = ''
    var i = 0
    while (i < len) {
      res += String.fromCharCode.apply(
        String,
        codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
      )
    }
    return res
  }

  function asciiSlice (buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)

    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i] & 0x7F)
    }
    return ret
  }

  function latin1Slice (buf, start, end) {
    var ret = ''
    end = Math.min(buf.length, end)

    for (var i = start; i < end; ++i) {
      ret += String.fromCharCode(buf[i])
    }
    return ret
  }

  function hexSlice (buf, start, end) {
    var len = buf.length

    if (!start || start < 0) start = 0
    if (!end || end < 0 || end > len) end = len

    var out = ''
    for (var i = start; i < end; ++i) {
      out += toHex(buf[i])
    }
    return out
  }

  function utf16leSlice (buf, start, end) {
    var bytes = buf.slice(start, end)
    var res = ''
    for (var i = 0; i < bytes.length; i += 2) {
      res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
    }
    return res
  }

  Memory.prototype.slice = function slice (start, end) {
    var len = this.length
    start = ~~start
    end = end === undefined ? len : ~~end

    if (start < 0) {
      start += len
      if (start < 0) start = 0
    } else if (start > len) {
      start = len
    }

    if (end < 0) {
      end += len
      if (end < 0) end = 0
    } else if (end > len) {
      end = len
    }

    if (end < start) end = start

    var newBuf = this.subarray(start, end)
    // Return an augmented `Uint8Array` instance
    newBuf.__proto__ = Memory.prototype
    return newBuf
  }

  /*
   * Need to make sure that buffer isn't trying to write out of bounds.
   */
  function checkOffset (offset, ext, length) {
    if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
    if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
  }

  Memory.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) checkOffset(offset, byteLength, this.length)

    var val = this[offset]
    var mul = 1
    var i = 0
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul
    }

    return val
  }

  Memory.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) {
      checkOffset(offset, byteLength, this.length)
    }

    var val = this[offset + --byteLength]
    var mul = 1
    while (byteLength > 0 && (mul *= 0x100)) {
      val += this[offset + --byteLength] * mul
    }

    return val
  }

  Memory.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 1, this.length)
    return this[offset]
  }

  Memory.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 2, this.length)
    return this[offset] | (this[offset + 1] << 8)
  }

  Memory.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 2, this.length)
    return (this[offset] << 8) | this[offset + 1]
  }

  Memory.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)

    return ((this[offset]) |
        (this[offset + 1] << 8) |
        (this[offset + 2] << 16)) +
        (this[offset + 3] * 0x1000000)
  }

  Memory.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)

    return (this[offset] * 0x1000000) +
      ((this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      this[offset + 3])
  }

  Memory.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) checkOffset(offset, byteLength, this.length)

    var val = this[offset]
    var mul = 1
    var i = 0
    while (++i < byteLength && (mul *= 0x100)) {
      val += this[offset + i] * mul
    }
    mul *= 0x80

    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

    return val
  }

  Memory.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) checkOffset(offset, byteLength, this.length)

    var i = byteLength
    var mul = 1
    var val = this[offset + --i]
    while (i > 0 && (mul *= 0x100)) {
      val += this[offset + --i] * mul
    }
    mul *= 0x80

    if (val >= mul) val -= Math.pow(2, 8 * byteLength)

    return val
  }

  Memory.prototype.readInt8 = function readInt8 (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 1, this.length)
    if (!(this[offset] & 0x80)) return (this[offset])
    return ((0xff - this[offset] + 1) * -1)
  }

  Memory.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 2, this.length)
    var val = this[offset] | (this[offset + 1] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }

  Memory.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 2, this.length)
    var val = this[offset + 1] | (this[offset] << 8)
    return (val & 0x8000) ? val | 0xFFFF0000 : val
  }

  Memory.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)

    return (this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16) |
      (this[offset + 3] << 24)
  }

  Memory.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)

    return (this[offset] << 24) |
      (this[offset + 1] << 16) |
      (this[offset + 2] << 8) |
      (this[offset + 3])
  }

  Memory.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)
    return ieee754.read(this, offset, true, 23, 4)
  }

  Memory.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 4, this.length)
    return ieee754.read(this, offset, false, 23, 4)
  }

  Memory.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 8, this.length)
    return ieee754.read(this, offset, true, 52, 8)
  }

  Memory.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
    offset = offset >>> 0
    if (!noAssert) checkOffset(offset, 8, this.length)
    return ieee754.read(this, offset, false, 52, 8)
  }

  function checkInt (buf, value, offset, ext, max, min) {
    if (!Memory.isMemory(buf)) throw new TypeError('"buffer" argument must be a Memory instance')
    if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
    if (offset + ext > buf.length) throw new RangeError('Index out of range')
  }

  Memory.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1
      checkInt(this, value, offset, byteLength, maxBytes, 0)
    }

    var mul = 1
    var i = 0
    this[offset] = value & 0xFF
    while (++i < byteLength && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xFF
    }

    return offset + byteLength
  }

  Memory.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    byteLength = byteLength >>> 0
    if (!noAssert) {
      var maxBytes = Math.pow(2, 8 * byteLength) - 1
      checkInt(this, value, offset, byteLength, maxBytes, 0)
    }

    var i = byteLength - 1
    var mul = 1
    this[offset + i] = value & 0xFF
    while (--i >= 0 && (mul *= 0x100)) {
      this[offset + i] = (value / mul) & 0xFF
    }

    return offset + byteLength
  }

  Memory.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
    this[offset] = (value & 0xff)
    return offset + 1
  }

  Memory.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    return offset + 2
  }

  Memory.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
    return offset + 2
  }

  Memory.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
    return offset + 4
  }

  Memory.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
    return offset + 4
  }

  Memory.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      var limit = Math.pow(2, (8 * byteLength) - 1)

      checkInt(this, value, offset, byteLength, limit - 1, -limit)
    }

    var i = 0
    var mul = 1
    var sub = 0
    this[offset] = value & 0xFF
    while (++i < byteLength && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
        sub = 1
      }
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }

    return offset + byteLength
  }

  Memory.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      var limit = Math.pow(2, (8 * byteLength) - 1)

      checkInt(this, value, offset, byteLength, limit - 1, -limit)
    }

    var i = byteLength - 1
    var mul = 1
    var sub = 0
    this[offset + i] = value & 0xFF
    while (--i >= 0 && (mul *= 0x100)) {
      if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
        sub = 1
      }
      this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
    }

    return offset + byteLength
  }

  Memory.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
    if (value < 0) value = 0xff + value + 1
    this[offset] = (value & 0xff)
    return offset + 1
  }

  Memory.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    return offset + 2
  }

  Memory.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
    return offset + 2
  }

  Memory.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
    return offset + 4
  }

  Memory.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
    if (value < 0) value = 0xffffffff + value + 1
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
    return offset + 4
  }

  function checkIEEE754 (buf, value, offset, ext, max, min) {
    if (offset + ext > buf.length) throw new RangeError('Index out of range')
    if (offset < 0) throw new RangeError('Index out of range')
  }

  function writeFloat (buf, value, offset, littleEndian, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
    }
    ieee754.write(buf, value, offset, littleEndian, 23, 4)
    return offset + 4
  }

  Memory.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
    return writeFloat(this, value, offset, true, noAssert)
  }

  Memory.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
    return writeFloat(this, value, offset, false, noAssert)
  }

  function writeDouble (buf, value, offset, littleEndian, noAssert) {
    value = +value
    offset = offset >>> 0
    if (!noAssert) {
      checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
    }
    ieee754.write(buf, value, offset, littleEndian, 52, 8)
    return offset + 8
  }

  Memory.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
    return writeDouble(this, value, offset, true, noAssert)
  }

  Memory.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
    return writeDouble(this, value, offset, false, noAssert)
  }

  // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
  Memory.prototype.copy = function copy (target, targetStart, start, end) {
    if (!Memory.isMemory(target)) throw new TypeError('argument should be a Memory')
    if (!start) start = 0
    if (!end && end !== 0) end = this.length
    if (targetStart >= target.length) targetStart = target.length
    if (!targetStart) targetStart = 0
    if (end > 0 && end < start) end = start

    // Copy 0 bytes; we're done
    if (end === start) return 0
    if (target.length === 0 || this.length === 0) return 0

    // Fatal error conditions
    if (targetStart < 0) {
      throw new RangeError('targetStart out of bounds')
    }
    if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
    if (end < 0) throw new RangeError('sourceEnd out of bounds')

    // Are we oob?
    if (end > this.length) end = this.length
    if (target.length - targetStart < end - start) {
      end = target.length - targetStart + start
    }

    var len = end - start

    if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
      // Use built-in when available, missing from IE11
      this.copyWithin(targetStart, start, end)
    } else if (this === target && start < targetStart && targetStart < end) {
      // descending copy from end
      for (var i = len - 1; i >= 0; --i) {
        target[i + targetStart] = this[i + start]
      }
    } else {
      Uint8Array.prototype.set.call(
        target,
        this.subarray(start, end),
        targetStart
      )
    }

    return len
  }

  // Usage:
  //    buffer.fill(number[, offset[, end]])
  //    buffer.fill(buffer[, offset[, end]])
  //    buffer.fill(string[, offset[, end]][, encoding])
  Memory.prototype.fill = function fill (val, start, end, encoding) {
    // Handle string cases:
    if (typeof val === 'string') {
      if (typeof start === 'string') {
        encoding = start
        start = 0
        end = this.length
      } else if (typeof end === 'string') {
        encoding = end
        end = this.length
      }
      if (encoding !== undefined && typeof encoding !== 'string') {
        throw new TypeError('encoding must be a string')
      }
      if (typeof encoding === 'string' && !Memory.isEncoding(encoding)) {
        throw new TypeError('Unknown encoding: ' + encoding)
      }
      if (val.length === 1) {
        var code = val.charCodeAt(0)
        if ((encoding === 'utf8' && code < 128) ||
            encoding === 'latin1') {
          // Fast path: If `val` fits into a single byte, use that numeric value.
          val = code
        }
      }
    } else if (typeof val === 'number') {
      val = val & 255
    }

    // Invalid ranges are not set to a default, so can range check early.
    if (start < 0 || this.length < start || this.length < end) {
      throw new RangeError('Out of range index')
    }

    if (end <= start) {
      return this
    }

    start = start >>> 0
    end = end === undefined ? this.length : end >>> 0

    if (!val) val = 0

    var i
    if (typeof val === 'number') {
      for (i = start; i < end; ++i) {
        this[i] = val
      }
    } else {
      var bytes = Memory.isMemory(val)
        ? val
        : new Memory(val, encoding)
      var len = bytes.length
      if (len === 0) {
        throw new TypeError('The value "' + val +
          '" is invalid for argument "value"')
      }
      for (i = 0; i < end - start; ++i) {
        this[i + start] = bytes[i % len]
      }
    }

    return this
  }

  // HELPER FUNCTIONS
  // ================

  var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

  function base64clean (str) {
    // Node takes equal signs as end of the Base64 encoding
    str = str.split('=')[0]
    // Node strips out invalid characters like \n and \t from the string, base64-js does not
    str = str.trim().replace(INVALID_BASE64_RE, '')
    // Node converts strings with length < 2 to ''
    if (str.length < 2) return ''
    // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
    while (str.length % 4 !== 0) {
      str = str + '='
    }
    return str
  }

  function toHex (n) {
    if (n < 16) return '0' + n.toString(16)
    return n.toString(16)
  }

  function utf8ToBytes (string, units) {
    units = units || Infinity
    var codePoint
    var length = string.length
    var leadSurrogate = null
    var bytes = []

    for (var i = 0; i < length; ++i) {
      codePoint = string.charCodeAt(i)

      // is surrogate component
      if (codePoint > 0xD7FF && codePoint < 0xE000) {
        // last char was a lead
        if (!leadSurrogate) {
          // no lead yet
          if (codePoint > 0xDBFF) {
            // unexpected trail
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            continue
          } else if (i + 1 === length) {
            // unpaired lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
            continue
          }

          // valid lead
          leadSurrogate = codePoint

          continue
        }

        // 2 leads in a row
        if (codePoint < 0xDC00) {
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          leadSurrogate = codePoint
          continue
        }

        // valid surrogate pair
        codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
      } else if (leadSurrogate) {
        // valid bmp char, but last char was a lead
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
      }

      leadSurrogate = null

      // encode utf8
      if (codePoint < 0x80) {
        if ((units -= 1) < 0) break
        bytes.push(codePoint)
      } else if (codePoint < 0x800) {
        if ((units -= 2) < 0) break
        bytes.push(
          codePoint >> 0x6 | 0xC0,
          codePoint & 0x3F | 0x80
        )
      } else if (codePoint < 0x10000) {
        if ((units -= 3) < 0) break
        bytes.push(
          codePoint >> 0xC | 0xE0,
          codePoint >> 0x6 & 0x3F | 0x80,
          codePoint & 0x3F | 0x80
        )
      } else if (codePoint < 0x110000) {
        if ((units -= 4) < 0) break
        bytes.push(
          codePoint >> 0x12 | 0xF0,
          codePoint >> 0xC & 0x3F | 0x80,
          codePoint >> 0x6 & 0x3F | 0x80,
          codePoint & 0x3F | 0x80
        )
      } else {
        throw new Error('Invalid code point')
      }
    }

    return bytes
  }

  function asciiToBytes (str) {
    var byteArray = []
    for (var i = 0; i < str.length; ++i) {
      // Node's code seems to be doing this and not & 0x7F..
      byteArray.push(str.charCodeAt(i) & 0xFF)
    }
    return byteArray
  }

  function utf16leToBytes (str, units) {
    var c, hi, lo
    var byteArray = []
    for (var i = 0; i < str.length; ++i) {
      if ((units -= 2) < 0) break

      c = str.charCodeAt(i)
      hi = c >> 8
      lo = c % 256
      byteArray.push(lo)
      byteArray.push(hi)
    }

    return byteArray
  }

  function base64ToBytes (str) {
    return base64.toByteArray(base64clean(str))
  }

  function blitBuffer (src, dst, offset, length) {
    for (var i = 0; i < length; ++i) {
      if ((i + offset >= dst.length) || (i >= src.length)) break
      dst[i + offset] = src[i]
    }
    return i
  }

  // ArrayBuffers from another context (i.e. an iframe) do not pass the `instanceof` check
  // but they should be treated as valid. See: https://github.com/feross/buffer/issues/166
  function isArrayBuffer (obj) {
    return obj instanceof ArrayBuffer ||
      (obj != null && obj.constructor != null && obj.constructor.name === 'ArrayBuffer' &&
        typeof obj.byteLength === 'number')
  }

  function numberIsNaN (obj) {
    return obj !== obj // eslint-disable-line no-self-compare
  }

  return binary.Memory = Memory;

});
define('skylark-langx-binary/get-type-of',[
    "./binary",
    "./memory"
],function(binary,Memory){
     function getTypeOf(input) {
        if (typeof input === 'string') {
            return 'string';
        }
        if (Object.prototype.toString.call(input) === '[object Array]') {
            return 'array';
        }
        if (Memory.isMemory(input)) {
            return 'memory';
        }
        if (input instanceof Uint8Array) {
            return 'uint8array';
        }
        if (input instanceof ArrayBuffer) {
            return 'arraybuffer';
        }
    }
	
	return getTypeOf;	
});
define('skylark-langx-binary/string-to-arraylike',[
  "./binary"
],function(binary){

    function stringToArrayLike(str, array) {
        for (var i = 0; i < str.length; ++i) {
            array[i] = str.charCodeAt(i) & 255;
        }
        return array;
    }

    return binary.stringToArrayLike = stringToArrayLike;
});

define('skylark-langx-binary/arraylike-to-string',[
  "./binary",
  "./get-type-of"
],function(binary,getTypeOf){

    var arrayToStringHelper = {
        stringifyByChunk: function (array, type, chunk) {
            var result = [], k = 0, len = array.length;
            if (len <= chunk) {
                return String.fromCharCode.apply(null, array);
            }
            while (k < len) {
                if (type === 'array' || type === 'nodebuffer') {
                    result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
                } else {
                    result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
                }
                k += chunk;
            }
            return result.join('');
        },
        stringifyByChar: function (array) {
            var resultStr = '';
            for (var i = 0; i < array.length; i++) {
                resultStr += String.fromCharCode(array[i]);
            }
            return resultStr;
        },
        applyCanBeUsed: {
            uint8array: function () {
                try {
                    return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
                } catch (e) {
                    return false;
                }
            }(),
            nodebuffer: function () {
                try {
                ///    return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.allocBuffer(1)).length === 1;
                    return support.nodebuffer && String.fromCharCode.apply(null, Buffer.alloc(1)).length === 1;
                } catch (e) {
                    return false;
                }
            }()
        }
    };
    function arrayLikeToString(array) {
        var chunk = 65536, type = getTypeOf(array), canUseApply = true;
        if (type === 'uint8array') {
            canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
        } else if (type === 'memory') {
            canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
        }
        if (canUseApply) {
            while (chunk > 1) {
                try {
                    return arrayToStringHelper.stringifyByChunk(array, type, chunk);
                } catch (e) {
                    chunk = Math.floor(chunk / 2);
                }
            }
        }
        return arrayToStringHelper.stringifyByChar(array);
    }

    return binary.arrayLikeToString = arrayLikeToString;
});

define('skylark-langx-binary/transform',[
    "./binary",
    "./memory",
    "./get-type-of",
    "./string-to-arraylike",
    "./arraylike-to-string"
],function(binary,Memory,getTypeOf,stringToArrayLike,arrayLikeToString){

    function identity(input) {
        return input;
    }

    function arrayLikeToArrayLike(arrayFrom, arrayTo) {
        for (var i = 0; i < arrayFrom.length; i++) {
            arrayTo[i] = arrayFrom[i];
        }
        return arrayTo;
    }

    var transform =  function (outputType, input) {
        if (!input) {
            input = '';
        }
        if (!outputType) {
            return input;
        }
        var inputType = getTypeOf(input);
        var result = transform[inputType][outputType](input);
        return result;
    };
    transform['string'] = {
        'string': identity,
        'array': function (input) {
            return stringToArrayLike(input, new Array(input.length));
        },
        'arraybuffer': function (input) {
            return transform['string']['uint8array'](input).buffer;
        },
        'uint8array': function (input) {
            return stringToArrayLike(input, new Uint8Array(input.length));
        },
        'memory': function (input) {
            ///return stringToArrayLike(input, nodejsUtils.allocBuffer(input.length));
            return stringToArrayLike(input, Buffer.alloc(input.length));
        }
    };
    transform['array'] = {
        'string': arrayLikeToString,
        'array': identity,
        'arraybuffer': function (input) {
            return new Uint8Array(input).buffer;
        },
        'uint8array': function (input) {
            return new Uint8Array(input);
        },
        'memory': function (input) {
            ///return nodejsUtils.newBufferFrom(input);
            return Memory.from(input);
        }
    };
    transform['arraybuffer'] = {
        'string': function (input) {
            return arrayLikeToString(new Uint8Array(input));
        },
        'array': function (input) {
            return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
        },
        'arraybuffer': identity,
        'uint8array': function (input) {
            return new Uint8Array(input);
        },
        'memory': function (input) {
            ///return nodejsUtils.newBufferFrom(new Uint8Array(input));
            return Memory.from(new Uint8Array(input));
        }
    };
    transform['uint8array'] = {
        'string': arrayLikeToString,
        'array': function (input) {
            return arrayLikeToArrayLike(input, new Array(input.length));
        },
        'arraybuffer': function (input) {
            return input.buffer;
        },
        'uint8array': identity,
        'memory': function (input) {
            ///return nodejsUtils.newBufferFrom(input);
            return Memory.from(input);
        }
    };
    transform['memory'] = {
        'string': arrayLikeToString,
        'array': function (input) {
            return arrayLikeToArrayLike(input, new Array(input.length));
        },
        'arraybuffer': function (input) {
            return transform['memory']['uint8array'](input).buffer;
        },
        'uint8array': function (input) {
            return arrayLikeToArrayLike(input, new Uint8Array(input.length));
        },
        'memory': identity
    };

    return binary.transform = transform;
});

define('skylark-io-readers/_reader',[
    "skylark-langx-events",
    "skylark-langx-binary/transform",
    "./readers"
], function(events,transform,readers) {

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
            return transform('string', this.readData(size));
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
], function (readers,Uint8ArrayReader) {
    'use strict';


    var BufferReader = Uint8ArrayReader.inherit({
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
