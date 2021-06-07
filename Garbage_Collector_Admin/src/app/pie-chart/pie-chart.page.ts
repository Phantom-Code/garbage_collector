import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.page.html',
  styleUrls: ['./pie-chart.page.scss'],
})
export class PieChartPage implements OnInit {
  @ViewChild('pieCanvas') pieCanvas: ElementRef;
  private pieChart: Chart;
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
    if (this.pieChart) this.pieChart.destroy();
    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
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
