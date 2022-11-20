/**
 * skylark-io-readers - The skylark reader io library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./readers","./_reader"],function(t,e){"use strict";var r=e.inherit({klassName:"StringReader",byteAt:function(t){return this.data.charCodeAt(this.zero+t)},lastIndexOfSignature:function(t){return this.data.lastIndexOf(t)-this.zero},readAndCheckSignature:function(t){return t===this.readData(4)},readData:function(t){this.checkOffset(t);var e=this.data.slice(this.zero+this.index,this.zero+this.index+t);return this.index+=t,e}});return t.StringReader=r});
//# sourceMappingURL=sourcemaps/string-reader.js.map
