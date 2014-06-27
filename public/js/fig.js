(function($) {
  $.fn.fig = function(options) {

    var settings = $.extend({
      'overlayBackgroundColor': 'rgba(12,16,33,0.75)',
      'overlayTextColor': '#F8F8F8',
      'overlayText': "GIF",
    }, options);

    // Cachebuster for Safari so it does not reuse the cached 206 partial response for
    // subsequent range requests
    var cb = function() {
      return "?cb="+(Math.floor(Math.random()*1000000));
    };

    var drawOverlay = function() {
      return $("<span class='label' style=\"background:"+settings.overlayBackgroundColor+"; color:"+settings.overlayTextColor+";\">"+settings.overlayText+"</span>");
    };

    // TODO: add support for IE by using XDomain object
    var _processGIF = function(url, callback) {
      var buffer = "";
      var range_start = 0
        , range_end = 100000
        , range_increment = 25000;
      var worker = new Worker("js/fig_worker.js"); // should each request have it's own worker?

      // Setup XHR request
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url+cb());
      xhr.setRequestHeader("Range", "bytes="+range_start+"-"+range_end);
    
      if(xhr.overrideMimeType) { // not supported by ie
        xhr.overrideMimeType("text/plain; charset=x-user-defined");
      }

      // Pass response to web worker for processing
      xhr.onload = function() {
        buffer += xhr.responseText;

        worker.onmessage = function(event) {
          if (event.data == -1) { // Fetch more bytes
            // Fetch more bytes
            range_start = range_end+1;
            range_end += range_increment;
            xhr.abort();
            xhr.open('GET', url+cb());
            xhr.setRequestHeader("Range", "bytes="+range_start+"-"+range_end);
            xhr.send();
          } else if (event.data == -2) { // Error occured while reading
            console.log("Error while reading image " + url);
            callback(-1);
          } else { // Preview for first frame!
            var preview = event.data;
            callback(preview);
          }
        };

        worker.postMessage({buffer:buffer, limit:range_end});
      };

      // Error while making request, so set src to URL
      xhr.onerror = function() {
        callback(-1);
      }

      xhr.send();
    };

    return this.each(function() {
      var $gif = $(this);

      _processGIF($gif.attr('data-src'), function(preview) {
        // If error loading GIF for whatever reason, set SRC to original URL
        if (preview == -1) {
          console.log("Error loading gif " + $gif.attr('data-src'));
          // This will load the entire GIF
          $gif.attr('src', $gif.attr('data-src'));
        } else {
          $gif.attr('src', preview);
        }

        var $wrapper = $gif.wrap('<span class="_play_gif"></span>').parent();
        $wrapper.append(drawOverlay());

        // Swap first frame with full GIF
        $wrapper.hover(function() {
          var src = $gif.attr('data-src');
          $gif.attr('data-src', $gif.attr('src'));
          $gif.attr('src', src);
          $wrapper.find('.label').toggleClass('hidden');
        }, function() {
          var src = $gif.attr('src')
          $gif.attr('src', $gif.attr('data-src'));
          $gif.attr('data-src', src);
          $wrapper.find('.label').toggleClass('hidden');
        })
      })
    })

  }
})(jQuery)
