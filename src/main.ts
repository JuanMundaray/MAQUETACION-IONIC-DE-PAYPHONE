import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/admin/dashboard/dashboard.component';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
