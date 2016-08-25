"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var editor_omegaTrees_1 = require('./editors/editor.omegaTrees');
var ng2_toasty_1 = require('ng2-toasty/ng2-toasty');
var ng2_dnd_1 = require('ng2-dnd/ng2-dnd');
platform_browser_dynamic_1.bootstrap(editor_omegaTrees_1.OmegaTreeEditor, [ng2_dnd_1.DND_PROVIDERS, ng2_toasty_1.ToastyService, ng2_toasty_1.ToastyConfig]).catch(function (err) { return console.error(err); });
//# sourceMappingURL=main.omegaTrees.js.map