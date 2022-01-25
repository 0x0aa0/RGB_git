import './App.css';
import logo from './alt_logo.png';
import red from './red.svg'
import grn from './grn.svg'
import blu from './blu.svg'
import ss from './ss.png'
import discord from './discord.svg'
import twitter from './twitter.svg'
import { Line } from 'react-chartjs-2';

const linedatastruct = (canvas) => {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 1490, 0);
  gradient.addColorStop(0, "rgba(255, 0, 0, 1)"); 
  gradient.addColorStop(0.1, "rgba(255, 154, 0, 1)");
  gradient.addColorStop(0.2, "rgba(79, 220, 74, 1)");
  gradient.addColorStop(0.3, "rgba(79, 220, 74, 1)");
  gradient.addColorStop(0.4, "rgba(63, 218, 216, 1)");
  gradient.addColorStop(0.5, "rgba(47, 201, 226, 1) ");
  gradient.addColorStop(0.6, " rgba(28, 127, 238, 1)");
  gradient.addColorStop(0.7, "rgba(95, 21, 242, 1)");
  gradient.addColorStop(0.8, "rgba(186, 12, 248, 1)");
  gradient.addColorStop(0.9, "rgba(251, 7, 217, 1)");
  gradient.addColorStop(1, "rgba(255, 0, 0, 1)");

    var ret = {
      labels: ["", "", "", "", "", "", "", "","", "","", "","", "","", "", "", "", "", "", "", "","", "","", "","", "","", "", "", "", "", "", "", "","", "","", "","", "","", "", "", "", "", "", "", "","", "","", "","", "","", "", "", "", "", "", "", "","", "","", "","", "","", "", "", "", "", "", "", "","", "","", "","", "", "","", "","", "", "","", "","", "", "","", "",""], 
    datasets: [
      {
        data: [5,4,5,4,3,4,5,4,3,4,3,2,3,2,3,4,3,4,5,6,5,6,7,8,7,8,9,8,9,8,9,8,7,6,5,6,7,8,9,10,9,10,11,12,11,10,9,10,11,12,13,14,15,16,15,14,15,16,17,16,17,16,15,16,15,14,15,14,13,12,11,12,13,12,13,14,15,16,17,18,19,18,19,18,17,18,17,16,17,16,17,18,17,18,19,18,17,18],
        fill: false,
        borderColor: gradient,
        borderWidth: 6,
      }
    ]
  } 
  return ret;
}

const pcorr = (x, y) => {
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumX2 = 0,
    sumY2 = 0;
  const minLength = x.length = y.length = Math.min(x.length, y.length),
    reduce = (xi, idx) => {
      const yi = y[idx];
      sumX += xi;
      sumY += yi;
      sumXY += xi * yi;
      sumX2 += xi * xi;
      sumY2 += yi * yi;
    }
  x.forEach(reduce);
  let ret = (minLength * sumXY - sumX * sumY) / Math.sqrt((minLength * sumX2 - sumX * sumX) * (minLength * sumY2 - sumY * sumY));
  if(ret < 0){
    ret = Math.random() * 255
  } else {
    ret = ret*255 + 150
  }
  return ret
};

var data1 = Array.from({length: 30}, () => Math.floor(Math.random() * 10) + 10);
var data2 = Array.from({length: 30}, () => Math.floor(Math.random() * 10) + 10);
var data3 = Array.from({length: 30}, () => Math.floor(Math.random() * 10) + 10);
var data4 = Array.from({length: 30}, () => Math.floor(Math.random() * 10));

var redc = pcorr(data1, data4)
var grnc = pcorr(data2, data4)
var bluc = pcorr(data3, data4)

var buttoncolor = 'rgb(' + String(redc) + "," + String(grnc) + "," + String(bluc) +')'

