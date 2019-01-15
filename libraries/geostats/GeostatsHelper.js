(function (definition) {
    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.

    // CommonJS
    if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // <script>
    } else {
        GeostatsHelper = definition();
    }

})(function () {

var GeostatsHelper = function () {
    // # [Jenks natural breaks optimization](http://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization)
    //
    // Implementations: [1](http://danieljlewis.org/files/2010/06/Jenks.pdf) (python),
    // [2](https://github.com/vvoovv/djeo-jenks/blob/master/main.js) (buggy),
    // [3](https://github.com/simogeo/geostats/blob/master/lib/geostats.js#L407) (works)
    this.jenks = function (data, nClasses) {
        // Compute the matrices required for Jenks breaks. These matrices
        // can be used for any classing of data with `classes <= nClasses`
        function getMatrices (data, nClasses) {
            // in the original implementation, these matrices are referred to
            // as `LC` and `OP`
            //
            // * lowerClassLimits (LC): optimal lower class limits
            // * varianceCombinations (OP): optimal variance combinations for all classes
            var lowerClassLimits = [];
            var varianceCombinations = [];
            // loop counters
            var i;
            var j;
            // the variance, as computed at each step in the calculation
            var variance = 0;

            // Initialize and fill each matrix with zeroes
            for (i = 0; i < data.length + 1; i++) {
                var tmp1 = [];
                var tmp2 = [];
                for (j = 0; j < nClasses + 1; j++) {
                    tmp1.push(0);
                    tmp2.push(0);
                }
                lowerClassLimits.push(tmp1);
                varianceCombinations.push(tmp2);
            }

            for (i = 1; i < nClasses + 1; i++) {
                lowerClassLimits[1][i] = 1;
                varianceCombinations[1][i] = 0;
                // in the original implementation, 9999999 is used but
                // since Javascript has `Infinity`, we use that.
                for (j = 2; j < data.length + 1; j++) {
                    varianceCombinations[j][i] = Infinity;
                }
            }

            for (var l = 2; l < data.length + 1; l++) {
                // `SZ` originally. this is the sum of the values seen thus
                // far when calculating variance.
                var sum = 0;
                // `ZSQ` originally. the sum of squares of values seen
                // thus far
                var sumSquares = 0;
                // `WT` originally. This is the number of
                var w = 0;
                // `IV` originally
                var i4 = 0;

                // in several instances, you could say `Math.pow(x, 2)`
                // instead of `x * x`, but this is slower in some browsers
                // introduces an unnecessary concept.
                for (var m = 1; m < l + 1; m++) {
                    // `III` originally
                    var lowerClassLimit = l - m + 1;
                    var val = data[lowerClassLimit - 1];

                    // here we're estimating variance for each potential classing
                    // of the data, for each potential number of classes. `w`
                    // is the number of data points considered so far.
                    w++;

                    // increase the current sum and sum-of-squares
                    sum += val;
                    sumSquares += val * val;

                    // the variance at this point in the sequence is the difference
                    // between the sum of squares and the total x 2, over the number
                    // of samples.
                    variance = sumSquares - (sum * sum) / w;

                    i4 = lowerClassLimit - 1;

                    if (i4 !== 0) {
                        for (j = 2; j < nClasses + 1; j++) {
                            // if adding this element to an existing class
                            // will increase its variance beyond the limit, break
                            // the class at this point, setting the lowerClassLimit
                            // at this point.
                            if (varianceCombinations[l][j] >=
                                (variance + varianceCombinations[i4][j - 1])) {
                                lowerClassLimits[l][j] = lowerClassLimit;
                                varianceCombinations[l][j] = variance +
                                    varianceCombinations[i4][j - 1];
                            }
                        }
                    }
                }

                lowerClassLimits[l][1] = 1;
                varianceCombinations[l][1] = variance;
            }

            // return the two matrices. for just providing breaks, only
            // `lowerClassLimits` is needed, but variances can be useful to
            // evaluage goodness of fit.
            return {
                lowerClassLimits: lowerClassLimits,
                varianceCombinations: varianceCombinations
            };
        }

        // the second part of the jenks recipe: take the calculated matrices
        // and derive an array of n breaks.
        function breaks (data, lowerClassLimits, nClasses) {
            var k = data.length - 1;
            var kclass = [];
            var countNum = nClasses;

            // the calculation of classes will never include the upper and
            // lower bounds, so we need to explicitly set them
            kclass[nClasses] = data[data.length - 1];
            kclass[0] = data[0];

            // the lowerClassLimits matrix is used as indexes into itself
            // here: the `k` variable is reused in each iteration.
            while (countNum > 1) {
                kclass[countNum - 1] = data[lowerClassLimits[k][countNum] - 2];
                k = lowerClassLimits[k][countNum] - 1;
                countNum--;
            }

            return kclass;
        }

        if (nClasses > data.length) return null;

        // sort data in numerical order, since this is expected
        // by the matrices function
        data = data.slice().sort(function (a, b) { return a - b; });

        // get our basic matrices
        var matrices = getMatrices(data, nClasses);
        // we only need lower class limits here
        var lowerClassLimits = matrices.lowerClassLimits;

        // extract nClasses out of the computed matrices
        return breaks(data, lowerClassLimits, nClasses);
    };
    this.getJenks = this.jenks;
}
return GeostatsHelper;
});
