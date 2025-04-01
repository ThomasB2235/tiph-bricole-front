import { bootstrapApplication } from '@angular/platform-browser';
import { ReactiveFormsModule  } from '@angular/forms';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()),
    importProvidersFrom(ReactiveFormsModule),
    provideRouter(routes)
  ]
}).catch();
