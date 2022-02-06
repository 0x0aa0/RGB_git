import './Mobile.css';
import logo from './alt_logo.png';
import red from './red.png'
import grn from './grn.png'
import blu from './blu.png'
import ss from './ss.png'
import discord from './discord.png'
import twitter from './twitter.png'
import tv from './tv.png'
import icp from './icp.png'
import grt from './grt.png'
import storj from './storj.png'
import matic from "./matic.png"
import hippored from "./hippo_red.png"
import hippogrn from "./hippo_grn.png"
import hippoblu from "./hippo_blu.png"
import demovid from "./demovid.mp4"
import newrgb from "./newrgb.png"
import pie from "./pie.png"


import { Line } from 'react-chartjs-2';

const linedatastruct = (canvas) => {
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 1490, 0);
  gradient.addColorStop(0, "rgba(255, 0, 0, 1)"); 
  gradient.addColorStop(0.025, "rgba(255, 154, 0, 1)");
  gradient.addColorStop(0.05, "rgba(79, 220, 74, 1)");
  gradient.addColorStop(0.75, "rgba(79, 220, 74, 1)");
  gradient.addColorStop(0.1, "rgba(63, 218, 216, 1)");
  gradient.addColorStop(0.125, "rgba(47, 201, 226, 1) ");
  gradient.addColorStop(0.15, " rgba(28, 127, 238, 1)");
  gradient.addColorStop(0.175, "rgba(95, 21, 242, 1)");
  gradient.addColorStop(0.2, "rgba(186, 12, 248, 1)");
  gradient.addColorStop(0.225, "rgba(251, 7, 217, 1)");
  gradient.addColorStop(0.275, "rgba(255, 0, 0, 1)");

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

document.body.style = 'background: #121212;';

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

