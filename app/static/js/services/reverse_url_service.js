'use strict';
// original code: http://plnkr.co/edit/ykOTOF?p=preview

app.factory('reverseUrlService', function ($route, $cacheFactory, $exceptionHandler) {
    // Create a cache to memorize results
    var cache = $cacheFactory("reverseUrlServiceCache");

    // Function to create the key used in cache
    function makeKey(name, mapping, options) {
        var important = angular.copy(options),
            hash = name;
        if (mapping) {
            hash += angular.toJson(mapping);
        }
        // Hash does not affect result
        if (important) {
            delete important["hashed"];
            delete important["fresh"];

            hash += angular.toJson(important);
        }
        return hash;
    }

    // Actual search
    function search(name, mapping, options) {
        // Hash default to true, property defaults to name
        var property = options.property ? options.property : "name",
            url;

        // Go through the routes, attempt to find the correct one
        for (var key in $route.routes) {
            var obj = $route.routes[key];
            if (obj[property] == name) {
                url = key;
                break;
            }
        }

        if (!url) {
            $exceptionHandler("NoMatchingUrl", "No url was found matching the name " + name);
        }

        // TODO: Surely we can do a single regexp?
        // Map mapping keys to values
        angular.forEach(mapping, function (value, key) {
            var reg = new RegExp(":" + key, "g");
            // Strict means that extra mappings will invalidate the search
            if (options.strict && !reg.test(url)) {
                $exceptionHandler("InvalidMapping", "No corresponding match found for " + key);
                return reg.test(value);
            }
            url = url.replace(reg, value);
        });
        return url;
    }

    return {
        reverse: function (name, mapping, options) {
            options = options || {};
            var url,
                key = makeKey(name, mapping, options),
                hashed = options.hashed !== false,
                cached;

            if (!options.fresh) {
                cached = cache.get(key);
            }
            // Is the result already in cache?
            if (cached) {
                url = cached;
            } else {
                url = search(name, mapping, options);
                if (url) {
                    cache.put(key, url);
                }
            }
            return (hashed ? "#" : "") + url;
        }
    };
});
