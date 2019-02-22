import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { generate } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  setA: any;
  setB: any;
  namesA: any;
  namesB: any;
  numbersA: any;
  numbersB: any;
  colorsA: any;
  colorsB: any;
  chartA = [];
  chartB = [];
  constructor() { 
    this.namesA = [];
    this.namesB = [];
    this.numbersA = [];
    this.numbersB = [];

    this.colorsA = new Set();
    this.colorsB = new Set();
    //this.setA = 'a';
    //this.setB = 'b';
  }

  ngOnInit() {
   // this.setA = 'a';
   // this.setB = 'b';
   // console.log(this.setA);
    //console.log(this.setB);
  }

  generateColor(){
    var n = 6, s = '#';
	      while(n--){
		        s += (Math.random() * 16 | 0).toString(16);    // random char from 0 to f
        }
        return s;
  }
  async onFileSelect(event){
    var files = event.target.files;
    var fileA = files[0];
    var fileB = files[1];
    let Afinished = await this.read(fileA);
    this.setA = this.OnResponse(Afinished);
    let Bfinished = await this.read(fileB);
    this.setB = this.OnResponse(Bfinished);
    console.log('seta: '+ this.setA[1]);
    console.log('setb: '+ this.setB[1]);

    for(var i = 1; i < this.setA.length; i ++ ){
      if(this.setA[i]['Holding name'] != ""){
        let color = this.generateColor();
        while(this.colorsA.has(color)){
          color = this.generateColor();
        }
        this.colorsA.add(color);
        this.namesA.push(this.setA[i]['Holding name']);
        let temp = this.setA[i]['% of market value'];
        temp = temp.replace(new RegExp('=', 'g'), '');
        temp = temp.replace(new RegExp('"','g'), '');
        temp = temp.replace(new RegExp('%','g'), '');
        temp = +temp;
        this.numbersA.push(temp);
      }
    }

    for(var i = 1; i < this.setB.length; i ++ ){
      if(this.setB[i]['Holding name'] != ""){
        let color = this.generateColor();
        while(this.colorsB.has(color)){
          color = this.generateColor();
        }
        this.colorsB.add(color);
        this.namesB.push(this.setB[i]['Holding name']);
        let temp = this.setB[i]['% of market value'];
        temp = temp.replace(new RegExp('=', 'g'), '');
        temp = temp.replace(new RegExp('"','g'), '');
        temp = temp.replace(new RegExp('%','g'), '');
        temp = +temp;
        this.numbersB.push(temp);
      }
    }

    this.colorsA = Array.from(this.colorsA);
    this.colorsB = Array.from(this.colorsB);
    console.log(this.namesA);
    console.log(this.numbersA);
    console.log(this.colorsA);

    console.log(this.namesB);
    console.log(this.numbersB);
    console.log(this.colorsB);

    this.createChart();
  }

  read(file){
    return new Promise((resolve, reject)=> {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    })
    
  }

  OnResponse(res){
    var lines=res.split("\n");
    var result = [];
    var headers=lines[5].split(",");
    for(var i=5;i<lines.length;i++){
      var obj = {};
      var currentline=lines[i].split(",");
      for(var j=0;j<headers.length;j++){
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
  
    }

    return result;
    //console.log(JSON.stringify(result));
   /* let x = true;
    if(x){
      this.setA = result;
      
      console.log(this.setA[1]['Holding name']);
      x = false;
    } else if (!x){
      
      this.setB = result;
      console.log(this.setB[1].Holdingname);
      x= true;
    }   */
  }
  createChart(){
    
    this.chartA = new Chart('canvasA', {
      type:'pie',
      data: {
        labels: this.namesA,
        datasets:[{
          label: '% of market value',
          data: this.numbersA,
          backgroundColor: this.colorsA
        }],

      }
    });
  
    this.chartB = new Chart('canvasB', {
      type:'pie',
      data: {
        labels: this.namesB,
        datasets:[{
          label: '% of market value',
          data: this.numbersB,
          backgroundColor: this.colorsB
        }],

      }
    });
  }
  
  }

  