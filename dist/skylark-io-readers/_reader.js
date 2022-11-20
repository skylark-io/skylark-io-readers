/**
 * skylark-io-readers - The skylark reader io library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx-events","./readers"],function(t,e){"use strict";var n=t.Emitter.inherit({klassName:"Reader",_construct:function(t){this.data=t,this.length=t.length,this.index=0,this.zero=0},checkOffset:function(t){this.checkIndex(this.index+t)},checkIndex:function(t){if(this.length<this.zero+t||t<0)throw new Error("End of data reached (data length = "+this.length+", asked index = "+t+"). Corrupted zip ?")},setIndex:function(t){this.checkIndex(t),this.index=t},skip:function(t){this.setIndex(this.index+t)},byteAt:function(){},readInt:function(t){var e,n=0;for(this.checkOffset(t),e=this.index+t-1;e>=this.index;e--)n=(n<<8)+this.byteAt(e);return this.index+=t,n},readString:function(t){return utils.transformTo("string",this.readData(t))},readData:function(){},lastIndexOfSignature:function(){},readAndCheckSignature:function(){},readDate:function(){var t=this.readInt(4);return new Date(Date.UTC(1980+(t>>25&127),(t>>21&15)-1,t>>16&31,t>>11&31,t>>5&63,(31&t)<<1))}});return e.Reader=n});
//# sourceMappingURL=sourcemaps/_reader.js.map
