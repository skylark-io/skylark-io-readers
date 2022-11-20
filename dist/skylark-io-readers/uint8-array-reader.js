/**
 * skylark-io-readers - The skylark reader io library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["./readers","./array-reader"],function(r,e){"use strict";var t=e.inherit({klassName:"Uint8ArrayReader",readData:function(r){if(this.checkOffset(r),0===r)return new Uint8Array(0);var e=this.data.subarray(this.zero+this.index,this.zero+this.index+r);return this.index+=r,e}});return r.Uint8ArrayReader=t});
//# sourceMappingURL=sourcemaps/uint8-array-reader.js.map
