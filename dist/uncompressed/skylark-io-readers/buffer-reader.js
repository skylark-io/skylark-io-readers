define([
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