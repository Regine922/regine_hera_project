import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from "../home/home";

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  username : any = 'demo001';
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }


    onInputChange(value){
    this.username = value;
    }
  login(){
    this.navCtrl.setRoot(HomePage,{"username" : this.username});
  }
}
