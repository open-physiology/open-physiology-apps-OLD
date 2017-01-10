import {bootstrap}    from '@angular/platform-browser-dynamic';
import {CanonicalTreeEditor} from './editors/editor.canonicalTrees';
import {ToastyService, ToastyConfig} from 'ng2-toasty/ng2-toasty';
import {DND_PROVIDERS} from 'ng2-dnd/ng2-dnd';

bootstrap(CanonicalTreeEditor,
  [DND_PROVIDERS,  ToastyService, ToastyConfig]
).catch(err => console.error(err));
