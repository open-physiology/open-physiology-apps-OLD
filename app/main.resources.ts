import {bootstrap} from '@angular/platform-browser-dynamic';
import {ResourceEditor} from './editors/editor.resources';
import {DND_PROVIDERS} from 'ng2-dnd/ng2-dnd';
import {ToastyService, ToastyConfig} from 'ng2-toasty/ng2-toasty';

bootstrap(ResourceEditor, [DND_PROVIDERS, ToastyService, ToastyConfig]).catch(err => console.error(err));

