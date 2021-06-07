import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.page.html',
  styleUrls: ['./bar-chart.page.scss'],
})
export class BarChartPage implements OnInit {
  @ViewChild('barCanvas') barCanvas: ElementRef;
  private barChart: Chart;
  allData: any[];
  colors: string[];
  constructor(private store: AngularFirestore) {}

  ngOnInit() {
    this.colors = [
      '#ef2d56',
      '#ed7d3a',
      '#8cd867',
      '#2fbf71',
      '#1a85d6',
      '#783706',
    ];
  }
  ionViewDidEnter() {
    this.store
      .collection('images', (ref) => ref.orderBy('user'))
      .valueChanges()
      .subscribe((val) => {
        this.allData = val;
        this.loadChart();
      });
  }
  loadChart() {
    let labelDict = {};
    let total: any = 0;
    console.log(this.allData);
    this.allData.forEach((item) => {
      labelDict[item.location.city] = labelDict[item.location.city]
        ? labelDict[item.location.city] + 1
        : 1;
    });
    const data = {
      labels: Object.keys(labelDict),
      datasets: [
        {
          label: 'Dataset 1',
          data: Object.values(labelDict),
          backgroundColor: this.colors.slice(0, this.allData.length),
        },
      ],
    };
    if (this.barChart) this.barChart.destroy();
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }
}
