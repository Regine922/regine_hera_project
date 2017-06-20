import { Component } from '@angular/core';
import { NavController, ModalController, Platform, NavParams, ViewController  } from 'ionic-angular';


@Component({
  selector: 'page-me',
  templateUrl: 'me.html'
})
export class MePage {

  constructor(public navCtrl: NavController, private modalCtrl: ModalController) {

  }

  openModalPlace() {
    let modal = this.modalCtrl.create(ModalContentPlacePage);
    modal.present();
  }
  openModalContact() {
    let modal = this.modalCtrl.create(ModalContentContactPage);
    modal.present();
  }
  openModalBilling() {
    let modal = this.modalCtrl.create(ModalContentBillingPage);
    modal.present();
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
  <ion-list inset id='fav-list'>
  <button ion-item *ngFor="let item of items" (click)="itemSelected(item)">
    {{item}}
  </button>
</ion-list>
</ion-content>
`
})
export class ModalContentPlacePage {
  items: any = [];
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    let item = [
      "Blk 71",
      "USS",
      "Sentosa"
    ];
    this.items = item;//item[this.params.get('charNum')];
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  //css , ignore
  ionViewDidLoad() {
    document.getElementsByTagName("ion-modal")[0].setAttribute("id", "dest-modal");
  }
}



@Component({
  template: `
<ion-header>

</ion-header>
<ion-content padding>
  <ion-item-group>
    <ion-item-divider color="light">A</ion-item-divider>
    <ion-item>
      Angela
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
    <ion-item>
      Aidan
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
  </ion-item-group>
  <ion-item-group>
    <ion-item-divider color="light">B</ion-item-divider>
    <ion-item>
      Bella
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
    <ion-item>
      Bryan
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
  </ion-item-group>
  <ion-item-group>
    <ion-item-divider color="light">C</ion-item-divider>
    <ion-item>
      Christina
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
    <ion-item>
      Christopher
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
  </ion-item-group>
  <ion-item-group>
    <ion-item-divider color="light">D</ion-item-divider>
    <ion-item>
      Dickson
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
    <ion-item>
      DingDing
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
  </ion-item-group>
  <ion-item-group>
    <ion-item-divider color="light">E</ion-item-divider>
    <ion-item>
      Elsaa
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
    <ion-item>
      Ericc
      <button ion-button clear item-end><img src="assets/images/phone.png" width="20px" height="20px"></button>
    </ion-item>
  </ion-item-group>
</ion-content>

`
})
export class ModalContentContactPage {
  items: any = [];
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    let item = [

    ];
    this.items = item;//item[this.params.get('charNum')];
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
<ion-item bill>
  <p style='font-size:50px;padding:0;margin-top:100px;color:#b1b1b1;text-align:center;'>0.99USD</p>

  <button ion-button style="text-align:center; margin-left:250px; height:30px; margin-top:20px;">Pay Now</button>

</ion-item>
</ion-content>
`
})
export class ModalContentBillingPage {
  items: any = [];
  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
