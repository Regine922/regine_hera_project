import { Component } from '@angular/core';
import { NavController , ModalController , LoadingController , Platform, NavParams, ViewController , ToastController } from 'ionic-angular';
import { HereService } from '../../providers/here-service';
import { GeoService } from '../../providers/geo-service';
import { HereService0 } from '../../providers/here-service0';
import { HereService1 } from '../../providers/here-service1';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private searchQuery: string;
  dest : any;
  showInfo : boolean = false;
  alert : boolean = false;
  username : any = 'demo001';
  rescue : boolean = false;
  transport : any;
  eta : any;

  constructor(public navCtrl: NavController ,
    private params: NavParams,private modalCtrl: ModalController , private toastCtrl: ToastController,
    private hereService: HereService,
    private geoService: GeoService) {

  //    var map = "https://image.maps.cit.api.here.com/mia/1.6/mapview?app_id=xBwfcn9NW28qdu9RFAj0&app_code=4c42C6U_TT1wiVZIScQO8w"
  this.dest = {
    "name" : '',
    "time" : '',
    "distance" : '',
    "transport" : ''
  }
this.username = this.params.get('username');
//console.log(this.username);
if(this.username !== 'demo001' && this.username !== undefined ){
  this.rescue = true;
  this.alert = true;
}
  /*
  [].forEach.call(document.getElementsByClassName('bar-button'), function (el) {
    el.style.display = 'block !important';
  });
*/
}
//ionViewDidLoad
ionViewWillEnter() {
  if(this.rescue){
    this.initMap();
  }
}

initMap(){
  //document.getElementById('hereMap').style.visibility = 'visible';
  this.hereService.initializeMap('DemoAppId01082013GAL', 'AJKnXv84fjrb0KIHawS0Tg', true, true);
  let c = this;
  if(this.username === 'demo001'  ){
      document.getElementById('herePanel').style.opacity = '' + 0;
      document.getElementById('herePanel2').style.display = 'block';
  //  document.getElementById('herePanel').innerHTML = "Incoming : 2<br/>User 1 : 20 meters , ETA 5 minutes  <br/>User 2 : 35 meters , ETA 7 minutes";
  }
  document.getElementById('hereMap').innerHTML = '';
  this.hereService.createMap('hereMap');
    this.hereService.createPanel('herePanel');
  this.geoService.watchLocation().then((res: any) => {
    if (res.coords !== undefined) {
      c.hereService.moveMapToCoordinate({
        lat: res.coords.latitude,
        lng: res.coords.longitude
      },
        true,
        true);
      c.hereService.zoomMapTo(15);
      //c.hereService.calculateRoute(res.coords.latitude + ',' + res.coords.longitude, '1.27214,103.82767', 'walk');
    }
  });
  this.addMarker();

  if(this.username === 'demo001'  ){
  //  document.getElementById('herePanel').innerHTML = "Incoming : 2<br/>User 1 : 20 meters , ETA 5 minutes  <br/>User 2 : 35 meters , ETA 7 minutes";
  }
}

generateRandomCoordinate(): any {
  let cArr = [{
    lat: '1.29308',
    lng: '103.7862'
  },{
    lat: '1.29698',
    lng: '103.78229'
  },{
    lat: '1.30041',
    lng: '103.78225'
  },{
    lat: '1.30427',
    lng: '103.78156'
  },{
    lat: '1.30131',
    lng: '103.79053'
  },{
    lat: '1.29676',
    lng: '103.79353'
  }];
  return cArr[Math.floor(Math.random() * 6)];
}

addMarker(){
  let coord = this.generateRandomCoordinate();
  let myCoord = {lat:'1.2966', lng: '103.7874'};
  this.hereService.addMarker(myCoord, true);
  this.hereService.addMarker(coord, false);
  this.hereService.calculateRoute(myCoord.lat + ',' + myCoord.lng, coord.lat + ',' + coord.lng, 'walk');

}

clearMarker(){
  this.hereService.clearMap();
}

