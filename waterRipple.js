!(function() {
  function getViewPort() {
    var img,
      height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight,
      width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth;
    height / width > 1.25
      ? (img = 'img/mobile.jpg')
      : width <= 1200
        ? (img = 'img/fish_0.jpg')
        : width > 1200 && width <= 1440
          ? (img = 'img/fish_1.jpg')
          : width > 1440 && width <= 1920
            ? (img = 'img/fish_2.jpg')
            : width > 1920 && width <= 2560
              ? (img = 'img/fish_3.jpg')
              : (img = 'img/fish_4.jpg')

    var node = new Image();
    node.src = img;
    node.onload = function () {
      start();
    };

    function start() {
      var canvas = document.getElementById('waterCanvas');
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      } else {
        canvas = document.createElement('canvas');
        canvas.id = 'waterCanvas';
        canvas.width = width;
        canvas.height = height;
        document.getElementById('ripple').appendChild(canvas);
      }
      var ctx = canvas.getContext('2d');
      var halfWidth = width >> 1;
      var halfHeight = height >> 1;
      var size = width * (height + 2) * 2; // space for 2 images (old and new), +2 to cover ripple radius <= 3
      var delay = 30; // delay is desired FPS
      var oldIdx = width;
      var newIdx = width * (height + 3); // +2 from above size calc +1 more to get to 2nd image
      var rippleRad = 3;

      var rippleMap = [];
      var lastMap = [];
      var mapIdx;

      // texture and ripple will hold the image data to be displayed
      var ripple;
      var texture;

      // Here is a neat trick so you don't have to type ctx.blah over and over again
      with (ctx) {
        fillStyle = '#F0E5E1';
        fillRect(0, 0, width, height);

        save();
        restore();
      }

      // Initialize the texture and ripple image data
      // Texture will never be changed
      // Ripple is what will be altered and displayed --> see run() function
      ctx.drawImage(node, 0, 0);
      texture = ctx.getImageData(0, 0, width, height);
      ripple = ctx.getImageData(0, 0, width, height);

      // Initialize the maps
      for (var i = 0; i < size; i++) {
        lastMap[i] = 0;
        rippleMap[i] = 0;
      }

      // -------------------------------------------------------
      // --------------------- Main Run Loop --------------
      // -------------------------------------------------------
      function run() {
        newframe();
        ctx.putImageData(ripple, 0, 0);
      }

      // -------------------------------------------------------
      // Drop something in the water at location: dx, dy
      // -------------------------------------------------------
      function dropAt(dx, dy) {
        // Make certain dx and dy are integers
        // Shifting left 0 is slightly faster than parseInt and math.* (or used to be)
        dx <<= 0;
        dy <<= 0;

        // Our ripple effect area is actually a square, not a circle
        for (var j = dy - rippleRad; j < dy + rippleRad; j++) {
          for (var k = dx - rippleRad; k < dx + rippleRad; k++) {
            rippleMap[oldIdx + j * width + k] += 512;
          }
        }
      }

      // -------------------------------------------------------
      // Create the next frame of the ripple effect
      // -------------------------------------------------------
      function newframe() {
        var i;
        var a, b;
        var data, oldData;
        var curPixel, newPixel;

        // Store indexes - old and new may be misleading/confusing
        //               - current and next is slightly more accurate
        //               - previous and current may also help in thinking
        i = oldIdx;
        oldIdx = newIdx;
        newIdx = i;

        // Initialize the looping values - each will be incremented
        i = 0;
        mapIdx = oldIdx;

        for (var y = 0; y < height; y++) {
          for (var x = 0; x < width; x++) {
            // Use rippleMap to set data value, mapIdx = oldIdx
            // Use averaged values of pixels: above, below, left and right of current
            data =
              (rippleMap[mapIdx - width] +
                rippleMap[mapIdx + width] +
                rippleMap[mapIdx - 1] +
                rippleMap[mapIdx + 1]) >>
              1; // right shift 1 is same as divide by 2

            // Subtract 'previous' value (we are about to overwrite rippleMap[newIdx+i])
            data -= rippleMap[newIdx + i];

            // Reduce value more -- for damping
            // data = data - (data / 32)
            data -= data >> 5;

            // Set new value
            rippleMap[newIdx + i] = data;

            // If data = 0 then water is flat/still,
            // If data > 0 then water has a wave
            data = 1024 - data;

            oldData = lastMap[i];
            lastMap[i] = data;

            if (oldData != data) {
              // if no change no need to alter image
              // Recall using "<< 0" forces integer value
              // Calculate pixel offsets
              a = ((((x - halfWidth) * data) / 1024) << 0) + halfWidth;
              b = ((((y - halfHeight) * data) / 1024) << 0) + halfHeight;

              // Don't go outside the image (i.e. boundary check)
              if (a >= width) a = width - 1;
              if (a < 0) a = 0;
              if (b >= height) b = height - 1;
              if (b < 0) b = 0;

              // Set indexes
              newPixel = (a + b * width) * 4;
              curPixel = i * 4;

              // Apply values
              ripple.data[curPixel] = texture.data[newPixel];
              ripple.data[curPixel + 1] = texture.data[newPixel + 1];
              ripple.data[curPixel + 2] = texture.data[newPixel + 2];
            }
            mapIdx++;
            i++;
          }
        }
      }

      // -------------------------------------------------------
      // Select random location to create drops
      // So if user is doing nothing, water still
      // gets ripples.
      // -------------------------------------------------------
      function randomDrop() {
        // Make it a little, irregular in timing
        if (Math.random() > 0.3) {
          dropAt(Math.random() * width, Math.random() * height);
        }
      }
      // -------------------------------------------------------
      // Event handler for mouse motion
      // -------------------------------------------------------
      canvas.ontouchmove = function (evt) {
        dropAt(evt.offsetX || evt.layerX, evt.offsetY || evt.layerY);
      };
      canvas.onclick = function (evt) {
        dropAt(evt.offsetX || evt.layerX, evt.offsetY || evt.layerY);
      };

      // -------------------------------------------------------
      // Begin our infinite loop
      // For user interaction and display updates
      // -------------------------------------------------------
      var si = setInterval(run, delay);

      // -------------------------------------------------------
      // Create random ripples
      // Note: this is NOT at same rate as display refresh
      // -------------------------------------------------------
      var siRandom = setInterval(randomDrop, 1250);

      function debounce(method, context) {
        clearTimeout(method.tId);
        clearInterval(si);
        clearInterval(siRandom);
        method.tId = setTimeout(function () {
          method.call(context);
        }, 500);
      }
      window.onresize = function () {
        debounce(getViewPort, window);
      }
    }
  }

  getViewPort();
})();
