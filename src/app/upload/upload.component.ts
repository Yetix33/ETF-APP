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

  }

  ngOnInit() {
  
  }
  //generates random color hexadecimal
  generateColor(){
    var n = 6, s = '#';
	      while(n--){
		        s += (Math.random() * 16 | 0).toString(16);    // random char from 0 to f
        }
        return s;
  }


  //basically the main function. Is async because of the await and async read() function that is called
  async onFileSelect(event){
    var files = event.target.files;
    var fileA = files[0];
    var fileB = files[1];
    //calls the read function and awaits for the Promise return to set it to global variables
    let Afinished = await this.read(fileA);
    this.setA = this.CSVtoJSON(Afinished);
    let Bfinished = await this.read(fileB);
    this.setB = this.CSVtoJSON(Bfinished);
    
    console.log('seta: '+ this.setA[1]);
    console.log('setb: '+ this.setB[1]);

    //scrapes the desired data from the json
    for(var i = 1; i < this.setA.length; i ++ ){
      if(this.setA[i]['Holding name'] != ""){
        //adds a unique color to the colorset for each holding name
        let color = this.generateColor();
        while(this.colorsA.has(color)){
          color = this.generateColor();
        }
        this.colorsA.add(color);

        //adds each holding name to a set and the corresponding data
        this.namesA.push(this.setA[i]['Holding name']);
        let temp = this.setA[i]['% of market value'];
        //removing uneccessary characters from the data
        temp = temp.replace(new RegExp('=', 'g'), '');
        temp = temp.replace(new RegExp('"','g'), '');
        temp = temp.replace(new RegExp('%','g'), '');
        temp = +temp;
        this.numbersA.push(temp);
      }
    }

    //same as above but for setB this time
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

    //change the colors object of type Set to type Array
    this.colorsA = Array.from(this.colorsA);
    this.colorsB = Array.from(this.colorsB);
    console.log(this.namesA);
    console.log(this.numbersA);
    console.log(this.colorsA);

    console.log(this.namesB);
    console.log(this.numbersB);
    console.log(this.colorsB);

    //finally create the charts with the data
    this.createChart();
  }

  //reads file. As FileReader is an async task, a promise must be used to wrap the onload function in order to get the data outside of the function
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
    //changes csv file type to json
    CSVtoJSON(csv){
    var lines=csv.split("\n");
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
  
  }

  createChart(){
    
    this.chartA = new Chart('canvasA', {
      type:'horizontalBar',
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
      type:'horizontalBar',
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

  