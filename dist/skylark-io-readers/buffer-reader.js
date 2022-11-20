/**
 * skylark-io-readers - The skylark reader io library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./readers","./uint8-array-reader"],function(e,r){"use strict";var i=ArrayReader.inherit({klassName:"BufferReader",readData:function(e){this.checkOffset(e);var r=this.data.slice(this.zero+this.index,this.zero+this.index+e);return this.index+=e,r}});return e.BufferReader=i});
//# sourceMappingURL=sourcemaps/buffer-reader.js.map