function Mobile() {
  return (
    <div className="App">
    <div className="flex">
      <header className="App-header">
        <img src={logo} className="logo" alt="logo" />
        <h1 className="name">RGB Network</h1>
        <nav className="navbar">
          {/* <a href="./v1.pdf" target="blank_">Colorpaper</a>
          <a href="#tokenomics">Tokenomics</a>
          <a href="#hiw">Demo</a>
          <a href="#team">Team</a>
          <a href="#roadmap">Roadmap</a> */}
        </nav>
        {/* <div className="enterapp"><a href="http://localhost:3001/" target="blank_">Launch App</a></div> */}
        <a href="https://twitter.com/rgb_network_" target="blank_"><img src={twitter} className="twitter-mobile"/></a>
        <a href="https://discord.gg/dtT3wg9ZZq" target="blank_"><img src={discord} className="discord-mobile"/></a>
        <a href="https://www.tradingview.com/u/RGB-Network/" target="blank_"><img src={tv} className="tv-mobile"/></a>
      </header>
      <div>
      <h2 className="intro-mobile">Making the market more colorful</h2>
      <h3 className="introsub-mobile">RGB is the newest protocol for trading trends</h3>
      <a href="./v1.pdf" className="readpaper-mobile" target="blank_">Read the <br></br><strike>white</strike> <span className="colorpaper-mobile">colorpaper &#8605;</span></a>
      <div className="chartDiv-mobile">
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
      </div>

      <div id="tokenomics" className='tokenomics'></div>

      
      <a><img src={red} className="redsvg-mobile" alt="logo" /></a>
      <a><img src={grn} className="grnsvg-mobile" alt="logo" /></a>
      <a><img src={blu} className="blusvg-mobile" alt="logo" /></a>
     

      {/* <img src={newrgb} className="rgbthree" alt="logo" /> */}
      <img src={pie} className="pie-mobile" alt="logo" />

      <h2 className="tokens-mobile">Our Three Tokens</h2>
      <h3 className="tokenssub-mobile">RED, GRN, and BLU launching on MISO <br></br>
                                with the same tokenomics<br></br>
                                at the same time<br></br>
                                Team up to maximize your DAO treasury<br></br>
                                Which one is your favorite?</h3>
      {/*<a href="https://miso.sushi.com/auctions/live" target="blank_" className="buynow">Coming Soon &#8605;</a>*/}

      <h2 id='hiw' className="howitworks-mobile">How It Works</h2>

      <p className='correlation-mobile'>First we meaure the correlation <br></br>
                                of any asset to RED, GRN, and <br></br>
                                BLU and use those values to <br></br>
                                construct a unique color</p>

                                
      <div className="chart2Div-mobile">
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

      {/* <button className='tryme-mobile' onClick={() => window.location.reload(false)} style={{background: buttoncolor}}>Colorize!</button>       */}

      {/* <iframe className= "plot" src="./plot.html"></iframe> */}

      <h2 className='visit-mobile'>Visualize It</h2>

      <p className='finally-mobile'>Once we have a color value for every asset <br></br>
                              we can plot those values in color space<br></br>
                                for a more intutive way<br></br>
                                to consider market sectors<br></br>
                                </p>     

      {/* <p className='checkit'>&#8592; Try it out </p> */}

      <h2 className='tech-mobile'>Forever Decentralized</h2>

      <p className='techsub-mobile'>We are using these tools and many more<br></br>
                              to fully decentralize our stack.<br></br>
                                From hosting our website <em>(yes this one)</em><br></br>
                                on Internet Computer<br></br>
                                to keeping our data on Storj<br></br>
                                we are commited to the new open web.
                                </p>         

     <a href="https://dfinity.org/" target="blank_"><img src={icp} className="icp-mobile" alt="logo" /></a>
     <a href="https://polygon.technology/" target="blank_"><img src={matic} className="matic-mobile" alt="logo" /></a>
     <a href="https://www.storj.io/" target="blank_"><img src={storj} className="storj-mobile" alt="logo" /></a>
     <a href="https://thegraph.com/en/" target="blank_"><img src={grt} className="grt-mobile" alt="logo" /></a>

      <h2 id='team' className='ourteam-mobile'>The HIPPO Team</h2>

      <a href="https://twitter.com/HippoMilli" target="blank_" className='hippolink'><img src={hippored} className="hippored-mobile" alt="logo" /></a>
      <a href="https://twitter.com/AK_ULTRA_" target="blank_" className='hippolink'><img src={hippogrn} className="hippogrn-mobile" alt="logo" /></a>
      <a href="https://twitter.com/HippoFiesta" target="blank_" className='hippolink'><img src={hippoblu} className="hippoblu-mobile" alt="logo" /></a>

      <p className='milli-mobile'>MILLI</p>
      <p className='marketing-mobile'>Head of Marketing</p>

      <p className='akultra-mobile'>AKULTRA</p>
      <p className='founder-mobile'>Founder</p>

      <p className='fiesta-mobile'>FIESTA</p>
      <p className='leaddev-mobile'>Lead Developer</p>


      {/*<img src={ss} id="ss" className="ss" alt="logo" />*/}
      <h2 className='spring-mobile'>Coming to<span className='twin22'> Web3 </span>Spring 2022</h2>
      <video className="demovid-mobile" src={demovid} autoPlay loop muted/>
      <div className='cover-mobile'></div>

      <h2 id="roadmap" className="roadmap-mobile">Roadmap</h2>
      <p className="q1-mobile">Q1</p>
      <p className="q2-mobile">Q2</p>
      <p className="q3-mobile">Q3/Q4</p>
      {/* <p className="q4-mobile">Q4</p> */}
      <div className="timeline-mobile"></div>

      <ul className="list1-mobile">
        <li> Info Site Launch</li>
        <li className="tab1"> Colorpaper Release</li>
        <li className="tab2"> Community Building</li>
        <li className="tab3"> Pinescript Indicators</li>
      </ul>

      <ul className="list2-mobile">
        <li>Token Crowdsales</li>
        <li className="tab1">Visualization App</li>
        <li className="tab2">Airdrop Campaign</li>
        <li className="tab3">DAO Formations</li>
      </ul>

      <ul className="list3-mobile">
        <li>Stock Market Integration</li>
        <li className="tab1">Prediction Market Beta</li>
        <li className="tab2short">RGB NFT Drop</li>
        <li className="tab3short">Top Secret :)</li>
      </ul>

      <a href="https://twitter.com/hippo_labs" target="blank_" className="hippo-mobile">a project from HIPPO Labs &#8605;</a>

    </div>
    </div>
  );
}

export default Mobile;
