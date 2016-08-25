import {bootstrap} from '@angular/platform-browser-dynamic';
import {GraphEditor} from './editors/editor.graph';
import {DND_PROVIDERS} from 'ng2-dnd/ng2-dnd';
import {ToastyService, ToastyConfig} from 'ng2-toasty/ng2-toasty';

bootstrap(GraphEditor, [DND_PROVIDERS, ToastyService, ToastyConfig]).catch(err => console.error(err));

