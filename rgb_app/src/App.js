import logo from './alt_logo.png';
import disc from './disc.png'
import tele from './tele.png'
import './App.scss';
import iro from '@jaames/iro';
import IroColorPicker from "./IroColorPicker";
import React, { useState, useEffect, useRef, useCallback} from 'react';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import ImgRenderer from './imgRenderer.jsx';
import { formatCurrency } from "@coingecko/cryptoformat";
import { Line } from 'react-chartjs-2';

function App() {

 const [red, setRed] = useState(null);
 const [grn, setGrn] = useState(null);
 const [blu, setBlu] = useState(null);

 useEffect(() => {
  fetch("/rgb")
  .then((res) => res.json())
  .then((data) => setRed(data.data[0].r));
 }, []);

 useEffect(() => {
  fetch("/rgb")
  .then((res) => res.json())
  .then((data) => setGrn(data.data[0].g));
 }, []);

 useEffect(() => {
  fetch("/rgb")
  .then((res) => res.json())
  .then((data) => setBlu(data.data[0].b));
 }, []);

 const [place, setPlace] = useState(null);

 useEffect(() => {
  fetch("/place")
  .then((res) => res.json())
  .then((data) => setPlace(data.data));
 }, []);


 const [rowData, setRowData] = useState([]);

 useEffect(() => {
  fetch("/coins")
  .then((res) => res.json())
  .then((data) => setRowData(data.data[0].data));
 }, []);
 
  function tickFormat(params) {
    return params.value.toUpperCase();
  }

  function priceFormat(params) {
    //return priceFormatter.format(params.value);
    return formatCurrency(params.value, "USD", "en");
  }

  function redFormat(params) {
    return Math.round(params.value[0] * 10000) / 100 + "%";
  }

  function grnFormat(params) {
    return Math.round(params.value[1] * 10000) / 100 + "%";
  }

  function bluFormat(params) {
    return Math.round(params.value[2] * 10000) / 100 + "%";
  }

  function percFormat(params) {
    if(params.value < 0){
      return Math.round(params.value * 100) / 100 + "%";
    }
    else{
      return "+" + Math.round(params.value * 100) / 100 + "%";
    }
  }

  function numToColor(params){
    let r = params[0];
    let g = params[1];
    let b = params[2];
    return "rgb("+r*255+","+g*255+","+b*255+")";
  }

  function cellStyle(params) {
    var color = numToColor(params.value);
    return {
      backgroundColor: color,
    };
  }

  function imgStyle(params) {
    return {
      marginTop: "5px",
    };
  }

  function colorFormat(params) {
    return "";
  }

  const grnComparator = (valueA, valueB, nodeA, nodeB, isInverted) => valueA[1] - valueB[1];

  const bluComparator = (valueA, valueB, nodeA, nodeB, isInverted) => valueA[2] - valueB[2];

  const vComparator = (valueA, valueB, nodeA, nodeB, isInverted) => valueA[5] - valueB[5];

  const [color, setColor] = useState([]);

  let filtering = 0;

  const isExternalFilterPresent = () => {
    return filtering;
  };

  const doesExternalFilterPass = (node) => {
    let nh = node.data.rgb[3] * 360
    let ns = node.data.rgb[4] * 100
    return nh >= color.h - 20 && nh <= color.h + 20 && ns >= color.s - 20 && ns <= color.s + 20;
  };

  const gridApi = useRef();
  const gridColumnApi = useRef();

  const onGridReady = (params) => {
    gridApi.current = params.api;
    gridColumnApi.current = params.columnApi
  }

  const externalFilterChanged = (newValue) => {
      sortV();
      setColor(newValue);
      filtering = 1;  
  };

    useEffect(() =>{
      if(gridApi.current){
        setTimeout(function() { gridApi.current.onFilterChanged(); }, 1);
      }    
    }, [color]);
  

  const sortV = () => {
    gridColumnApi.current.applyColumnState({
      state: [
        {
          colId: 'rgb',
          sort: 'desc',
        },
      ],
      defaultState: { sort: null },
    });
  };

  
  const onFilterTextBoxChanged = () => {
    gridApi.current.setQuickFilter(document.getElementById('filter-text-box').value);
  }

  const snapColor = (params) => {
    let h = params.value[3] * 360;
    let s = params.value[4] * 100;
    let v = params.value[5] * 100;
    let nv = {"h": h, "s": s, "v": v};
    externalFilterChanged(nv); 
  };

  ////////////////////////////   LINE    //////////////////////////////////

  const [linedata, setLineData] = useState(null);
  const [lineid, setLineID] = useState("bitcoin");

  const snapLine = (params) => {
    setLineID(params.data.id)
  }

  useEffect(() => {
    fetch("/line", {
      method: 'POST',
      body: JSON.stringify(lineid)
    })
    .then((res) => res.json())
    .then((data) => setLineData(data.data));
   }, [lineid]);


   const linedatastruct = (canvas) => {
    var ret = {
        labels: ["0"],
        datasets: [
            {
                borderColor : "#000",
                data : [0]
            }
        ]
    }

    if(linedata){
      const ctx = canvas.getContext("2d");
      const gradient = ctx.createLinearGradient(0, 0, 1490, 0);
      for (let i = 0; i < linedata.rgbs.length; i++) {
        let col = 'rgba('+linedata.rgbs[i][0] * 255+','+linedata.rgbs[i][1] * 255+','+linedata.rgbs[i][2] * 255+',1)'
        gradient.addColorStop((1/288) * i, col); 
      }

        ret = {
          labels: linedata.times,
          datasets: [
              {
                  backgroundColor : gradient, 
                  borderColor : gradient,
                  borderWidth: 4,
                  data : linedata.prices
              }
          ]
      }
    }

    return ret;
}

  ///////////////////////////   HTML  ///////////////////////////////////////
  
  /* 
  <button className="randomButton" onClick={() => console.log("CLICKED")}>⚂</button>
  <button className="flipButton" onClick={() => console.log("CLICKED")}>⇄</button>
  <div className="colorBox"></div>
  */

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="logo" alt="logo" />
        <h1 className="name">RGB Network</h1>
        <p className="placeholder">Home</p>
        <p className="placeholder">Plot</p>
        <p className="placeholder">Swap</p>
        <p className="placeholder">Whitepaper</p>

        <div className="socials">
          <img src="https://assets.chaminade.edu/wp-content/uploads/2019/08/08073853/Twitter-Icon-black-1.png" width="42px" height="42px" />
          <img src={disc} width="28px" height="30px"/>
          <img src={tele} width="38px" height="38px"/>
        </div>
      </header>

      <div className="red-dex"><div className="price-text"><p>{!red ? "..." : "$" + Math.round(red * 100000) / 100000}</p></div></div>
      <div className="grn-dex"><div className="price-text"><p>{!grn ? "..." : "$" + Math.round(grn * 100000) / 100000}</p></div></div>
      <div className="blu-dex"><div className="price-text"><p>{!blu ? "..." : "$" + Math.round(blu * 100000) / 100000}</p></div></div>

      <div className="red-place"><div className="place-text">{!place ? "..." : Math.round(place.rc * 1000) / 1000 + "%"}</div></div>
      <div className="grn-place"><div className="place-text">{!place ? "..." : Math.round(place.gc * 1000) / 1000 + "%"}</div></div>
      <div className="blu-place"><div className="place-text">{!place ? "..." : Math.round(place.bc * 1000) / 1000 + "%"}</div></div>

      <button className="resetButton" onClick={() => window.location.reload(false)}>&#8635;</button>
      <input className= "textFilter" autocomplete="off" type="text" id="filter-text-box"  onChange={() => onFilterTextBoxChanged()}/>
      
      <div className="App-body">
        <div className="picker"><IroColorPicker
          width={400}
          borderWidth= {1}
          borderColor= {"#000"}
          wheelAngle= {210}
          wheelDirection= {"clockwise"}
          layoutDirection= {'horizontal'}
          layout={[
           {
            component: iro.ui.Wheel,
           },
          ]}
          onColorChange={ (color) => { externalFilterChanged(color.hsv) } }
        />
        </div>
        
        <div className="table">
          <div className="ag-theme-alpine-dark" style={{height: 510, width: 1020}}>
            <AgGridReact
                rowData={rowData}
                animateRows={true}
                isExternalFilterPresent={isExternalFilterPresent}
                doesExternalFilterPass={doesExternalFilterPass}
                onGridReady={onGridReady}

                frameworkComponents={{
                  imgRenderer: ImgRenderer,
                }}
                columnTypes={{
                  colorColumn: {
                    width: 45,
                    cellStyle: cellStyle,
                    valueFormatter: colorFormat,
                    comparator: vComparator,
                    sortable: true,
                    sortingOrder: ['desc', 'asc', null],
                    onCellClicked: snapColor
                  },
                  imgColumn: {
                    cellStyle: imgStyle,
                    width: 50,
                    onCellClicked: snapLine
                  },
                  nameColumn: {
                    width: 140,
                    onCellClicked: snapLine
                  },
                  tickColumn: {
                    width: 80,
                    valueFormatter: tickFormat,
                    onCellClicked: snapLine
                  },
                  priceColumn: {
                    width: 140,
                    valueFormatter: priceFormat,
                    sortable: true,
                    sortingOrder: ['desc', 'asc', null]
                  },
                  percColumn: {
                    width: 100,
                    valueFormatter: percFormat,
                    sortable: true,
                    sortingOrder: ['desc', 'asc', null]
                  },
                  redColumn: {
                    width: 100,
                    valueFormatter: redFormat,
                    sortable: true,
                    sortingOrder: ['desc', 'asc', null]
                  },
                  grnColumn: {
                    width: 100,
                    valueFormatter: grnFormat,
                    sortable: true,
                    comparator: grnComparator,
                    sortingOrder: ['desc', 'asc', null]
                  },
                  bluColumn: {
                    width: 100,
                    valueFormatter: bluFormat,
                    sortable: true,
                    comparator: bluComparator,
                    sortingOrder: ['desc', 'asc', null]
                  },
                  mcapColumn: {
                    width: 180,
                    valueFormatter: priceFormat,
                    sortable: true,
                    sortingOrder: ['desc', 'asc', null],
                    flex: 1
                  },
                }}
                >
                <AgGridColumn headerName="+" field="rgb" type="colorColumn"></AgGridColumn>
                <AgGridColumn headerName="" field="image" cellRenderer="imgRenderer" type="imgColumn"></AgGridColumn>
                <AgGridColumn headerName="Name" field="name" type='nameColumn'></AgGridColumn>
                <AgGridColumn headerName="Ticker" field="symbol" type='tickColumn'></AgGridColumn>
                <AgGridColumn headerName="Price" field="current_price" type='priceColumn'></AgGridColumn>
                <AgGridColumn headerName="24h" field="price_change_percentage_24h" type='percColumn' ></AgGridColumn>
                <AgGridColumn headerName="R" field="rgb" type='redColumn' ></AgGridColumn>
                <AgGridColumn headerName="G" field="rgb" type='grnColumn'></AgGridColumn>
                <AgGridColumn headerName="B" field="rgb" type='bluColumn'></AgGridColumn>
                <AgGridColumn headerName="Market Cap" type='mcapColumn' field="market_cap"></AgGridColumn>
            </AgGridReact>
        </div>
       </div>
      </div>
        
        <div className="chartFeatures"></div>
          <div className="chartImg"><img src={!linedata ? "" : linedata.image} width="30px" alt=""/></div>
          <div className="chartName"><p>{!linedata ? "" : linedata.name} <span className="chartTick">{!linedata ? "" : linedata.tick.toUpperCase()}</span></p></div>
          <div className="chartRGB"><p>R: <span className="chartR">{!linedata ? "" : Math.round(linedata.r * 10000) / 100 + "%"}</span> G: <span className="chartG">{!linedata ? "" : Math.round(linedata.g * 10000) / 100 + "%"}</span> B: <span className="chartB">{!linedata ? "" : Math.round(linedata.b * 10000) / 100 + "%"}</span></p></div>
          <div className="chartPrice"><p>{!linedata ? "" : "$" + linedata.price} <span className="chartTick">{!linedata ? "" : Math.round(linedata.change * 100) / 100 + "%"}</span></p></div>
        
        <div className="chartDiv">

          <Line 
            className="lineChart" 
            width={1471}
            height={640}
	          options={{ 
              maintainAspectRatio: false,
              plugins:{   
                legend: {
                  display: false
                },
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  displayColors: false,
                  yAlign: 'top',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              },
              elements: {
                point:{
                    radius: 0
                },
                line:{
                  tension: 0.3
                }
            },
            scales: {
              x: {
                grid:{
                   color: "#212121"
                },
              },
              y: {
               grid:{
                color: "#212121"
                }
              },
            }

            }}
            data={linedatastruct}
          />
        </div>
        
    </div>
  );
}

export default App;