searchPlace(event: any) {
  let coord = this.generateRandomCoordinate();
  if (event.keyCode === 13) {
    this.hereService.searchPlace(this.searchQuery);
  }
}

  openModal() {
      let modal = this.modalCtrl.create(ModalContentPage,{"parent" : this});
      modal.present();
    }

    updateDestination(obj){
      this.dest = obj;
      if(obj.name != ''){
        this.showInfo = true;
      }
    }

    triggerAlert(alert){
      this.alert = alert;
      this.rescue = alert;
      if(!alert){
        this.showInfo = false;
      }else{
        this.initMap();
        //console.log(document.getElementById('hereMap'));
      }
    }

    openModalDanger() {
        let modal = this.modalCtrl.create(ModalContentDangerPage,{"parent":this});
        modal.present();
      }

      openHome(){

this.dest = {
  "name" : 'HOME',
  "time" : '7 minutes',
  "distance" : '15 km',
  "transport" : 'WALK'
}
this.showInfo = true;
        //let modal = this.modalCtrl.create(ModalContentPage,{"parent" : this , "home" : true});
        //modal.present();
      }

      updateTransportEta(transport,eta){
        this.transport = transport;
        this.eta = eta;
      }
}

@Component({
  template: `
<ion-header>
<div align='center'>
<button id='btn-close-search' ion-button (click)="dismiss()" >
  <ion-icon name="close"></ion-icon>
</button></div>
</ion-header>
<ion-content>
  <ion-list style='margin-bottom:0;'>
      <ion-item>
        <ion-label style='margin:0;'>
        <ion-icon name="search"></ion-icon>
      </ion-label>
      <ion-input type="text"
      (keyup.enter)="search($event.target.value)"  id='search-route' placeholder='Search destination' value="{{ dest || '' }}"></ion-input>
      </ion-item>　
  </ion-list>
  <label class='fav' style='font-size:12px;padding:0;margin:0;color:#b1b1b1;
  margin-left:10px;'>
  Recent</label>
  <label class='fav' style='font-size:12px;padding:0;margin:0;color:rgba(177, 177, 177, 0.51);
  margin-left:10px;border-left:1px solid #ccc;padding-left:10px;'>
  Favourites</label>
  <ion-list class='fav' inset id='fav-list'>
  <button ion-item *ngFor="let item of items" (click)="itemSelected(item)">
    {{item}} <ion-icon style='float:right;color:#676666;' ios="ios-open-outline" md="ios-open-outline"></ion-icon>
  </button>
</ion-list>

<div *ngIf="destination" >
<p style='font-size:12px;padding:0;margin:0;color:#b1b1b1;margin-left:10px;'>
Self</p>
<div class='routes'>
    <div  class='route'>
    <button ion-button outline item-end icon-left  (click)="selectTransport('walk',20)" >
     <ion-icon name="walk"></ion-icon>
     20m
   </button>
   <button ion-button outline item-end icon-left  (click)="selectTransport('bicycle',5)">
    <ion-icon name="bicycle"></ion-icon>
    5m
  </button>
  <button ion-button outline item-end icon-left  (click)="selectTransport('car',2)">
   <ion-icon name="car"></ion-icon>
   2m
 </button>
    </div>
  <div style='clear:both'></div>
</div>

<p style='font-size:12px;padding:0;margin:0;color:#b1b1b1;margin-left:10px;'>
Public transport</p>
<div class='routes'>
    <div  class='route'>
   <button ion-button outline item-end icon-left  (click)="selectTransport('bus',10)">
    <ion-icon name="bus"></ion-icon>
    10m
  </button>
  <button ion-button outline item-end icon-left  (click)="selectTransport('train',5)">
   <ion-icon name="train"></ion-icon>
   5m
 </button>
    </div>
  <div style='clear:both'></div>
</div>


<p style='font-size:12px;padding:0;margin:0;color:#b1b1b1;margin-left:10px;'>
Car service</p>
<div class='routes'>
    <div  class='route'>
    <button ion-button outline item-end icon-left  (click)="selectTransport('uber',20)" style='padding:5px !important;background:#000;color:#f5f5f5;border-color:#000;'>
     <img src='assets/images/uber.png' height='23px' width='auto' style='margin-right:5px'>
     20m
   </button>
   <button ion-button outline item-end icon-left  (click)="selectTransport('grab',19)" style='padding:5px !important'>
    <img src='assets/images/grab.png' height='23px' width='auto' style='margin-right:5px'>
    19m
  </button>
    </div>
  <div style='clear:both'></div>
</div>

<p style='
    margin: 0;
    font-size: 10px;padding-left:11px;color:rgb(72, 72, 72);'>*m = minute</p>
<br/>
</div>

<div *ngIf="route" style='background:#f7f7f7;' id='public-route'>
<p style='font-size:12px;padding:0;padding-top:20px;margin:0;color:#b1b1b1;margin-left:10px;
margin-top:1em;'>
Recommended route</p>
<ion-card (click)="updateInfo()">
  <ion-card-content>
    <ion-icon name="walk"></ion-icon> 6m
    <ion-icon ios="ios-arrow-forward" md="ios-arrow-forward"></ion-icon>
      <ion-icon name="bus"></ion-icon> <ion-badge style='background:teal;' item-end>922</ion-badge>
      <div style='float:right;'>
        <ion-badge style='background:#f53237;' item-end>36m</ion-badge>
      </div>
      <div style='clear:both'></div>
  </ion-card-content>

</ion-card>
<p style='font-size:12px;padding:0;padding-top:20px;margin:0;color:#b1b1b1;margin-left:10px;margin-top:10px;'>
Other route</p>
<ion-card (click)="updateInfo()">
  <ion-card-content>
    <ion-icon name="walk"></ion-icon> 12m
    <ion-icon ios="ios-arrow-forward" md="ios-arrow-forward"></ion-icon>
      <ion-icon name="train"></ion-icon> <ion-badge style='background:teal;' item-end>Bugis</ion-badge>
      <div style='float:right;'>
        <ion-badge style='background:#f53237;' item-end>30m</ion-badge>
      </div>
      <div style='clear:both'></div>
  </ion-card-content>

</ion-card>
</div>
</ion-content>
`
})
export class ModalContentPage {
  items: any = [];
  parent:any;
  home:boolean = false;
  dest:any;
  destination:any;
  route:boolean = false;
  tempEta:any;
  tempTransport:any;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    private loadingCtrl: LoadingController
  ) {
    let item = [
        "Blk 71",
        "USS",
        "Sentosa"
    ];
    this.items =  item;//item[this.params.get('charNum')];
    this.parent = this.params.get('parent');
    this.home = this.params.get('home');

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  itemSelected(item: string) {
  //console.log("Selected Item", item);
  this.parent.updateDestination({
    "name" : item,
    "time" : '17 minutes',
    "distance" : '10 km',
    "transport" : 'UBER'
  });
  this.dismiss();
  }

  presentLoading() {
      let loader = this.loadingCtrl.create({
        content: "Searching result",
        duration: 500
      });
      loader.present();
    }


//css , ignore
  ionViewDidLoad(){
      document.getElementsByTagName("ion-modal")[0].setAttribute("id", "dest-modal");
      if(this.home){
        this.dest = 'Home';
        [].forEach.call(document.getElementsByClassName('fav'), function (el) {
          el.style.display = 'none';
        });
        [].forEach.call(document.getElementsByClassName('public-route'), function (el) {
          el.style.display = 'none';
        });

      }
      /*
      let search = document.getElementById('search-route');
      let loading = this.loadingCtrl;
      let tempDest = '';
      search.addEventListener("change", function() {
        let loader = loading.create({
          content: "Searching result",
          duration: 300
        });
        loader.present();
        tempDest = search.value;
      });*/
  }
  search(value) {
    setTimeout(()=>{   this.destination = value; }, 310);
    let loader = this.loadingCtrl.create({
      content: "Searching result",
      duration: 300
    });
    loader.present();
  }

  selectTransport(transport,eta){
    this.parent.updateTransportEta(transport,eta);
    this.tempEta = eta;
    this.tempTransport = transport;
    if(transport === 'bus' || transport === 'train'){
      this.route = true;
    }else{
      this.updateInfo();
    }
  }

  updateInfo(){
    this.parent.updateDestination({
      "name" : this.destination,
      "time" : this.tempEta + ' minutes',
      "distance" : '10 km',
      "transport" : this.tempTransport.toUpperCase()
    });
    this.dismiss();
  }

}