const linedatastruct2 = () => {

    var ret = {
      labels: ["", "", "", "", "", "", "", "","", "","", "", "", "", "", "", "", "","", "","", "", "", "", "", "", "", "","", ""], 
    datasets: [
      {
        label:"RED",
        data: data1,
        fill: false,
        borderColor: '#FF5959',
        borderWidth: 6,
      },
      {
        label:"GRN",
        data: data2,
        fill: false,
        borderColor: '#65FF4D',
        borderWidth: 6,
      },
      {
        label:"BLU",
        data: data3,
        fill: false,
        borderColor: '#3EB9FF',
        borderWidth: 6,
      },
      {
        label:"ETH",
        data: data4,
        fill: false,
        borderColor: buttoncolor,
        borderWidth: 6,
      }
    ]
  } 
  return ret;
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="logo" alt="logo" />
        <h1 className="name">RGB Network</h1>
        <nav className="navbar">
          <a href="./v1.pdf" target="blank_">Colorpaper</a>
          <a href="#redsvg">Tokenomics</a>
          <a href="#hiw">Demo</a>
          <a href="#roadmap">Roadmap</a>
        </nav>
        {/* <div className="enterapp"><a href="http://localhost:3001/" target="blank_">Launch App</a></div> */}
        <a href="https://twitter.com/rgb_network_" target="blank_"><img src={twitter} className="twitter"/></a>
        <a href="https://discord.gg/dtT3wg9ZZq" target="blank_"><img src={discord} className="discord"/></a>
      </header>
      <h2 className="intro">Making the market more colorful</h2>
      <h3 className="introsub">RGB is the newest protocol for trading trends</h3>
      <a href="./v1.pdf" className="readpaper" target="blank_">Read the <br></br><strike>white</strike> <span className="colorpaper">colorpaper &#8605;</span></a>
      <div className="chartDiv">
      <Line 
      data={linedatastruct}
      height={130}
      options={{
        scaleShowLabels : false,
        elements: {
          point:{
              radius: 0
          }
        },
        scales: {
          x: {
             display: false,
          },
          y: {
             display: false,
          }
       },
        animation: {
          duration: 0,
          easing: 'easeOutLinear',
        },
        plugins: {
          legend: {
            display: false,
          },
        },
    
      }} /></div>

      <a href="https://etherscan.io/" target="blank_"><img src={red} id="redsvg" className="redsvg" alt="logo" /></a>
      <a href="https://etherscan.io/" target="blank_"><img src={grn} className="grnsvg" alt="logo" /></a>
      <a href="https://etherscan.io/" target="blank_"><img src={blu} className="blusvg" alt="logo" /></a>

      <h2 className="tokens">Our Three Tokens</h2>
      <h3 className="tokenssub">RED, GRN, and BLU.<br></br>
                                All deployed with the same tokenomics<br></br>
                                at the same time.<br></br>
                                Launching on MISO.<br></br>
                                Which one is your favorite?</h3>
      <a href="https://miso.sushi.com/auctions/live" target="blank_" className="buynow">Crowdsale &#8605;</a>

      <h2 id='hiw' className="howitworks">How It Works</h2>

      <p className='correlation'>First we meaure the correlation <br></br>
                                of any asset to RED, GRN, and BLU <br></br>
                                and use those values to <br></br>
                                construct a unique color</p>

                                
      <div className="chart2Div">
      <Line 
      data={linedatastruct2}
      options={{
        scaleShowLabels : false,
        elements: {
          point:{
              radius: 0
          }
        },
        scales: {
          x: {
             display: false,
          },
          y: {
             display: false,
          }
       },
        animation: {
          duration: 0,
          easing: 'easeOutLinear',
        },
        plugins: {
          legend: {
            display: false,
          },
        },
    
      }} /></div>  

      <button className='tryme' onClick={() => window.location.reload(false)} style={{background: buttoncolor}}>Colorize!</button>      

      <iframe className= "plot" src="./plot.html"></iframe>

      <h2 className='visit'>Visualize It</h2>

      <p className='finally'>Once we have a color value for every asset <br></br>
                              we can plot those values in color space<br></br>
                                for a more intutive way<br></br>
                                to consider market sectors<br></br>
                                </p>     

      <p className='checkit'>&#8592; Try it out </p>    

      <img src={ss} id="ss" className="ss" alt="logo" />
      <h2 className='spring'>Coming to Polygon <span className='twin22'>Spring 2022</span></h2>

      <h2 id="roadmap" className="roadmap">Roadmap</h2>
      <p className="q1">Q1</p>
      <p className="q2">Q2</p>
      <p className="q3">Q3</p>
      <p className="q4">Q4</p>
      <div className="timeline"></div>

      <ul className="list1">
        <li> Info Site Launch</li>
        <li className="tab1"> Colorpaper Release</li>
        <li className="tab2"> Community Building</li>
        <li className="tab3"> Pinescript Indicators</li>
      </ul>

      <ul className="list2">
        <li>Token Crowdsales</li>
        <li className="tab1">Visualization App Beta</li>
        <li className="tab2">Airdrop Campaign</li>
        <li className="tab3">DAO Formations</li>
      </ul>

      <ul className="list3">
        <li>Stock Market Integration</li>
        <li className="tab1">Prediction Market Beta</li>
        <li className="tab2">RGB NFT Drop</li>
        <li className="tab3">Subgraph API</li>
      </ul>

      <a href="https://twitter.com/hippo_labs" target="blank_" className="akultra">a project from HIPPO Labs &#8605;</a>

    </div>
  );
}

export default App;
