fig
===

jQuery plugin that downloads only the first frame of an animated GIF

How it works
====

1. For each GIF, send a range request from 0-25,000 bytes to the image URL.
2. Decode the returned binary data with Javascript using web workers. This offloads the processing to the OS-level thread instead of browser UI thread for better performance.
3. Scan through the decoded data for the sub-block where the first frame terminates.
4. If the sub-block is not found, make another range request for the next 25 kilobytes and repeat step 2.
5. Keep scanning until the sub-block is found, or stop if we've made more than 4 range requests.
6. When the sub-block is found, there is now enough data to render the first frame.
7. Base64 encode the first frame and set the image's "src" attribute to the encoded string a'la data URI.
