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

## Authors

- [@jesse](https://github.com/jesse)
- GIF decoder borrowed from [@deanm](https://github.com/deanm)'s [omggif](https://github.com/deanm/omggif/blob/master/omggif.js) plugin
- Base64 encoder borrowed from [n1k0](https://github.com/n1k0) via [http://stackoverflow.com/a/7372816](http://stackoverflow.com/a/7372816)

## Contribute

This is an active project and we encourage contributions. [Please review our guidelines and code of conduct before contributing.](https://github.com/voxmedia/open-source-contribution-guidelines)

## License 

Copyright (c) 2014, Vox Media, Inc.
All rights reserved.

BSD license

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

