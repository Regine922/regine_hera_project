import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage  , ModalContentPage , ModalContentDangerPage , ModalContentPinPage } from '../pages/home/home';
import { ModalContentPlacePage, ModalContentContactPage , ModalContentBillingPage} from '../pages/me/me';
import { ListPage } from '../pages/list/list';
import { CommunityPage } from '../pages/community/community';
import { MePage } from '../pages/me/me';
import { LoginPage } from '../pages/login/login';
import { NewsPage } from '../pages/news/news';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Geolocation } from '@ionic-native/geolocation';
import { GeoService } from '../providers/geo-service';
import { HereService } from '../providers/here-service';
import { HereService0 } from '../providers/here-service0';
import { HereService1 } from '../providers/here-service1';



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    CommunityPage,
    LoginPage,
    MePage,
    NewsPage,
    ModalContentPage,
    ModalContentDangerPage,
    ModalContentPinPage,
    ModalContentBillingPage,
    ModalContentContactPage,
    ModalContentPlacePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    CommunityPage,
    LoginPage,
    MePage,
    NewsPage,
    ModalContentPage,
    ModalContentDangerPage,
    ModalContentPinPage,
    ModalContentBillingPage,
    ModalContentContactPage,
    ModalContentPlacePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    GeoService,
    HereService,
    HereService0,
    HereService1,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
