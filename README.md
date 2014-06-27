fig
===
Fig is a jQuery plugin that downloads only the first frame of an animated GIF, shows it as a static image, and plays the entire animation on mouse hover. Downloading only the first frame reduces the initial payload and makes pages load faster.

Usage
====
All GIFs on page must have a "data-src" attribute with the source URL. Do not include an actual "src" or else the browser will download the entire file, thus defeating the purpose of this plugin.
```
<img data-src="some.gif"/>
```

Run the plugin:
```
$('img[data-src]').fig();
```

You can pass in options to change the overlay colors and text:
```
$('img[data-src]').fig({
  overlayTextColor: "#ff0000",
  overlayBackgroundColor: "#ffffff",
  overlayText: "Play"
});
```

Demo
====
A Sinatra-based demo app has been included.
- Run 'bundle install'
- Run app with 'bundle exec ruby app.rb'
- Visit http://0.0.0.0:4567 or http://0.0.0.0:4567/more?enabled=1

Caveats
====
- Images must be served from the same domain or have CORS headers
- Probably will not work on older versions of IE

Credits
====
GIF decoder borrowed from https://github.com/deanm/omggif/blob/master/omggif.js and modified slightly.
