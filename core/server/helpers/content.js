// # Content Helper
// Usage: `{{content count}}`, `{{content}}`, `{{content words="20"}}`, `{{content characters="256"}}`
//
// Turns content html into a safestring so that the user doesn't have to
// escape it or tell handlebars to leave it alone with a triple-brace.
//
// Enables tag-safe truncation of content by characters or words.

var hbs             = require('express-hbs'),
    _               = require('lodash'),
    downsize        = require('downsize'),
    downzero        = require('../utils/downzero'),
    content;

content = function (options) {
    
    if(options === 'count') {
        var response = "less than a minute";
        var totalWords = this.markdown.trim().split(/\s+/g).length;
        
        var wordsPerSecond = 3; //180 / 60;				
        var totalReadingTimeSeconds = totalWords / wordsPerSecond;
        
        var readingTimeMinutes = Math.round(totalReadingTimeSeconds / 60);
        
        if(readingTimeMinutes > 0){
            response = readingTimeMinutes + ' min read';
        }
        
        return response;
    }
    
    var truncateOptions = (options || {}).hash || {};
    
    truncateOptions = _.pick(truncateOptions, ['words', 'characters']);
    _.keys(truncateOptions).map(function (key) {
        truncateOptions[key] = parseInt(truncateOptions[key], 10);
    });


    if (truncateOptions.hasOwnProperty('words') || truncateOptions.hasOwnProperty('characters')) {
        // Legacy function: {{content words="0"}} should return leading tags.
        if (truncateOptions.hasOwnProperty('words') && truncateOptions.words === 0) {
            return new hbs.handlebars.SafeString(
                downzero(this.html)
            );
        }

        return new hbs.handlebars.SafeString(
            downsize(this.html, truncateOptions)
        );
    }

    return new hbs.handlebars.SafeString(this.html);
};

module.exports = content;
