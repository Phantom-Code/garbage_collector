import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  constructor(
    public loadingController: LoadingController,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {}
  async onSubmitForm(formData) {
    this.presentLoading();
    await this.auth
      .signIn(formData.email, formData.pass)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log(error);
      });
    this.loadingController.dismiss();
  }
  //loading
  async presentLoading() {
    const loading = await this.loadingController.create();
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }
}
