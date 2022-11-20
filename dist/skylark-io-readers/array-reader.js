/**
 * skylark-io-readers - The skylark reader io library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./readers","./_reader"],function(t,r){"use strict";var e=r.inherit({klassName:"ArrayReader",_construct:function(t){r.prototype._construct.call(this,t);for(var e=0;e<this.data.length;e++)t[e]=255&t[e]},byteAt:function(t){return this.data[this.zero+t]},lastIndexOfSignature:function(t){for(var r=t.charCodeAt(0),e=t.charCodeAt(1),a=t.charCodeAt(2),i=t.charCodeAt(3),n=this.length-4;n>=0;--n)if(this.data[n]===r&&this.data[n+1]===e&&this.data[n+2]===a&&this.data[n+3]===i)return n-this.zero;return-1},readAndCheckSignature:function(t){var r=t.charCodeAt(0),e=t.charCodeAt(1),a=t.charCodeAt(2),i=t.charCodeAt(3),n=this.readData(4);return r===n[0]&&e===n[1]&&a===n[2]&&i===n[3]},readData:function(t){if(this.checkOffset(t),0===t)return[];var r=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,r}});return t.ArrayReader=e});
//# sourceMappingURL=sourcemaps/array-reader.js.map
