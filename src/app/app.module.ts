import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
// ADF modules
import {ContentModule} from '@alfresco/adf-content-services';
import {ProcessModule} from '@alfresco/adf-process-services';
import {CoreModule, TranslateLoaderService, TRANSLATION_PROVIDER} from '@alfresco/adf-core';
// Custom stencils
import {StencilsModule} from './stencils.module';
// App components
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/login/login.component';
import {AppsComponent} from './components/apps/apps.component';
import {TasksComponent} from './components/tasks/tasks.component';
import {TaskDetailsComponent} from './components/task-details/task-details.component';
import {StartProcessComponent} from './components/start-process/start-process.component';
import {FileViewComponent} from './components/file-view/file-view.component';
import {BlobViewComponent} from './components/file-view/blob-view.component';
import {PreviewService} from './services/preview.service';

import {appRoutes} from './app.routes';
import {AppLayoutComponent} from './components/app-layout/app-layout.component';
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';

// Custom components
import {TaskListComponent} from './alfea-plugins/components/task-list/task-list.component';
import {ProcessListComponent} from './alfea-plugins/components/process-list/process-list.component';
import {DashboardComponent} from './alfea-plugins/components/dashboard/dashboard.component';

registerLocaleData(localeFr);

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      {
        // enableTracing: true, // <-- debugging purposes only
        useHash: true
      }
    ),

    // ADF modules
    CoreModule.forRoot(),
    ContentModule.forRoot(),
    ProcessModule.forRoot(),
    TranslateModule.forRoot({
      loader: {provide: TranslateLoader, useClass: TranslateLoaderService}
    }),
    StencilsModule
  ],
  declarations: [
    AppComponent,
    AppsComponent,
    HomeComponent,
    LoginComponent,
    TasksComponent,
    TaskDetailsComponent,
    StartProcessComponent,
    AppLayoutComponent,
    BlobViewComponent,
    FileViewComponent,

    // Custom components
    TaskListComponent,
    ProcessListComponent,
    DashboardComponent,
  ],
  providers: [
    PreviewService,
    {
      provide: TRANSLATION_PROVIDER,
      multi: true,
      useValue: {
        name: 'app',
        source: 'resources'
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
