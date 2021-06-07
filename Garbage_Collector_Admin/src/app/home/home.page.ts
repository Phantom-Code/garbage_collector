import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  dataCollection: any;
  allData: any = [];
  queryData: any = [];
  data: any = [];
  timer: any;
  ref: any;
  constructor(private store: AngularFirestore, public router: Router) {}
  ngOnInit() {
    this.store
      .collection('images', (ref) => ref.orderBy('user').limit(10))
      .valueChanges()
      .subscribe((val) => {
        this.allData = val;
        this.data = this.allData;
      });
    this.ref = this.store.collection('images').ref;
  }
  test() {
    console.log('test works!');
    this.router.navigate(['/pie-chart']);
  }
  keyPressHandler(event) {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      console.log(event.target.value);
      if (event.target.value != '') {
        this.queryData = [];
        for (let i = 0; i < this.allData.length; i++) {
          if (this.allData[i].location.city == event.target.value) {
            this.queryData.push(this.allData[i]);
          }
        }
        this.data = this.queryData;
      } else {
        this.data = this.allData;
      }
    }, 1000);
  }
  //
  onCancelHandler() {
    console.log('cancelled');
    this.data = this.allData;
  }
  compare(a, b) {
    if (a.percentage > b.percentage) {
      return -1;
    }
    if (a.percentage < b.percentage) {
      return 1;
    }
    return 0;
  }
  orderByPercentage() {
    console.log('percentage works');
    this.data.sort(this.compare);
  }
}
