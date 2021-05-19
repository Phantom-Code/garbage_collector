import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CameraResultType,
  CameraSource,
  Plugins,
  Geolocation,
} from '@capacitor/core';
import { AlertController, LoadingController } from '@ionic/angular';

import * as tf from '@tensorflow/tfjs';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  imgSource: any;
  img: any;
  model: any;
  predictions: any;
  percentage: any;
  warmedup: boolean;
  imageReady: boolean;
  loading: boolean;
  imageData: any;
  user: any;
  location: any;
  userID: any;
  constructor(
    public loadingController: LoadingController,
    private sanitizer: DomSanitizer,
    public alertController: AlertController,
    private store: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.imgSource = '/assets/default_image.svg';
    this.warmedup = false;
    this.imageReady = false;
    this.loading = false;
  }
  async ngOnInit() {
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/sign-in']);
    }
    const temp = this.auth.getUser();
    (await temp).subscribe((data) => {
      this.user = data;
    });
  }
  async loadModel() {
    const modelURL = '/assets/model/model.json';
    this.model = await tf.loadGraphModel(modelURL);
    console.log('model loaded');
  }
  async predict() {
    this.percentage = undefined;
    this.img = document.getElementById('testImage');
    const tfImg = tf.browser.fromPixels(this.img).toInt();
    const expandedimg = tfImg.expandDims();
    await this.model.executeAsync(expandedimg).then((predictions) => {
      const boxes = predictions[1].arraySync();
      const scores = predictions[7].arraySync();
      const classes = predictions[6].dataSync();

      for (let i = 0; i < scores[0].length; i++) {
        if (scores[0][i] > 0.75) {
          this.percentage = scores[0][i].toFixed(2) * 100;
          break;
        } else {
          this.percentage = scores[0][i].toFixed(2) * 100;
        }
      }
    });
    console.log(this.percentage, 'predict percentage');

    if (this.percentage < 75) {
      this.presentAlert(
        'Cannot detect garbage',
        'Detected only ' +
          this.percentage +
          '% garbage Please take another image'
      );
    }
    console.log('predict done');
  }
  //Image from Camera
  async takePicture() {
    this.percentage = undefined;
    this.imageReady = false;
    await Plugins.Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    }).then(async (image) => {
      this.imgSource = await this.sanitizer.bypassSecurityTrustResourceUrl(
        image && image.dataUrl
      );
      this.imageData = image.dataUrl;
      this.imageReady = true;
    });

    console.log(this.imageReady, 'imageReady');
  }
  // Image from gallery
  async fromGallery() {
    this.percentage = undefined;
    this.imageReady = false;
    const image = await Plugins.Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Photos,
    }).then(async (image) => {
      this.imgSource = await this.sanitizer.bypassSecurityTrustResourceUrl(
        image && image.dataUrl
      );
      this.imageData = image.dataUrl;
      this.imageReady = true;
    });
  }
  //loads model and predicts
  async imageCheck() {
    console.log(this.warmedup);
    if (!this.warmedup) {
      await this.loadModel();
      this.warmedup = true;
    }
    await this.predict();
  }
  async takePictureHandler() {
    this.loading = true;
    this.presentLoading();
    await this.takePicture();

    await this.delay(2000);
    console.log('Waited 2s');
    await this.imageCheck().then(() => {
      this.loading = false;
      this.loadingController.dismiss();
    });
  }
  async fromGalleryHandler() {
    this.loading = true;
    this.presentLoading();
    await this.fromGallery();
    await this.delay(2000);
    console.log('Waited 2s');
    await this.imageCheck().then(() => {
      this.loading = false;
      this.loadingController.dismiss();
    });
  }

  // Database >>>>>>>>>>>>>
  async uploadToDB() {
    console.log('uploadToDB', {
      imageData: this.imageData,
      percentage: this.percentage,
    });
    await this.getCurrentPosition();
    this.presentLoading();
    const imageDoc = await this.store.collection('images').add({
      imageData: this.imageData,
      percentage: this.percentage,
      location: {
        latitude: this.location.coords.latitude,
        longitude: this.location.coords.longitude,
        timestamp: this.location.timestamp,
      },
      user: this.user.uid,
    });
    console.log(imageDoc.id);

    this.store
      .collection('users')
      .doc(this.user.uid)
      .set(
        {
          user: { email: this.user.email },
          images: firebase.firestore.FieldValue.arrayUnion(imageDoc.id),
        },
        { merge: true }
      )
      .then(() => {
        console.log('uloded img');
        this.loadingController.dismiss();
        this.router.navigate(['/success-page']);
      })
      .catch((error) => {
        console.log(error);
        this.presentAlert('Something went Wrong', 'Cannot upload image .');
        this.loadingController.dismiss();
      });
  }
  //Location
  async getCurrentPosition() {
    this.location = await Geolocation.getCurrentPosition();
    console.log(this.location);
  }
  // Helper functions >>>>>>>>>
  // Loading overlay......
  async presentLoading() {
    const loading = await this.loadingController.create();
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }
  // Error Message
  async presentAlert(subHeader, message) {
    const alert = await this.alertController.create({
      header: 'Error',
      subHeader: subHeader,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  //delays code for given ms
  delay = (ms) => new Promise((res) => setTimeout(res, ms));

  //loads model and tests
  //may be not needed
  async dryRun() {
    await this.loadModel();
    this.img = document.getElementById('testImage');
    const tfImg = tf.browser.fromPixels(this.img).toInt();
    const expandedimg = tfImg.expandDims();
    const warmupResult = await this.model.executeAsync(expandedimg);
    const scores = warmupResult[7].arraySync();
    console.log('dryRun done', scores);
  }
}
