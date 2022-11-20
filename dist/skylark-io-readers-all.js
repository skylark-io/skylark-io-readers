/**
 * skylark-io-readers - The skylark reader io library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
!function(n,r){var t=r.define,require=r.require,e="function"==typeof t&&t.amd,a=!e&&"undefined"!=typeof exports;if(!e&&!t){var i={};t=r.define=function(n,r,t){"function"==typeof t?(i[n]={factory:t,deps:r.map(function(r){return function(n,r){if("."!==n[0])return n;var t=r.split("/"),e=n.split("/");t.pop();for(var a=0;a<e.length;a++)"."!=e[a]&&(".."==e[a]?t.pop():t.push(e[a]));return t.join("/")}(r,n)}),resolved:!1,exports:null},require(n)):i[n]={factory:null,resolved:!0,exports:t}},require=r.require=function(n){if(!i.hasOwnProperty(n))throw new Error("Module "+n+" has not been defined");var module=i[n];if(!module.resolved){var t=[];module.deps.forEach(function(n){t.push(require(n))}),module.exports=module.factory.apply(r,t)||null,module.resolved=!0}return module.exports}}if(!t)throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");if(function(n,require){n("skylark-langx-ns/_attach",[],function(){return function(n,r,t){"string"==typeof r&&(r=r.split("."));for(var e=r.length,a=n,i=0,s=r[i++];i<e;)a=a[s]=a[s]||{},s=r[i++];if(a[s]){if(t)throw new Error("This namespace already exists:"+r)}else a[s]=t||{};return a[s]}}),n("skylark-langx-ns/ns",["./_attach"],function(n){var r={attach:function(t,e){return n(r,t,e)}};return r}),n("skylark-langx-ns/main",["./ns"],function(n){return n}),n("skylark-langx-ns",["skylark-langx-ns/main"],function(n){return n}),n("skylark-io-readers/readers",["skylark-langx-ns"],function(n){return n.attach("io.readers")}),n("skylark-langx-events/events",["skylark-langx-ns"],function(n){return n.attach("langx.events",{})}),n("skylark-langx-types/types",["skylark-langx-ns"],function(n){var r,t=Array.isArray,e={}.toString,a=(r={},"Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(n){r["[object "+n+"]"]=n.toLowerCase()}),function(n){return null==n?String(n):r[e.call(n)]||"object"}),i=t||function(n){return object&&object.constructor===Array};function s(n){var r;for(r in n)if(null!==n[r])return!1;return!0}function o(n){return"function"==a(n)}function u(n){return n&&n.nodeType}function l(n){return"number"==typeof n}function c(n){var r=typeof n;return"function"===r||"object"===r&&!!n}function f(n){return"string"==typeof n}function y(n){return n&&n==n.window}function k(n){return"symbol"==typeof n}var h=1/0,p=1.7976931348623157e308,g=NaN,d=/^\s+|\s+$/g,x=/^[-+]0x[0-9a-f]+$/i,v=/^0b[01]+$/i,b=/^0o[0-7]+$/i,m=parseInt;function j(n){if(!n)return 0===n?n:0;if((n=w(n))===h||n===-h){var r=n<0?-1:1;return r*p}return n==n?n:0}function w(n){if("number"==typeof n)return n;if(k(n))return g;if(c(n)){var r="function"==typeof n.valueOf?n.valueOf():n;n=c(r)?r+"":r}if("string"!=typeof n)return 0===n?n:+n;n=n.replace(d,"");var t=v.test(n);return t||b.test(n)?m(n.slice(2),t?2:8):x.test(n)?g:+n}return n.attach("langx.types",{isArray:i,isArrayLike:function(n){return!f(n)&&!u(n)&&"number"==typeof n.length&&!o(n)},isBoolean:function(n){return!0===n||!1===n||"[object Boolean]"===e.call(n)},isDefined:function(n){return void 0!==n},isDocument:function(n){return null!=n&&n.nodeType==n.DOCUMENT_NODE},isElement:function(n){return!(!n||1!==n.nodeType)},isEmpty:s,isEmptyObject:s,isFunction:o,isHtmlNode:u,isNaN:function(n){return isNaN(n)},isNull:function(n){return null===n},isNumber:l,isNumeric:l,isObject:c,isPlainObject:function(n){return c(n)&&!y(n)&&Object.getPrototypeOf(n)==Object.prototype},isString:f,isSameOrigin:function(n){if(n){var r=location.protocol+"//"+location.hostname;return location.port&&(r+=":"+location.port),n.startsWith(r)}},isSymbol:k,isUndefined:function(n){return void 0===n},isWindow:y,type:a,toFinite:j,toNumber:w,toInteger:function(n){var r=j(n),t=r%1;return r==r?t?r-t:r:0}})}),n("skylark-langx-types/main",["./types"],function(n){return n}),n("skylark-langx-types",["skylark-langx-types/main"],function(n){return n}),n("skylark-langx-objects/objects",["skylark-langx-ns","skylark-langx-types"],function(n,r){return n.attach("langx.objects",{attach:n.attach})}),n("skylark-langx-objects/all-keys",["skylark-langx-types","./objects"],function(n,r){return r.allKeys=function(r){if(!n.isObject(r))return[];var t=[];for(var e in r)t.push(e);return t}}),n("skylark-langx-objects/assign",["skylark-langx-types","./objects"],function(n,r){return r.assign=Object.assign}),n("skylark-langx-objects/to-key",["skylark-langx-types","./objects"],function(n,r){const t=n.isSymbol,e=n.isString,a=1/0;return r.toKey=function(n){if(e(n)||t(n))return n;const r=`${n}`;return"0"==r&&1/n==-a?"-0":r}}),n("skylark-langx-objects/is-key",["skylark-langx-types","./objects"],function(n,r){const t=n.isSymbol,e=n.isArray,a=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,i=/^\w*$/;return r.isKey=function(n,r){if(e(n))return!1;const s=typeof n;if("number"===s||"boolean"===s||null==n||t(n))return!0;return i.test(n)||!a.test(n)||null!=r&&n in Object(r)}}),n("skylark-langx-objects/_cast_path",["skylark-langx-types","./objects","./is-key"],function(n,r,t){const e=".".charCodeAt(0),a=/\\(\\)?/g,i=RegExp("[^.[\\]]+|\\[(?:([^\"'][^[]*)|([\"'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2)\\]|(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))","g"),s=n=>{const r=[];return n.charCodeAt(0)===e&&r.push(""),n.replace(i,(n,t,e,i)=>{let s=n;e?s=i.replace(a,"$1"):t&&(s=t.trim()),r.push(s)}),r};return function(r,e){if(n.isArray(r))return r;return t(r,e)?[r]:s(r)}}),n("skylark-langx-objects/get",["skylark-langx-types","./objects","./to-key","./_cast_path"],function(n,r,t,e){return r.get=function(n,r,a){const i=null==n?void 0:function(n,r){let a=0;const i=(r=e(r,n)).length;for(;null!=n&&a<i;)n=n[t(r[a++])];return a&&a==i?n:void 0}(n,r);return void 0===i?a:i}}),n("skylark-langx-objects/base-at",["./objects","./get"],function(n,r){return n.baseAt=function(n,t){let e=-1;const a=t.length,i=new Array(a),s=null==n;for(;++e<a;)i[e]=s?void 0:r(n,t[e]);return i}}),n("skylark-langx-objects/clone",["skylark-langx-types","./objects"],function(n,r){var t=n.isPlainObject,e=n.isArray;return r.clone=function n(r,a){var i;if(void 0===r||null===r)i=r;else if(a&&r.clone)i=r.clone();else if(e(r)){i=[];for(var s=0;s<r.length;s++)i.push(n(r[s]))}else if(t(r))for(var o in i={},r)i[o]=n(r[o]);else i=r;return i}}),n("skylark-langx-objects/defaults",["./objects","./all-keys"],function(n,r){return n.defaults=(t=r,e=!0,function(n){var r=arguments.length;if(e&&(n=Object(n)),r<2||null==n)return n;for(var a=1;a<r;a++)for(var i=arguments[a],s=t(i),o=s.length,u=0;u<o;u++){var l=s[u];e&&void 0!==n[l]||(n[l]=i[l])}return n});var t,e}),n("skylark-langx-objects/each",["./objects"],function(n){return n.each=function(n,r,t){var e,a,i,s;if(n)if(void 0===(e=n.length)){for(a in n)if(n.hasOwnProperty(a)&&(s=n[a],!1===(t?r.call(s,s,a):r.call(s,a,s))))break}else for(i=0;i<e&&(s=n[i],!1!==(t?r.call(s,s,i):r.call(s,i,s)));i++);return this}}),n("skylark-langx-objects/_mixin",["skylark-langx-types","./objects"],function(n,r){var t=n.isPlainObject;return function n(r,e,a,i){for(var s in e)i&&void 0!==r[s]||(a&&t(e[s])?(t(r[s])||(r[s]={}),n(r[s],e[s],a,i)):void 0!==e[s]&&(r[s]=e[s]));return r}}),n("skylark-langx-objects/_parse_mixin_args",["skylark-langx-types","./objects"],function(n,r){var t=Array.prototype.slice,e=n.isBoolean;return function(n){var r=t.call(arguments,0),a=r.shift(),i=!1;e(r[r.length-1])&&(i=r.pop());return{target:a,sources:r,deep:i}}}),n("skylark-langx-objects/mixin",["skylark-langx-types","./objects","./_mixin","./_parse_mixin_args"],function(n,r,t,e){return r.mixin=function(){var n=e.apply(this,arguments);return n.sources.forEach(function(r){t(n.target,r,n.deep,!1)}),n.target}}),n("skylark-langx-objects/extend",["./objects","./mixin"],function(n,r){var t=Array.prototype.slice;return n.extend=function(n){var e,a=t.call(arguments,1);"boolean"==typeof n&&(e=n,n=a.shift());0==a.length&&(a=[n],n=this);return a.forEach(function(t){r(n,t,e)}),n}}),n("skylark-langx-objects/for-each",["./objects","./each"],function(n,r){return n.forEach=function(n,t){if(!n)return;n.forEach?n.forEach(t):r(n,t,!0)}}),n("skylark-langx-objects/has",["skylark-langx-types","./objects"],function(n,r){var t=Object.prototype.hasOwnProperty;return r.has=function(r,e){if(!n.isArray(e))return null!=r&&t.call(r,e);for(var a=e.length,i=0;i<a;i++){var s=e[i];if(null==r||!t.call(r,s))return!1;r=r[s]}return!!a}}),n("skylark-langx-objects/includes",["./objects"],function(n){return n.includes=function(n,r,t,e){n=isArrayLike(n)?n:values(n),t=t&&!e?toInteger(t):0;var a=n.length;t<0&&(t=nativeMax(a+t,0));return isString(n)?t<=a&&n.indexOf(r,t)>-1:!!a&&baseIndexOf(n,r,t)>-1}}),n("skylark-langx-objects/is-equal",["skylark-langx-types","./objects"],function(n,r){var t,e,a=n.isFunction,i="undefined"!=typeof Symbol?Symbol.prototype:null;return t=function(n,r,t,a){if(n===r)return 0!==n||1/n==1/r;if(null==n||null==r)return!1;if(n!=n)return r!=r;var i=typeof n;return("function"===i||"object"===i||"object"==typeof r)&&e(n,r,t,a)},e=function(n,r,e,s){var o=toString.call(n);if(o!==toString.call(r))return!1;switch(o){case"[object RegExp]":case"[object String]":return""+n==""+r;case"[object Number]":return+n!=+n?+r!=+r:0==+n?1/+n==1/r:+n==+r;case"[object Date]":case"[object Boolean]":return+n==+r;case"[object Symbol]":return i.valueOf.call(n)===i.valueOf.call(r)}var u="[object Array]"===o;if(!u){if("object"!=typeof n||"object"!=typeof r)return!1;var l=n.constructor,c=r.constructor;if(l!==c&&!(a(l)&&l instanceof l&&a(c)&&c instanceof c)&&"constructor"in n&&"constructor"in r)return!1}e=e||[],s=s||[];for(var f=e.length;f--;)if(e[f]===n)return s[f]===r;if(e.push(n),s.push(r),u){if((f=n.length)!==r.length)return!1;for(;f--;)if(!t(n[f],r[f],e,s))return!1}else{var y,k=Object.keys(n);if(f=k.length,Object.keys(r).length!==f)return!1;for(;f--;)if(y=k[f],void 0===r[y]||!t(n[y],r[y],e,s))return!1}return e.pop(),s.pop(),!0},r.isEqual=function(n,r){return t(n,r)}}),n("skylark-langx-objects/keys",["skylark-langx-types","./objects","./has"],function(n,r,t){return r.keys=function(r){if(!n.isObject(r))return[];var e=[];for(var a in r)t(r,a)&&e.push(a);return e}}),n("skylark-langx-objects/is-match",["skylark-langx-types","./objects","./keys"],function(n,r,t){return r.isMatch=function(n,r){var t=t(r),e=t.length;if(null==n)return!e;for(var a=Object(n),i=0;i<e;i++){var s=t[i];if(r[s]!==a[s]||!(s in a))return!1}return!0}}),n("skylark-langx-objects/omit",["./objects","./mixin"],function(n,r){return n.omit=function(n,t,e){if(!n)return null;for(var a=r({},n),i=1;i<arguments.length;i++){var s=arguments[i];s in n&&delete a[s]}return a}}),n("skylark-langx-objects/pick",["./objects"],function(n){return n.pick=function(n,r,t){if(!n)return null;for(var e={},a=1;a<arguments.length;a++){var i=arguments[a];i in n&&(e[i]=n[i])}return e}}),n("skylark-langx-objects/remove-items",["skylark-langx-types","./objects"],function(n,r){return r.removeItem=function(r,t){if(n.isArray(r)){var e=r.indexOf(t);-1!=e&&r.splice(e,1)}else if(n.isPlainObject(r))for(var a in r)if(r[a]==t){delete r[a];break}return this}}),n("skylark-langx-objects/result",["skylark-langx-types","./objects","./to-key","./_cast_path"],function(n,r,t,e){n.isArray;var a=n.isFunction;return r.result=function(n,r,i){let s=-1,o=(r=e(r,n)).length;o||(o=1,n=void 0);for(;++s<o;){let e=null==n?void 0:n[t(r[s])];void 0===e&&(s=o,e=i),n=a(e)?e.call(n):e}return n}}),n("skylark-langx-objects/safe-mixin",["./objects","./_mixin","./_parse_mixin_args"],function(n,r,t){return n.safeMixin=function(){var n=t.apply(this,arguments);return n.sources.forEach(function(t){r(n.target,t,n.deep,!0)}),n.target}}),n("skylark-langx-objects/scall",["./objects"],function(n){const r=Array.prototype.slice;return n.scall=function(n,t,e,a){if(n&&n[t]){var i=r.call(arguments,2);return n[t].apply(n,i)}}}),n("skylark-langx-objects/is-index",["skylark-langx-types","./objects"],function(n,r){const t=9007199254740991,e=/^(?:0|[1-9]\d*)$/;return r.isIndex=function(n,r){const a=typeof n;return!!(r=null==r?t:r)&&("number"===a||"symbol"!==a&&e.test(n))&&n>-1&&n%1==0&&n<r}}),n("skylark-langx-objects/set",["skylark-langx-types","./objects","./_cast_path","./is-index","./to-key"],function(n,r,t,e,a){return r.set=function(r,i,s){return null==r?r:function(r,i,s,o){if(!n.isObject(r))return r;const u=(i=t(i,r)).length,l=u-1;let c=-1,f=r;for(;null!=f&&++c<u;){const r=a(i[c]);let t=s;if(c!=l){const a=f[r];void 0===(t=o?o(a,r,f):void 0)&&(t=n.isObject(a)?a:e(i[c+1])?[]:{})}f[r]=t,f=f[r]}return r}(r,i,s)}}),n("skylark-langx-objects/shadow",["./objects"],function(n){return n.shadow=function(n,r,t){return Object.defineProperty(n,r,{value:t,enumerable:!0,configurable:!0,writable:!1}),t}}),n("skylark-langx-objects/unset",["skylark-langx-types","./objects","./set"],function(n,r,t){return r.unset=function(n,r){return null==n||t(n,r,void 0)}}),n("skylark-langx-objects/values",["skylark-langx-types","./objects","./all-keys"],function(n,r,t){return r.values=function(n){for(var r=t(n),e=r.length,a=Array(e),i=0;i<e;i++)a[i]=n[r[i]];return a}}),n("skylark-langx-objects/main",["./objects","./all-keys","./assign","./base-at","./clone","./defaults","./each","./extend","./for-each","./get","./has","./includes","./is-equal","./is-key","./is-match","./keys","./mixin","./omit","./pick","./remove-items","./result","./safe-mixin","./scall","./set","./shadow","./to-key","./unset","./values"],function(n){return n}),n("skylark-langx-objects",["skylark-langx-objects/main"],function(n){return n}),n("skylark-langx-funcs/funcs",["skylark-langx-ns"],function(n,r,t){return n.attach("langx.funcs",{noop:function(){},returnTrue:function(){return!0},returnFalse:function(){return!1}})}),n("skylark-langx-funcs/rest-arguments",["./funcs"],function(n){return n.restArguments=function(n,r){return r=null==r?n.length-1:+r,function(){for(var t=Math.max(arguments.length-r,0),e=Array(t),a=0;a<t;a++)e[a]=arguments[a+r];switch(r){case 0:return n.call(this,e);case 1:return n.call(this,arguments[0],e);case 2:return n.call(this,arguments[0],arguments[1],e)}var i=Array(r+1);for(a=0;a<r;a++)i[a]=arguments[a];return i[r]=e,n.apply(this,i)}}}),n("skylark-langx-funcs/bind-all",["./funcs","./rest-arguments"],function(n,r){return n.bindAll=r(function(n,r){var t=r.length;if(t<1)throw new Error("bindAll must be passed function names");for(;t--;){var e=r[t];n[e]=n[e].bind(n)}})}),n("skylark-langx-funcs/defer",["skylark-langx-types","./funcs"],function(n,r){return r.defer=function(r,t,e,a){var i={cancel:null},s=r;n.isNumber(t)||n.isFunction(t)||(a=e,e=t,t=0);e&&(s=function(){r.apply(a,e)});if(n.isFunction(t)){var o=!1;t(function(){o||s()}),i.cancel=function(){o=!0}}else{var u;0==t&&requestAnimationFrame?(u=requestAnimationFrame(s),i.cancel=function(){return cancelAnimationFrame(u)}):(u=setTimeout(s,t),i.cancel=function(){return clearTimeout(u)})}return i}}),n("skylark-langx-funcs/debounce",["./funcs","./defer"],function(n,r){return n.debounce=function(n,t,e){var a,i,s=function(){var s=this,u=arguments;return o(),a=setTimeout(function(){a=null,e?i=r(n,u,s):n.apply(s,u)},t),{cancel:o}},o=s.cancel=function(){a&&clearTimeout(a),i&&i.cancel(),a=void 0,i=void 0};return s}}),n("skylark-langx-funcs/delegate",["skylark-langx-objects","./funcs"],function(n,r){var t=n.mixin,e=function(){function n(){}return function(r,e){n.prototype=r;var a=new n;return n.prototype=null,e&&t(a,e),a}}();return r.delegate=e}),n("skylark-langx-funcs/loop",["./funcs"],function(n){function r(n){this.callback=n,this.running=!1,this.id=-1}return r.prototype.start=function(){if(!this.running){this.running=!0;var n=this;!function r(){n.callback();n.running&&(n.id=requestAnimationFrame(r))}()}},r.prototype.stop=function(){this.running=!1,cancelAnimationFrame(this.id)},n.loop=function(n){return new r(n)}}),n("skylark-langx-funcs/negate",["./funcs"],function(n){return n.negate=function(n){if("function"!=typeof n)throw new TypeError("Expected a function");return function(...r){return!n.apply(this,r)}}}),n("skylark-langx-funcs/proxy",["skylark-langx-types","./funcs"],function(n,r){var t=Array.prototype.slice,e=n.isFunction,a=n.isString;return r.bind=r.proxy=function n(r,i){var s=2 in arguments&&t.call(arguments,2);if(e(r)){return function(){return r.apply(i,s?s.concat(t.call(arguments)):arguments)}}if(a(i))return s?(s.unshift(r[i],r),n.apply(null,s)):n(r[i],r);throw new TypeError("expected function")}}),n("skylark-langx-funcs/template",["skylark-langx-objects","./funcs","./proxy"],function(n,r,t){Array.prototype.slice;var e={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g},a=/(.)^/,i={"'":"'","\\":"\\","\r":"r","\n":"n","\t":"t","\u2028":"u2028","\u2029":"u2029"},s=/\\|'|\r|\n|\t|\u2028|\u2029/g;function o(r,o,u){var l;u=n.defaults({},u,e);var c=RegExp([(u.escape||a).source,(u.interpolate||a).source,(u.evaluate||a).source].join("|")+"|$","g"),f=0,y="__p+='";r.replace(c,function(n,t,e,a,o){return y+=r.slice(f,o).replace(s,function(n){return"\\"+i[n]}),t&&(y+="'+\n((__t=("+t+"))==null?'':_.escape(__t))+\n'"),e&&(y+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),a&&(y+="';\n"+a+"\n__p+='"),f=o+n.length,n}),y+="';\n",u.variable||(y="with(obj||{}){\n"+y+"}\n"),y="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+y+"return __p;\n";try{l=new Function(u.variable||"obj","_",y)}catch(n){throw n.source=y,n}if(o)return l(o,this);var k=t(function(n){return l.call(this,n,this)},this),h=u.variable||"obj";return k.source="function("+h+"){\n"+y+"}",k}return o.templateSettings=r.templateSettings=e,r.template=o}),n("skylark-langx-funcs/throttle",["./funcs"],function(n){return n.throttle=function(n,r){let t=window.performance.now();return function(...e){const a=window.performance.now();a-t>=r&&(n(...e),t=a)}}}),n("skylark-langx-funcs/main",["./funcs","./bind-all","./debounce","./defer","./delegate","./loop","./negate","./proxy","./rest-arguments","./template","./throttle"],function(n){return n}),n("skylark-langx-funcs",["skylark-langx-funcs/main"],function(n){return n}),n("skylark-langx-constructs/constructs",["skylark-langx-ns"],function(n){return n.attach("langx.constructs",{})}),n("skylark-langx-constructs/inherit",["./constructs"],function(n){return n.inherit=function(n,r){if("function"!=typeof r&&r)throw new TypeError("Super expression must either be null or a function");n.prototype=Object.create(r&&r.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),r&&Object.setPrototypeOf(n,r)}}),n("skylark-langx-arrays/arrays",["skylark-langx-ns"],function(n){return n.attach("langx.arrays")}),n("skylark-langx-arrays/base-find-index",["./arrays"],function(n){return n.baseFindIndex=function(n,r,t,e){var a=n.length,i=t+(e?1:-1);for(;e?i--:++i<a;)if(r(n[i],i,n))return i;return-1}}),n("skylark-langx-arrays/base-indexof",["./arrays","./base-find-index"],function(n,r){function t(n){return n!=n}return n.baseIndexOf=function(n,e,a){if(e!=e)return r(n,t,a);var i=a-1,s=n.length;for(;++i<s;)if(n[i]===e)return i;return-1}}),n("skylark-langx-arrays/filter",["./arrays"],function(n){var r=Array.prototype.filter;return n.filter=function(n,t){return r.call(n,t)}}),n("skylark-langx-arrays/compact",["./arrays","./filter"],function(n,r){return n.compact=function(n){return r(n,function(n){return null!=n})}}),n("skylark-langx-arrays/in-array",["./arrays"],function(n){return n.inArray=function(n,r){if(!r)return-1;var t;if(r.indexOf)return r.indexOf(n);t=r.length;for(;t--;)if(r[t]===n)return t;return-1}}),n("skylark-langx-arrays/contains",["./arrays","./in-array"],function(n,r){return n.contains=function(n,t){return r(t,n)}}),n("skylark-langx-arrays/flatten",["skylark-langx-types","./arrays"],function(n,r){return r.flatten=function(r){if(n.isArrayLike(r)){for(var t=[],e=0;e<r.length;e++){var a=r[e];if(n.isArrayLike(a))for(var i=0;i<a.length;i++)t.push(a[i]);else t.push(a)}return t}return r}}),n("skylark-langx-arrays/difference",["skylark-langx-funcs","./arrays","./flatten","./filter","./contains"],function(n,r,t,e,a){var i=n.restArguments(function(n,r){return r=t(r,!0,!0),e(n,function(n){return!a(r,n)})});return r.difference=i}),n("skylark-langx-arrays/find",["./arrays"],function(n){var r=Array.prototype.find;return n.find=function(n,t){return r.call(n,t)}}),n("skylark-langx-arrays/first",["./arrays"],function(n){return n.first=function(n,r){return r?n.slice(0,r):n[0]}}),n("skylark-langx-arrays/grep",["skylark-langx-objects","./arrays"],function(n,r){return r.grep=function(r,t){var e=[];return n.each(r,function(n,r){t(r,n)&&e.push(r)}),e}}),n("skylark-langx-arrays/indexof",["./arrays"],function(n){return n.indexOf=function(n,r){return n.indexOf(r)}}),n("skylark-langx-arrays/last",["./arrays"],function(n){return n.last=function(n){return n[n.length-1]}}),n("skylark-langx-arrays/make-array",["skylark-langx-types","./arrays"],function(n,r){return r.makeArray=function(r,t,e){if(n.isArrayLike(r))return(e||[]).concat(Array.prototype.slice.call(r,t||0));return[r]}}),n("skylark-langx-arrays/map",["skylark-langx-types","./arrays","./flatten"],function(n,r,t){return r.map=function(r,e){var a,i,s,o=[];if(n.isArrayLike(r))for(i=0;i<r.length;i++)null!=(a=e.call(r[i],r[i],i))&&o.push(a);else for(s in r)null!=(a=e.call(r[s],r[s],s))&&o.push(a);return t(o)}}),n("skylark-langx-arrays/merge",["./arrays"],function(n){return n.merge=function(n,r){var t=r.length,e=n.length,a=0;if("number"==typeof t)for(;a<t;a++)n[e++]=r[a];else for(;void 0!==r[a];)n[e++]=r[a++];return n.length=e,n}}),n("skylark-langx-arrays/pull-at",["skylark-langx-types","skylark-langx-objects","./arrays"],function(n,r,t){return t.pullAt=function(n,...t){null==n||n.length;const e=r.baseAt(n,t);t.sort(function(n,r){return n-r});for(let r=t.length-1;r>=0;r--)n.slice(t[r],1);return e}}),n("skylark-langx-arrays/reduce",["./arrays"],function(n){return n.reduce=function(n,r,t){return Array.prototype.reduce.call(n,r,t)}}),n("skylark-langx-arrays/uniq",["./arrays","./filter"],function(n,r){return n.uniq=function(n){return r(n,function(r,t){return n.indexOf(r)==t})}}),n("skylark-langx-arrays/without",["skylark-langx-funcs","./arrays","./difference"],function(n,r,t){var e=n.restArguments(function(n,r){return t(n,r)});return r.without=e}),n("skylark-langx-arrays/main",["./arrays","./base-find-index","./base-indexof","./compact","./contains","./difference","./filter","./find","./first","./flatten","./grep","./in-array","./indexof","./last","./make-array","./map","./merge","./pull-at","./reduce","./uniq","./without"],function(n){return n}),n("skylark-langx-arrays",["skylark-langx-arrays/main"],function(n){return n}),n("skylark-langx-constructs/klass",["skylark-langx-ns","skylark-langx-types","skylark-langx-objects","skylark-langx-arrays","./constructs","./inherit"],function(n,r,t,e,a,i){var s=e.uniq,o=t.has,u=t.mixin,l=r.isArray,c=r.isDefined,f=function(){function n(){return this._construct?this._construct.apply(this,arguments):this.init?this.init.apply(this,arguments):void 0}return function t(e,a,f,y){l(a)&&(y=f,f=a,a=null),a=a||Object,c(f)&&!l(f)&&(y=f,f=!1);var k=a;f&&(f=function(n,r){var t=[];return r.forEach(function(n){if(o(n,"__mixins__"))throw new Error("nested mixins");for(var r=[];n;)r.unshift(n),n=n.superclass;t=t.concat(r)}),(t=(t=s(t)).filter(function(r){for(var t=n;t;){if(r===t)return!1;if(o(t,"__mixins__"))for(var e=t.__mixins__,a=0;a<e.length;a++)if(e[a]===r)return!1;t=t.superclass}return!0})).length>0&&t}(k,f)),f&&(k=function(n,r){for(var t=n,e=0;e<r.length;e++){var a=new Function;i(a,t),a.superclass=null,u(a.prototype,r[e].prototype),a.prototype.__mixin__=r[e],t=a}return t}(k,f));var h=e.klassName||"",p=new Function("return function "+h+"() {var inst = this, ctor = arguments.callee;if (!(inst instanceof ctor)) {inst = Object.create(ctor.prototype);}return ctor._constructor.apply(inst, arguments) || inst;}")();return i(p,k),p.superclass=a,p._constructor||(p._constructor=n),f&&(p.__mixins__=f),p.partial||(p.partial=function(n,t){return function(n,t,e){var a=n.prototype,i=n.superclass.prototype,s=e&&e.noOverrided;e&&e.overrides;for(var o in t)if("constructor"!==o){var u=t[o];"function"==typeof t[o]?a[o]=u._constructor||s||"function"!=typeof i[o]?u:function(n,r,t){return function(){var n=this.overrided;this.overrided=t;var e=r.apply(this,arguments);return this.overrided=n,e}}(0,u,i[o]):r.isPlainObject(u)&&null!==u&&u.get?Object.defineProperty(a,o,u):a[o]=u}return n}(this,n,t)}),p.inherit||(p.inherit=function(n,r,e){return t(n,this,r,e)}),p.partial(e,y),p}}();return a.klass=f}),n("skylark-langx-constructs/main",["./constructs","./inherit","./klass"],function(n){return n}),n("skylark-langx-constructs",["skylark-langx-constructs/main"],function(n){return n}),n("skylark-langx-klass/klass",["skylark-langx-ns","skylark-langx-constructs"],function(n,r){return n.attach("langx.klass",r.klass)}),n("skylark-langx-klass/main",["./klass"],function(n){return n}),n("skylark-langx-klass",["skylark-langx-klass/main"],function(n){return n}),n("skylark-langx-hoster/hoster",["skylark-langx-ns"],function(n){var r={isBrowser:!0,isNode:null,global:this,browser:null,node:null};"object"==typeof process&&process.versions&&process.versions.node&&process.versions.v8&&(r.isNode=!0,r.isBrowser=!1),r.global=function(){return"undefined"!=typeof global&&"function"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:this}();var t=null;if(Object.defineProperty(r,"document",function(){if(!t){var n="undefined"==typeof window?require("html-element"):window;t=n.document}return t}),void 0===r.global.CustomEvent&&(r.global.CustomEvent=function(n,r){this.type=n,this.props=r}),r.isBrowser){var e=function(n){n=n.toLowerCase();var r=/(chrome)[ \/]([\w.]+)/.exec(n)||/(webkit)[ \/]([\w.]+)/.exec(n)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(n)||/(msie) ([\w.]+)/.exec(n)||n.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(n)||[];return{browser:r[1]||"",version:r[2]||"0"}}(navigator.userAgent),a=r.browser={};e.browser&&(a[e.browser]=!0,a.version=e.version),a.chrome?a.webkit=!0:a.webkit&&(a.safari=!0)}return r.detects={},n.attach("langx.hoster",r)}),n("skylark-langx-hoster/detects/mobile",["../hoster"],function(n){var r=/iPhone/i,t=/iPod/i,e=/iPad/i,a=/\biOS-universal(?:.+)Mac\b/i,i=/\bAndroid(?:.+)Mobile\b/i,s=/Android/i,o=/(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,u=/Silk/i,l=/Windows Phone/i,c=/\bWindows(?:.+)ARM\b/i,f=/BlackBerry/i,y=/BB10/i,k=/Opera Mini/i,h=/\b(CriOS|Chrome)(?:.+)Mobile/i,p=/Mobile(?:.+)Firefox\b/i,g=function(n){return void 0!==n&&"MacIntel"===n.platform&&"number"==typeof n.maxTouchPoints&&n.maxTouchPoints>1&&"undefined"==typeof MSStream};return n.detects.mobile=function(n){var d={userAgent:"",platform:"",maxTouchPoints:0};n||"undefined"==typeof navigator?"string"==typeof n?d.userAgent=n:n&&n.userAgent&&(d={userAgent:n.userAgent,platform:n.platform,maxTouchPoints:n.maxTouchPoints||0}):d={userAgent:navigator.userAgent,platform:navigator.platform,maxTouchPoints:navigator.maxTouchPoints||0};var x=d.userAgent,v=x.split("[FBAN");void 0!==v[1]&&(x=v[0]);void 0!==(v=x.split("Twitter"))[1]&&(x=v[0]);var b=function(n){return function(r){return r.test(n)}}(x),m={apple:{phone:b(r)&&!b(l),ipod:b(t),tablet:!b(r)&&(b(e)||g(d))&&!b(l),universal:b(a),device:(b(r)||b(t)||b(e)||b(a)||g(d))&&!b(l)},amazon:{phone:b(o),tablet:!b(o)&&b(u),device:b(o)||b(u)},android:{phone:!b(l)&&b(o)||!b(l)&&b(i),tablet:!b(l)&&!b(o)&&!b(i)&&(b(u)||b(s)),device:!b(l)&&(b(o)||b(u)||b(i)||b(s))||b(/\bokhttp\b/i)},windows:{phone:b(l),tablet:b(c),device:b(l)||b(c)},other:{blackberry:b(f),blackberry10:b(y),opera:b(k),firefox:b(p),chrome:b(h),device:b(f)||b(y)||b(k)||b(p)||b(h)},any:!1,phone:!1,tablet:!1};return m.any=m.apple.device||m.android.device||m.windows.device||m.other.device,m.phone=m.apple.phone||m.android.phone||m.windows.phone,m.tablet=m.apple.tablet||m.android.tablet||m.windows.tablet,m}}),n("skylark-langx-hoster/is-mobile",["./hoster","./detects/mobile"],function(n,r){return void 0==n.isMobile&&(n.isMobile=r()),n.isMobile}),n("skylark-langx-hoster/main",["./hoster","./is-mobile"],function(n){return n}),n("skylark-langx-hoster",["skylark-langx-hoster/main"],function(n){return n}),n("skylark-langx-events/event",["skylark-langx-objects","skylark-langx-funcs","skylark-langx-klass","skylark-langx-hoster","./events"],function(n,r,t,e){var a={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};function i(t,e){return!e&&t.isDefaultPrevented||(e||(e=t),n.each(a,function(n,a){var i=e[n];t[n]=function(){return this[a]=r.returnTrue,i&&i.apply(e,arguments)},t[a]=r.returnFalse})),t}class s extends CustomEvent{constructor(r,t){super(r,t),n.safeMixin(this,t),i(this)}}return s.compatible=i,e.Event=s}),n("skylark-langx-events/listener",["skylark-langx-types","skylark-langx-objects","skylark-langx-arrays","skylark-langx-klass","./events","./event"],function(n,r,t,e,a,i){Array.prototype.slice;var s=t.compact,o=(n.isDefined,n.isUndefined),u=(n.isPlainObject,n.isFunction,n.isBoolean),l=n.isString,c=n.isEmptyObject,f=(r.mixin,r.safeMixin,e({listenTo:function(r,t,e,a,i){if(!r)return this;if(n.isPlainObject(t)){n.isBoolean(e)?(i=e,e=null):n.isBoolean(a)&&(i=a);var s=t;for(var c in s){var f=c.match(/^([\w:-]*)\s*(.*)$/),y=f[1],k=f[2]||e;k?this.listenTo(r,y,k,s[c],i):this.listenTo(r,y,s[c],i)}return this}u(a)?(i=a,a=e,e=null):u(e)?(i=e,a=e=null):o(a)&&(i=!1,a=e,e=null),a||(a="handleEvent"),l(a)&&(a=this[a]);var h=this.ensureListenedEmitter(r);i?e?h.one(t,e,a,this):h.one(t,a,this):e?h.on(t,e,a,this):h.on(t,a,this);for(var p,g=this._listeningTo||(this._listeningTo=[]),d=0;d<g.length;d++)if(g[d].obj==r){p=g[d];break}p||g.push(p={obj:r,events:{}});var x=p.events,v=x[t]=x[t]||[];return-1==v.indexOf(a)&&v.push(a),this},listenToOnce:function(n,r,t,e){return this.listenTo(n,r,t,e,1)},unlistenTo:function(n,r,t){var e=this._listeningTo;if(!e)return this;l(t)&&(t=this[t]);for(var a=0;a<e.length;a++){var i=e[a];if(!n||n==i.obj){var o=i.events;for(var u in o)if(!r||r==u){var f=o[u];if(f){for(var y=0;y<f.length;y++)if(!t||t==f[a]){let n=this.ensureListenedEmitter(i.obj);n.off(u,f[a],this),f[a]=null}f=o[u]=s(f),c(f)&&(o[u]=null)}}c(o)&&(e[a]=null)}}return e=this._listeningTo=s(e),c(e)&&(this._listeningTo=null),this},ensureListenedEmitter:function(n){return n}}));return a.Listener=f}),n("skylark-langx-events/emitter",["skylark-langx-types","skylark-langx-objects","skylark-langx-arrays","skylark-langx-klass","./events","./event","./listener"],function(n,r,t,e,a,i,s){var o=Array.prototype.slice,u=t.compact,l=n.isDefined,c=n.isPlainObject,f=n.isFunction,y=n.isString,k=(n.isEmptyObject,r.mixin);r.safeMixin;function h(n){var r=(""+n).split(".");return{name:r[0],ns:r.slice(1).join(" ")}}var p=new Map,g=s.inherit({_prepareArgs:function(n,r){return r=l(r)?[n].concat(r):[n]},on:function(n,r,t,e,a,i){var s=this,o=this._hub||(this._hub={});if(c(n))return a=e,each(n,function(n,e){s.on(n,r,t,e,a,i)}),this;if(y(r)||f(e)||(a=e,e=t,t=r,r=void 0),f(t)&&(a=e,e=t,t=null),!e)throw new Error("No callback function");if(!f(e))throw new Error("The callback  is not afunction");return y(n)&&(n=n.split(/\s/)),n.forEach(function(n){var s=h(n),u=s.name,l=s.ns;(o[u]||(o[u]=[])).push({fn:e,selector:r,data:t,ctx:a,ns:l,one:i})}),this},one:function(n,r,t,e,a){return this.on(n,r,t,e,a,1)},emit:function(n){if(!this._hub)return this;var r=this;y(n)&&(n=new i(n)),Object.defineProperty(n,"target",{value:this});var t=o.call(arguments,1);return t=this._prepareArgs(n,t),[n.type||n.name,"all"].forEach(function(e){var a=h(e),i=a.name,s=a.ns,o=r._hub[i];if(o){for(var l=o.length,f=!1,y=0;y<l;y++){if(n.isImmediatePropagationStopped&&n.isImmediatePropagationStopped())return this;var p=o[y];(!s||p.ns&&p.ns.startsWith(s))&&(p.data&&(n.data=k({},p.data,n.data)),2==t.length&&c(t[1])&&(n.data=n.data||{},k(n.data,t[1])),p.fn.apply(p.ctx,t),p.one&&(o[y]=null,f=!0))}f&&(r._hub[e]=u(o))}}),this},queueEmit:function(n){const r=n.type||n;let t=p.get(this);t||(t=new Map,p.set(this,t));const e=t.get(r);t.delete(r),window.clearTimeout(e);const a=window.setTimeout(()=>{0===t.size&&(t=null,p.delete(this)),this.trigger(n)},0);t.set(r,a)},listened:function(n){var r=(this._hub||(this._events={}))[n]||[];return r.length>0},off:function(n,r){if(n){var t=this._hub||(this._hub={});return y(n)&&(n=n.split(/\s/)),n.forEach(function(n){var e=h(n),a=e.name,i=e.ns,s=t[a];if(s){var o=[];if(r||i)for(var u=0,l=s.length;u<l;u++)r&&s[u].fn!==r&&s[u].fn._!==r?o.push(s[u]):!i||s[u].ns&&0==s[u].ns.indexOf(i)||o.push(s[u]);o.length?t[a]=o:delete t[a]}}),this}this._hub=null},trigger:function(){return this.emit.apply(this,arguments)},queueTrigger:function(n){return this.queueEmit.apply(this,arguments)}});return a.Emitter=g}),n("skylark-langx-events/create-event",["./events","./event"],function(n,r){return n.createEvent=function(n,t){return new r(n,t)}}),n("skylark-langx-events/main",["./events","./event","./listener","./emitter","./create-event"],function(n){return n}),n("skylark-langx-events",["skylark-langx-events/main"],function(n){return n}),n("skylark-io-readers/_reader",["skylark-langx-events","./readers"],function(n,r){"use strict";var t=n.Emitter.inherit({klassName:"Reader",_construct:function(n){this.data=n,this.length=n.length,this.index=0,this.zero=0},checkOffset:function(n){this.checkIndex(this.index+n)},checkIndex:function(n){if(this.length<this.zero+n||n<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+n+"). Corrupted zip ?")},setIndex:function(n){this.checkIndex(n),this.index=n},skip:function(n){this.setIndex(this.index+n)},byteAt:function(){},readInt:function(n){var r,t=0;for(this.checkOffset(n),r=this.index+n-1;r>=this.index;r--)t=(t<<8)+this.byteAt(r);return this.index+=n,t},readString:function(n){return utils.transformTo("string",this.readData(n))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var n=this.readInt(4);return new Date(Date.UTC(1980+(n>>25&127),(n>>21&15)-1,n>>16&31,n>>11&31,n>>5&63,(31&n)<<1))}});return r.Reader=t}),n("skylark-io-readers/array-reader",["./readers","./_reader"],function(n,r){"use strict";var t=r.inherit({klassName:"ArrayReader",_construct:function(n){r.prototype._construct.call(this,n);for(var t=0;t<this.data.length;t++)n[t]=255&n[t]},byteAt:function(n){return this.data[this.zero+n]},lastIndexOfSignature:function(n){for(var r=n.charCodeAt(0),t=n.charCodeAt(1),e=n.charCodeAt(2),a=n.charCodeAt(3),i=this.length-4;i>=0;--i)if(this.data[i]===r&&this.data[i+1]===t&&this.data[i+2]===e&&this.data[i+3]===a)return i-this.zero;return-1},readAndCheckSignature:function(n){var r=n.charCodeAt(0),t=n.charCodeAt(1),e=n.charCodeAt(2),a=n.charCodeAt(3),i=this.readData(4);return r===i[0]&&t===i[1]&&e===i[2]&&a===i[3]},readData:function(n){if(this.checkOffset(n),0===n)return[];var r=this.data.slice(this.zero+this.index,this.zero+this.index+n);return this.index+=n,r}});return n.ArrayReader=t}),n("skylark-io-readers/uint8-array-reader",["./readers","./array-reader"],function(n,r){"use strict";var t=r.inherit({klassName:"Uint8ArrayReader",readData:function(n){if(this.checkOffset(n),0===n)return new Uint8Array(0);var r=this.data.subarray(this.zero+this.index,this.zero+this.index+n);return this.index+=n,r}});return n.Uint8ArrayReader=t}),n("skylark-io-readers/buffer-reader",["./readers","./uint8-array-reader"],function(n,r){"use strict";var t=ArrayReader.inherit({klassName:"BufferReader",readData:function(n){this.checkOffset(n);var r=this.data.slice(this.zero+this.index,this.zero+this.index+n);return this.index+=n,r}});return n.BufferReader=t}),n("skylark-io-readers/string-reader",["./readers","./_reader"],function(n,r){"use strict";var t=r.inherit({klassName:"StringReader",byteAt:function(n){return this.data.charCodeAt(this.zero+n)},lastIndexOfSignature:function(n){return this.data.lastIndexOf(n)-this.zero},readAndCheckSignature:function(n){var r=this.readData(4);return n===r},readData:function(n){this.checkOffset(n);var r=this.data.slice(this.zero+this.index,this.zero+this.index+n);return this.index+=n,r}});return n.StringReader=t}),n("skylark-io-readers/main",["./readers","./array-reader","./buffer-reader","./string-reader","./uint8-array-reader"],function(n){return n}),n("skylark-io-readers",["skylark-io-readers/main"],function(n){return n})}(t,require),!e){var s=require("skylark-langx-ns");a?module.exports=s:r.skylarkjs=s}}(0,this);
//# sourceMappingURL=sourcemaps/skylark-io-readers-all.js.map