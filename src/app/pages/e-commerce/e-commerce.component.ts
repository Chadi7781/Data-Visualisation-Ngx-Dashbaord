import {Component, OnInit} from '@angular/core';
import { Chart } from 'chart.js';

import pptxgen from 'pptxgenjs';
import {Rapport} from '../rapport';
import {RapportService} from '../../service/rapport.service';


@Component({
  selector: 'ngx-ecommerce',
  styleUrls: ['./e-commerce.component.scss'],

  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent implements OnInit {
  title = 'chart-filter';
  lessThanOrGreaterThan = 'lessThan';
  filterLimit = 100;
  lessThan='lessThan';
  greaterThan='greaterThan';

  sud = '';
  nord ='';
  barChart;

  rapports: Rapport[];
  isOverFlown: boolean;
  levelsArr = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021'];


  from = '0';

  toMonth = '7';

  chartData = {
    'dataSet1': Array.from({length: 8}, () => Math.floor( (Math.random()*560)+10)),
    'dataSet2': Array.from({length: 8}, () => Math.floor( (Math.random()*560)+10))

  };

  constructor(private rapportService: RapportService) {
  }

  data: Rapport[] = [];




  //GET DATA  FROM MONGODB
  ngOnInit() {
    this.rapportService.getRapportList().subscribe(res => {
      this.rapports = res;
      for (let i = 0; i < this.rapports.length; i++) {
        this.data.push(this.rapports[i]);
        if(this.data[i].zone ==='nord')
          this.nord = this.data[i].zone;

        else this.sud = this.data[i].zone;


      }
    });
  }


  // ONCLICK EXPORT
  export() {

    //SET UP PRESENTATION OPTIONS

    let pptx = new pptxgen();
    pptx.layout = "LAYOUT_WIDE";//Title PPT

    pptx.defineSlideMaster({
      title: "MASTER_SLIDE",
      background: { color: "FFFFFF" },
      objects: [
        { rect: { x: 0.0, y: 5.3, w: "100%", h: 0.75, fill: { color: "F1F1F1" } } },
        { image: { x: 11.3, y: 6.4, w: 1.67, h: 0.75, path: "'../../../assets/wakahaww.png" } },


      ],
      slideNumber: { x: 0.3, y: "90%" },
    });
    //Slide 1
    let slide = pptx.addSlide({ masterName: "MASTER_SLIDE" });
    slide.addText("Analysis Product Zone Period", { align:'center', w: "100%", h: 2, fontSize: 40 ,bold:true})
    slide.addText("Supported By Miss Marwa", { align:'center', w: "100%", h: 6, fontSize: 30 ,bold:true,color:'#4B0082'}

    );
    slide.addShape(pptx.ShapeType.arc, { x: 10.75, y: 2.45, w: 1.5, h: 1.45, fill: { color: "#413C58" }, angleRange: [45, 315] });

    slide.addText("2021/2022", { x: 6, y: "90%", color: "e4e4e4", fontSize: 20 });




    //SLide 2 chart


    let slide2 = pptx.addSlide({ masterName: "MASTER_SLIDE" });

    slide2.addText("Zone Product Filterd by Year", { align:'center', w: "100%", h: 2, fontSize: 25 ,bold:true})

    let canvas = this.barChart.canvas;
    let dataURL = canvas.toDataURL();
    let opts = {x: 5, y: 6, w: 3.2, h: 3.2, fontSize: 42, color: '#fff'};
    slide2.addImage({data: dataURL, x: 1, y: 1, w: 8, h: 4});



    //Slide final

    let slideFinal = pptx.addSlide({ masterName: "MASTER_SLIDE" });



    slideFinal.addImage( { x: 2.3, y: 1.4, w: 9.67, h: 3.75, path: "../../../assets/Thank-you-min.png"});

    slideFinal.addText("2021/2022", { x: 6, y: "90%", color: "e4e4e4", fontSize: 20 });


    pptx.writeFile();



  }

  updateChartData(chart, data, dataSetIndex) {
    chart.data.datasets[dataSetIndex].data = data;
    chart.update();


  }

  //Filter YEAR (DATE INTERVAL)
  filterYearDate() {
    this.barChart = new Chart('bar', {
      type: 'bar',
      options: {
        responsive: true,
        title: {
          display: true,
          text: '',
        },
      },
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug'],
        datasets: [
          {
            type: 'bar',
            label: "chiffre d'affaire",
            data: this.chartData.dataSet1,
            backgroundColor: 'rgba(20,200,10,0.4)',
            borderColor: 'rgba(20,200,10,0.4)',
            fill: false,
          },

        ],
      },
    });

    this.barChart.data.labels = this.levelsArr.slice(parseInt(this.from), parseInt(this.toMonth) + 1);
    this.barChart.update();
    // console.log(this.chartData.dataSet1);

    this.barChart.data.datasets[0].data = this.chartData.dataSet1;

  }


  //Filter Year - turnover == value
  applyFilter(value) {

    /****FILTER YEAR(DATE INTERVALE)*****/
    this.filterYearDate();

    this.barChart.update();





  }

  applyFilterChiffreAffaire(value) {


    /****FILTER chiffre d'affaire****/
    //console.log(this.chartData.dataSet1);
    this.barChart.data.datasets[0].data = this.chartData.dataSet1;

    this.barChart.data.datasets.forEach((data,i) => {
      if(this.lessThanOrGreaterThan === 'greaterThan'){
        this.barChart.data.datasets[i].data = data.data.map(v => {
          if(v >= value) return v
          else return 0;
        });
        // console.log(">>>>>>>>", this.barChart.data.datasets[i].data);
      }else{
        this.barChart.data.datasets[i].data = data.data.map(v => {
          if(v <= value) return v;
          else return 0;
        });
        //console.log("?????????", this.barChart.data.datasets[i].data);
      }
    });
    this.barChart.update();
  }
  //
  removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }


  getNordChiffre() {
    return 1000;
  }

  //PIE
  showZone() {
    new Chart("pie", {
      type: 'pie',
      data: {
        labels: ['nord', 'sud'],
        datasets: [{
          data: [this.getNordChiffre(), 33655],
          backgroundColor: ['#FF6384', '#36A2EB','#FFCE56']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          labels: {
            render: 'percentage',
            fontColor: ['green', 'white', 'red'],
            precision: 2
          }
        },
      }
    });
  }






}

