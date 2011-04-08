BM = {

  time : function(f) {
    var t0 = new Date().getTime();
    f();
    var t1 = new Date().getTime();
    var elapsed = t1-t0;
    return elapsed;
  },

  runForDuration : function(f, duration) {
    var startTime = new Date().getTime();
    var t = this.time(f);
    var i = 0;
    var times = [];
    while (t<duration) {
      i++;
      var e = this.time(f);
      times.push(e);
      t = (new Date().getTime()) - startTime;
    }
    return {count:i, times:times};
  }

};

