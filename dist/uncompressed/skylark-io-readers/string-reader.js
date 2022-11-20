define([
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