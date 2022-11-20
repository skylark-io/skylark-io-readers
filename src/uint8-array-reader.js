define([
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