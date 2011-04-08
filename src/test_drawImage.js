DrawImageTest = {

  setUp: function(callback) {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = 512;
    this.canvas.height = 512;
    this.imageCanvas = document.createElement('canvas');
    this.imageCanvas.width = this.imageCanvas.height = 256;
    var c = this.imageCanvas.getContext('2d');
    c.translate(128,128);
    c.rotate(Math.PI/4);
    c.fillRect(-100,-100,100,100);
    this.image = new Image();
    this.image.onload = callback;
    this.image.src = this.imageCanvas.toDataURL('image/png');
  },

  run : function() {
    var t = this;
    this.setUp(function() {
      t.runner(); 
    });
  },
  
  runner : function() {
    var results = [];
    var composites = ['lighter', 'copy'];
    var ops = ['over', 'in', 'out', 'atop'];
    ops.forEach(function(op){
      composites.push('source-'+op, 'destination-'+op);
    });
    var img = this.image;
    var canvas = this.imageCanvas;
    var queue = [];
    for (var i in this) {
      if (/^test[A-Z_0-9]/.test(i)) {
        for (var j=0; j<composites.length; j++) {
          var c = composites[j];
          queue.push({name:[i,c,'img'].join('-'), args:[i,[c,img]]});
          queue.push({name:[i,c,'canvas'].join('-'), args:[i,[c,canvas]]});
        }
      }
    }
    var t = this;
    var tick = function() {
      if (queue.length > 0) {
        var q = queue.shift();
        var res = {name: q.name, result: t[q.args[0]].apply(t, q.args[1])};
        if (t.oncomplete) t.oncomplete(res);
        results.push(res);
        setTimeout(tick, 0);
      } else {
        t.results = results;
        if (t.onallcomplete)
          t.onallcomplete(results);
      }
    };
    setTimeout(tick, 0);
  },

  testImagePixelAligned : function(comp, img) {
    var c = this.ctx;
    c.globalCompositeOperation = comp;
    var t = BM.runForDuration(function() {
      for (var i=0; i<100; i++) {
        c.drawImage(img, i,i);
      }
      c.getImageData(100,100,1,1);
    }, 1000);
    return t;
  },

  testImageNonPixelAligned : function(comp, img) {
    var c = this.ctx;
    c.globalCompositeOperation = comp;
    var t = BM.runForDuration(function() {
      for (var i=0; i<100; i++) {
        c.drawImage(img, i*0.0017,i*0.0017);
      }
      c.getImageData(100,100,1,1);
    }, 1000);
    return t;
  },

  testImageRotated : function(comp, img) {
    var c = this.ctx;
    c.globalCompositeOperation = comp;
    var t = BM.runForDuration(function() {
      c.save();
      c.translate(256,256);
      for (var i=0; i<100; i++) {
        c.rotate(i/100);
        c.drawImage(img, 0,0);
      }
      c.restore();
      c.getImageData(100,100,1,1);
    }, 1000);
    return t;
  },

  testImageScaled : function(comp, img) {
    var c = this.ctx;
    c.globalCompositeOperation = comp;
    var t = BM.runForDuration(function() {
      c.save();
      for (var i=0; i<100; i++) {
        c.scale(1+i/33, 1+i/33);
        c.drawImage(img, 0,0);
      }
      c.restore();
      c.getImageData(100,100,1,1);
    }, 1000);
    return t;
  }

};