@Component({
  template: `
<ion-header>

</ion-header>
<ion-content>

  <div class='' align='center' style='margin-top:5vh'>
   <div  id='panic' (click)="triggerAlertToParent()" >
   SOS
  <div style='font-size:15px;'> 00:10:13</div>
   </div>
   <small style='color:#fff'>* Hold for 3 seconds</small>
</div>
<br/>
<div id='allow-feature'>
<ion-grid style='
    max-width: 270px; '>
  <ion-row style='margin-top:-15px;'>
    <ion-col col-4>　
    <button ion-button >
    <ion-icon (click)="toggleFeature('location')" id='feature-location'
    class='active'
      ios="ios-locate" md="ios-locate"></ion-icon>
</button>
</ion-col>
  <ion-col col-4>　
    <button ion-button >
    <ion-icon (click)="toggleFeature('fb')"  id='feature-fb' class='active feature' name="logo-facebook"></ion-icon></button>
    </ion-col>
      <ion-col col-4>　
    <button ion-button >
    <ion-icon (click)="toggleFeature('sms/call')"   id='feature-sms/call' class='active feature' ios="ios-chatbubbles" md="ios-chatbubbles"></ion-icon>
</button>  </ion-col>
    </ion-row>　
</ion-grid>
<ion-grid style='
    max-width: 230px;
    margin-top: -27px;'>
  <ion-row>

    <ion-col col-6>　
      <button ion-button >
      <ion-icon (click)="toggleFeature('camera')"   id='feature-camera' class='active feature' ios="ios-camera" md="ios-camera"></ion-icon>
  </button>    </ion-col>


    <ion-col col-6>　
      <button ion-button >
      <ion-icon (click)="openModalPin()"
style='    background: rgba(47, 47, 47, 0.73);color;#f5f5f5;'
       class='feature' ios="ios-unlock-outline" md="ios-unlock-outline"></ion-icon>
  </button>    </ion-col>

  </ion-row>
</ion-grid>
<br/>

<!--
<div align='center'>
<small style='color:#fff;'>* time left</small></div>
-->


</div>
<div  *ngIf="transport"  style='background:#f7f7f7;height:110px;padding:15px 0;
position:absolute;
bottom:0;
height:35vh;
width:100%;
' id='public-route'>
<ion-card>
  <ion-card-content>
    <ion-icon name="walk"></ion-icon> 6m
    <ion-icon ios="ios-arrow-forward" md="ios-arrow-forward"></ion-icon>
      <ion-icon name="bus"></ion-icon> <ion-badge style='background:teal;' item-end>922</ion-badge>
      <div style='float:right;'>
        <ion-badge style='background:#f53237;' item-end>{{routeEta}}m</ion-badge>
      </div>
      <div style='clear:both'></div>
  </ion-card-content>

</ion-card>


</div>


<div *ngIf="!transport" id="hereM" style="
position:absolute;bottom:0;
box-shadow: 0 1px 2px rgba(0,0,0,.3) !important;
width: 100%;margin:auto; height: 35vh;position:relative;z-index:9999; background: grey"></div>


<div hidden style='position:absolute;bottom:3vh;width:100%;text-align:center'>
<div (click)="openModalPin({})" >
<ion-icon
style='font-size: 1.5em;color: rgba(247, 247, 247, 0.8);'
    ios="ios-unlock-outline" md="ios-unlock-outline"></ion-icon>
<br/>
<small style='font-size:12px;color:rgba(247, 247, 247, 0.61)'>* click to deactivate *</small>
</div>
</div>




</ion-content>
`
})
export class ModalContentDangerPage {
  items: any = [];
  parent:any;
  routeEta:any;
  transport:boolean=false;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private hereService: HereService0,
    private geoService: GeoService
  ) {
    let item = [

    ];
    this.items =  item;//item[this.params.get('charNum')];
    this.parent = this.params.get('parent');
    this.routeEta = this.parent.eta;
    if(this.parent.transport === 'bus' ){
      this.transport = true;
    }

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  ionViewDidLoad(){
      document.getElementsByTagName("ion-modal")[0].setAttribute("id", "danger-modal");
      if(!this.transport){
        this.hereService.initializeMap('DemoAppId01082013GAL', 'AJKnXv84fjrb0KIHawS0Tg', true, true);
        let c = this;
        this.hereService.createMap('hereM');
        this.geoService.watchLocation().then((res: any) => {
          if (res.coords !== undefined) {
            c.hereService.moveMapToCoordinate({
              lat: res.coords.latitude,
              lng: res.coords.longitude
            },
              false,
              false);
            c.hereService.zoomMapTo(15);
            //c.hereService.calculateRoute(res.coords.latitude + ',' + res.coords.longitude, '1.27214,103.82767', 'walk');
          }
        });
        this.addMarker();
      }
  }

  addMarker(){
    let myCoord = {lat:'1.2966', lng: '103.7874'};
    this.hereService.addMarker(myCoord, true);
  }

  toggleFeature(element){
    let feature = document.getElementById("feature-"+element);
    if(feature.classList.contains('active')){
      feature.classList.remove("active");
      this.presentToast("Deactivated " + element + " service.");
    }else{
      feature.classList.add("active");
      this.presentToast("Activated " + element + " service.");
    }
  }
  presentToast(msg) {
     let toast = this.toastCtrl.create({
       message: msg,
       duration: 1700,
       position: 'top'
     });
     toast.present();
   }

   triggerAlertToParent(){
     this.parent.triggerAlert(true);
     this.dismiss();
   }

triggerAlert(alert){
  this.parent.triggerAlert(alert);
}

   openModalPin() {
       let modal = this.modalCtrl.create(ModalContentPinPage,{ parent : this });
       modal.present();
     }

}



