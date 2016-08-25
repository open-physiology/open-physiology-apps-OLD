System.config({
  defaultJSExtensions: true,
  transpiler: "plugin-babel",
  babelOptions: {
    "optional": [
      "runtime",
      "optimisation.modules.system"
    ]
  },
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  packages: {
    "angular2-in-memory-web-api": {
      "main": "index.js",
      "defaultExtension": "js"
    },
    'symbol-observable': { "defaultExtension": 'js', "main": 'index.js'},
    "ng2-select": {
      "main": "notify.js",
      "defaultExtension": "js"
    },
    "ng2-toasty": {
      "defaultExtension": "js"
    },
    "ng2-bootstrap": {
      "defaultExtension": "js"
    },
    "ng2-nvd3": {
      "defaultExtension": "js"
    },
    "ng2-dnd": {
      "defaultExtension": "js"
    },
    "ng2-radio-group": {
      "main": "index.js",
      "defaultExtension": "js"
    },
    "ng2-slider": {
      "main": "ng2-slider.component.min.js",
      "defaultExtension": "js"
    },
    "ng2-dropdown": {
      "main": "index.js",
      "defaultExtension": "js"
    },
    "rx": {
      "main": "index.js",
      "defaultExtension": "js"
    },
    "open-physiology-model": {
      "main": "open-physiology-model-minimal.js",
      "defaultExtension": "js"
    },
    "lyph-edit-widget": {
      "main": "index.js",
      "defaultExtension": "js"
    },
    "@angular/common": {
      "main": "common.umd.js",
      "defaultExtension": "js"
    },
    "@angular/compiler": {
      "main": "compiler.umd.js",
      "defaultExtension": "js"
    },
    "@angular/core": {
      "main": "core.umd.js",
      "defaultExtension": "js"
    },
    "@angular/http": {
      "main": "http.umd.js",
      "defaultExtension": "js"
    },
    "@angular/platform-browser": {
      "main": "platform-browser.umd.js",
      "defaultExtension": "js"
    },
    "@angular/platform-browser-dynamic": {
      "main": "platform-browser-dynamic.umd.js",
      "defaultExtension": "js"
    },
    "@angular/router": {
      "main": "router.umd.js",
      "defaultExtension": "js"
    },
    "@angular/router-deprecated": {
      "main": "router-deprecated.umd.js",
      "defaultExtension": "js"
    },
    "@angular/upgrade": {
      "main": "upgrade.umd.js",
      "defaultExtension": "js"
    }
  },

  map: {
    "@angular": "node_modules/@angular",
    "angular2-in-memory-web-api": "node_modules/angular2-in-memory-web-api",
    'symbol-observable': 'node_modules/symbol-observable',
    "babel-polyfill": "jspm_packages/npm/babel-polyfill@6.9.1/dist/polyfill.js",
    "css": "github:systemjs/plugin-css@0.1.23",
    "d3": "npm:d3@4.1.1",
    "golden-layout": "npm:golden-layout@1.5.1",
    "jquery": "npm:jquery@3.1.0",
    "ng2-bootstrap": "node_modules/ng2-bootstrap",
    "ng2-dnd": "node_modules/ng2-dnd",
    "ng2-nvd3": "node_modules/ng2-nvd3",
    "ng2-radio-group": "node_modules/ng2-radio-group",
    "ng2-select": "node_modules/ng2-select",
    "ng2-slider": "node_modules/ng2-slider-component",
    "ng2-dropdown": "node_modules/ng2-dropdown",
    "ng2-toastr": "node_modules/ng2-toastr",
    "ng2-toasty": "node_modules/ng2-toasty",
    "nvd3": "npm:nvd3@1.8.4",
    "open-physiology-model": "node_modules/open-physiology-model/dist",
    "lyph-edit-widget": "node_modules/lyph-edit-widget/dist",
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.12",
    "plugin-babel-runtime": "npm:babel-runtime@5.8.38",
    "rx": "node_modules/rx",
    "rxjs": "node_modules/rxjs",
    "systemjs-babel-build": "jspm_packages/npm/systemjs-plugin-babel@0.0.12/systemjs-babel-browser.js",
    "github:jspm/nodelibs-assert@0.1.0": {
      "assert": "npm:assert@1.4.1"
    },
    "github:jspm/nodelibs-buffer@0.1.0": {
      "buffer": "npm:buffer@3.6.0"
    },
    "github:jspm/nodelibs-events@0.1.1": {
      "events": "npm:events@1.0.2"
    },
    "github:jspm/nodelibs-http@1.7.1": {
      "Base64": "npm:Base64@0.2.1",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "stream": "github:jspm/nodelibs-stream@0.1.0",
      "url": "github:jspm/nodelibs-url@0.1.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "github:jspm/nodelibs-https@0.1.0": {
      "https-browserify": "npm:https-browserify@0.0.0"
    },
    "github:jspm/nodelibs-process@0.1.2": {
      "process": "npm:process@0.11.5"
    },
    "github:jspm/nodelibs-stream@0.1.0": {
      "stream-browserify": "npm:stream-browserify@1.0.0"
    },
    "github:jspm/nodelibs-url@0.1.0": {
      "url": "npm:url@0.10.3"
    },
    "github:jspm/nodelibs-util@0.1.0": {
      "util": "npm:util@0.10.3"
    },
    "github:jspm/nodelibs-vm@0.1.0": {
      "vm-browserify": "npm:vm-browserify@0.0.4"
    },
    "npm:assert@1.4.1": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "util": "npm:util@0.10.3"
    },
    "npm:babel-runtime@5.8.38": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:buffer@3.6.0": {
      "base64-js": "npm:base64-js@0.0.8",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "ieee754": "npm:ieee754@1.1.6",
      "isarray": "npm:isarray@1.0.0",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:core-util-is@1.0.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:d3-brush@1.0.1": {
      "d3-dispatch": "npm:d3-dispatch@1.0.0",
      "d3-drag": "npm:d3-drag@1.0.0",
      "d3-interpolate": "npm:d3-interpolate@1.1.0",
      "d3-selection": "npm:d3-selection@1.0.0",
      "d3-transition": "npm:d3-transition@1.0.0"
    },
    "npm:d3-chord@1.0.0": {
      "d3-array": "npm:d3-array@1.0.0",
      "d3-path": "npm:d3-path@1.0.0"
    },
    "npm:d3-drag@1.0.0": {
      "d3-dispatch": "npm:d3-dispatch@1.0.0",
      "d3-selection": "npm:d3-selection@1.0.0"
    },
    "npm:d3-dsv@1.0.0": {
      "rw": "npm:rw@1.3.2"
    },
    "npm:d3-force@1.0.0": {
      "d3-collection": "npm:d3-collection@1.0.0",
      "d3-dispatch": "npm:d3-dispatch@1.0.0",
      "d3-quadtree": "npm:d3-quadtree@1.0.0",
      "d3-timer": "npm:d3-timer@1.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:d3-geo@1.1.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "d3-array": "npm:d3-array@1.0.0"
    },
    "npm:d3-interpolate@1.1.0": {
      "d3-color": "npm:d3-color@1.0.0"
    },
    "npm:d3-request@1.0.1": {
      "d3-collection": "npm:d3-collection@1.0.0",
      "d3-dispatch": "npm:d3-dispatch@1.0.0",
      "d3-dsv": "npm:d3-dsv@1.0.0",
      "xmlhttprequest": "npm:xmlhttprequest@1.8.0"
    },
    "npm:d3-scale@1.0.1": {
      "d3-array": "npm:d3-array@1.0.0",
      "d3-collection": "npm:d3-collection@1.0.0",
      "d3-color": "npm:d3-color@1.0.0",
      "d3-format": "npm:d3-format@1.0.0",
      "d3-interpolate": "npm:d3-interpolate@1.1.0",
      "d3-time": "npm:d3-time@1.0.0",
      "d3-time-format": "npm:d3-time-format@2.0.0"
    },
    "npm:d3-shape@1.0.0": {
      "d3-path": "npm:d3-path@1.0.0"
    },
    "npm:d3-time-format@2.0.0": {
      "d3-time": "npm:d3-time@1.0.0"
    },
    "npm:d3-transition@1.0.0": {
      "d3-color": "npm:d3-color@1.0.0",
      "d3-dispatch": "npm:d3-dispatch@1.0.0",
      "d3-ease": "npm:d3-ease@1.0.0",
      "d3-interpolate": "npm:d3-interpolate@1.1.0",
      "d3-selection": "npm:d3-selection@1.0.0",
      "d3-timer": "npm:d3-timer@1.0.1"
    },
    "npm:d3-zoom@1.0.2": {
      "d3-dispatch": "npm:d3-dispatch@1.0.0",
      "d3-drag": "npm:d3-drag@1.0.0",
      "d3-interpolate": "npm:d3-interpolate@1.1.0",
      "d3-selection": "npm:d3-selection@1.0.0",
      "d3-transition": "npm:d3-transition@1.0.0"
    },
    "npm:d3@4.1.1": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "d3-array": "npm:d3-array@1.0.0",
      "d3-axis": "npm:d3-axis@1.0.0",
      "d3-brush": "npm:d3-brush@1.0.1",
      "d3-chord": "npm:d3-chord@1.0.0",
      "d3-collection": "npm:d3-collection@1.0.0",
      "d3-color": "npm:d3-color@1.0.0",
      "d3-dispatch": "npm:d3-dispatch@1.0.0",
      "d3-drag": "npm:d3-drag@1.0.0",
      "d3-dsv": "npm:d3-dsv@1.0.0",
      "d3-ease": "npm:d3-ease@1.0.0",
      "d3-force": "npm:d3-force@1.0.0",
      "d3-format": "npm:d3-format@1.0.0",
      "d3-geo": "npm:d3-geo@1.1.1",
      "d3-hierarchy": "npm:d3-hierarchy@1.0.0",
      "d3-interpolate": "npm:d3-interpolate@1.1.0",
      "d3-path": "npm:d3-path@1.0.0",
      "d3-polygon": "npm:d3-polygon@1.0.0",
      "d3-quadtree": "npm:d3-quadtree@1.0.0",
      "d3-queue": "npm:d3-queue@3.0.1",
      "d3-random": "npm:d3-random@1.0.0",
      "d3-request": "npm:d3-request@1.0.1",
      "d3-scale": "npm:d3-scale@1.0.1",
      "d3-selection": "npm:d3-selection@1.0.0",
      "d3-shape": "npm:d3-shape@1.0.0",
      "d3-time": "npm:d3-time@1.0.0",
      "d3-time-format": "npm:d3-time-format@2.0.0",
      "d3-timer": "npm:d3-timer@1.0.1",
      "d3-transition": "npm:d3-transition@1.0.0",
      "d3-voronoi": "npm:d3-voronoi@1.0.1",
      "d3-zoom": "npm:d3-zoom@1.0.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:golden-layout@1.5.1": {
      "jquery": "npm:jquery@3.1.0"
    },
    "npm:https-browserify@0.0.0": {
      "http": "github:jspm/nodelibs-http@1.7.1"
    },
    "npm:inherits@2.0.1": {
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:jquery@3.1.0": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:nvd3@1.8.4": {
      "d3": "npm:d3@3.5.17"
    },
    "npm:process@0.11.5": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "vm": "github:jspm/nodelibs-vm@0.1.0"
    },
    "npm:punycode@1.3.2": {
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:readable-stream@1.1.14": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "core-util-is": "npm:core-util-is@1.0.2",
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "isarray": "npm:isarray@0.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "stream-browserify": "npm:stream-browserify@1.0.0",
      "string_decoder": "npm:string_decoder@0.10.31"
    },
    "npm:rw@1.3.2": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:stream-browserify@1.0.0": {
      "events": "github:jspm/nodelibs-events@0.1.1",
      "inherits": "npm:inherits@2.0.1",
      "readable-stream": "npm:readable-stream@1.1.14"
    },
    "npm:string_decoder@0.10.31": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0"
    },
    "npm:url@0.10.3": {
      "assert": "github:jspm/nodelibs-assert@0.1.0",
      "punycode": "npm:punycode@1.3.2",
      "querystring": "npm:querystring@0.2.0",
      "util": "github:jspm/nodelibs-util@0.1.0"
    },
    "npm:util@0.10.3": {
      "inherits": "npm:inherits@2.0.1",
      "process": "github:jspm/nodelibs-process@0.1.2"
    },
    "npm:vm-browserify@0.0.4": {
      "indexof": "npm:indexof@0.0.1"
    },
    "npm:xmlhttprequest@1.8.0": {
      "buffer": "github:jspm/nodelibs-buffer@0.1.0",
      "child_process": "github:jspm/nodelibs-child_process@0.1.0",
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "http": "github:jspm/nodelibs-http@1.7.1",
      "https": "github:jspm/nodelibs-https@0.1.0",
      "process": "github:jspm/nodelibs-process@0.1.2",
      "url": "github:jspm/nodelibs-url@0.1.0"
    }
  }
});
