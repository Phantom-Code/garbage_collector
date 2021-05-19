import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  constructor(
    public loadingController: LoadingController,
    private router: Router,
    public auth: AuthService
  ) {}

  ngOnInit() {}
  async onSubmitForm(formData: any) {
    this.prsentLoading();
    await this.auth
      .signUp(formData.email, formData.pass)
      .then(() => {
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        console.log(error);
      });
    this.loadingController.dismiss();
  }
  //loading
  async prsentLoading() {
    const loading = await this.loadingController.create();
    await loading.present();
    const { role, data } = await loading.onDidDismiss();
  }
}