@Component({
  template: `
<ion-header>

</ion-header>
<ion-content  >
<ion-grid >
  <ion-row id='pins'>
    <ion-col col-3 align='center'>
      <div class='pin'></div>
    </ion-col>
      <ion-col col-3 align='center'>
        <div class='pin'></div>
      </ion-col>
        <ion-col col-3 align='center'>
          <div class='pin'></div>
        </ion-col>
          <ion-col col-3 align='center'>
            <div class='pin'></div>
          </ion-col>
    </ion-row>
    </ion-grid>



    <ion-grid id='numpad' style='padding: 0 2.5em;margin-top:10px;'>
    <ion-row >
      <ion-col col-4 align='center'>
<button ion-button icon-only class='btn-pin'  (click)="insertPin(7)">7</button>
      </ion-col>
        <ion-col col-4 align='center'>
<button ion-button icon-only class='btn-pin'  (click)="insertPin(8)">8</button>
        </ion-col>

          <ion-col col-4 align='center'>
  <button ion-button icon-only class='btn-pin'  (click)="insertPin(9)">9</button>
          </ion-col>
      </ion-row>
      <ion-row >
        <ion-col col-4 align='center'>
<button ion-button icon-only class='btn-pin' (click)="insertPin(6)">6</button>
        </ion-col>
          <ion-col col-4 align='center'>
  <button ion-button icon-only class='btn-pin' (click)="insertPin(5)">5</button>
          </ion-col>

            <ion-col col-4 align='center'>
    <button ion-button icon-only class='btn-pin' (click)="insertPin(4)">4</button>
            </ion-col>
        </ion-row>
        <ion-row >
            <ion-col col-4 align='center'>
    <button ion-button icon-only class='btn-pin' (click)="insertPin(3)">3</button>
            </ion-col>
              <ion-col col-4 align='center'>
      <button ion-button icon-only class='btn-pin' (click)="insertPin(2)">2</button>
              </ion-col>

                <ion-col col-4 align='center'>
        <button ion-button icon-only class='btn-pin' (click)="insertPin(1)">1</button>
                </ion-col>
            </ion-row>


            <ion-row >
                <ion-col col-4 align='center'>
        <button ion-button (click)="dismiss()" >
        <ion-icon ios="ios-arrow-down-outline"
        md="ios-arrow-down-outline"></ion-icon></button>
                </ion-col>
                  <ion-col col-4 align='center'>
          <button ion-button icon-only (click)="insertPin(0)">0</button>
                  </ion-col>

                    <ion-col col-4 align='center'>
            <button ion-button icon-only (click)="clear()" >
            <ion-icon name="close"></ion-icon></button>
                    </ion-col>
                </ion-row>
        </ion-grid>

</ion-content>
`
})
export class ModalContentPinPage {
  items: any = [];
  parent: any;
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController

  ) {
    let item = [

    ];
    this.items =  item;//item[this.params.get('charNum')];
    this.parent = this.params.get('parent');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  ionViewDidLoad(){
      document.getElementsByTagName("ion-modal")[1].setAttribute("id", "pin-modal");


  }
  clear(){
    let pins = document.getElementsByClassName('pin');
    let pinSize = pins.length;
    for(var i =0;i<pinSize;++i){
      pins[i].innerHTML = '';
    }
  }
  insertPin(num){
    let pins = document.getElementsByClassName('pin');
    let pinSize = pins.length;
    let isInsert = false;
    let index = 0;
    for(var i =0;i<pinSize;++i){
      let content = pins[i].innerHTML;
      if(content == ''){
        pins[i].innerHTML = '*';//num;
        isInsert = true;
        index = i;
        break;
      }
    }
    if(!isInsert || index == 3){
      this.presentToast("SOS deactivated!");
      this.parent.triggerAlert(false);
      this.dismiss();
      this.parent.dismiss();
    }
  }

  presentToast(msg) {
     let toast = this.toastCtrl.create({
       message: msg,
       duration: 1700,
       position: 'top'
     });
     toast.present();
   }

   triggerSOS(){
     this.parent.triggerAlertToParent(true);
   }
}
