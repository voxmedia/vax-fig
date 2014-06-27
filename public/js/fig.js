/*

Fig is a jQuery plugin that downloads only the first frame of an animated GIF,
shows it as a static image, and plays the entire animation on mouse hover.
Downloading only the first frame reduces the initial payload and makes pages load faster.

By Jesse Young

Usage:

  1. All GIFs on page must have a "data-src" attribute with the source URL. Do not include
     an actual "src" or else the browser will download the entire file, thus defeating
     the purpose of this plugin.

      <img data-src="some.gif"/>

  2. Run the plugin:

      $('img[data-src]').fig();

  3. Pass in options to change the overlay colors and text:

      $('img[data-src]').fig({
        overlayTextColor: "#ff0000",
        overlayBackgroundColor: "#ffffff",
        overlayText: "Play"
      });

How it works:

  1. For each GIF, send a range request from 0-25,000 bytes to the image URL.
  2. Decode the returned binary data with Javascript using web workers. This offloads
     the processing to the OS-level thread instead of browser UI thread for better performance.
  3. Scan through the decoded data for the sub-block where the first frame terminates.
  4. If the sub-block is not found, make another range request for the next 25 kilobytes and repeat step 2.
  5. Keep scanning until the sub-block is found, or stop if we've made more than 4 range requests.
  6. When the sub-block is found, there is now enough data to render the first frame.
  7. Base64 encode the first frame and set the image's "src" attribute to the encoded string a'la data URI.

Caveats:
  - Images must be served from the same domain or have CORS headers
  - Probably will not work on older versions of IE
  
*/

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
