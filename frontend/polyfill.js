// Polyfill para global
if (typeof global === 'undefined') {
    window.global = window;
  }
  
  // Polyfill para process
  if (typeof process === 'undefined') {
    window.process = {
      env: { NODE_ENV: process.env.NODE_ENV || 'development' },
      browser: true,
      version: [],
      nextTick: function(fn) { setTimeout(fn, 0); }
    };
  }