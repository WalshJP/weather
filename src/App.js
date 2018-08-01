import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const urlHelpers = {
    baseUrl: 'https://api.weatherbit.io/v2.0/current?&postal_code=',
    API_KEY_WBIT: 'd3d00860d6c141b3b1def1972c8f7731'
};

class WeatherInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const hiddenStyle = {
      margin: 500
    }
    const shownStyle = {
      margin: 100
    }
    if(this.props.show === 1)
    {
    return (
      <div style={shownStyle} id="info">
          <div id="temp">{this.props.temp}</div>
          <div id="conditions">{this.props.conditions}</div>
          <div id="loc">{this.props.loc}</div>
      </div>
    );
  }
    else {
    return (
      <div style={hiddenStyle} id="info">
          <div id="temp">{this.props.temp}</div>
          <div id="conditions">{this.props.conditions}</div>
          <div id="loc">{this.props.loc}</div>
      </div>
    );
  }
  }

}

class SearchBox extends React.Component{
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  handleChange(e) {
    console.log('handling change...');
    
    let zip = e.target.value;

    console.log('zip: ' + zip);

    this.props.onChange(zip);

  }
  render() {
    const startStyle = {
      margin: '30%'
    }
    const endStyle = {
      margin: '10%',
      transition: 'margin 1s'
    }
    if(this.props.showInfo === 0)
    {
    return (
    <div>
    <input style={startStyle} id="search" type="search" onChange={this.handleChange}/>
    </div>
    );
  }
  else {
    return (
    <div>
    <input style={endStyle} id="search" type="search" onChange={this.handleChange}/>
    </div>
    );    
  }
  }
}

class SearchBoxContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      zip: '',
      zipLength: 0,
    };
    this.updateZip = this.updateZip.bind(this);
    this.runApi = this.runApi.bind(this);
  }
  
  updateZip(newZip) {
    console.log('updating zip...');

    this.props.onUpdateInfo('','','',0);
    this.setState({zipLength: this.state.zipLength + 1});  
    this.setState({zip: newZip});
  }

  componentDidUpdate() {
    if(this.state.zipLength === 5) {
      this.runApi();
      this.setState({zipLength: 0});
      console.log('zipLength reset...');
    }
  }

  runApi() {
    console.log('running api...');
    let url = urlHelpers.baseUrl + this.state.zip + '&country=US&key=' + urlHelpers.API_KEY_WBIT;
    console.log(url);
    fetch(url)
    .then((response) => {
      return response.json();
    }).then((data) => {
      console.log(data);
      let temp = data['data']['0']['temp'];
      let conditions = data['data']['0']['weather']['description'];
      let loc = data['data']['0']['city_name'];

      var url = "http://colormind.io/api/";
      var data = {
        model : "default",
        input : [[44,43,44],[90,83,82],"N","N","N"]
      }

      var http = new XMLHttpRequest();

      http.onreadystatechange = function() {
        if(http.readyState == 4 && http.status == 200) {
          var palette = JSON.parse(http.responseText).result;
          console.log(palette);
        }
      }

      http.open("POST", url, true);
      http.send(JSON.stringify(data));

      this.props.onUpdateInfo(temp, conditions, loc, 1);
    })
  }    
  
  render() {
    return (
    <div>
    <SearchBox showInfo={this.props.showInfo} onChange={this.updateZip}/>
    </div>
    )
  }
  
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      temp: '',
      conditions: '',
      loc: '',
      showWeather: 0
    };
    this.handleInfoUpdate = this.handleInfoUpdate.bind(this);
  }

  handleInfoUpdate(temp, conditions, loc, showWeather) {
    let tmpTemp = ((temp * 9)/5) + 32;
    temp = Math.floor(tmpTemp);

    this.setState({temp: temp});
    this.setState({conditions: conditions});
    this.setState({loc: loc});
    this.setState({showWeather: showWeather});

    console.log('updated app state');
    console.log(this.state.showWeather);
  }

  render() {
    return (
      <div className="App">
        <SearchBoxContainer onUpdateInfo={this.handleInfoUpdate} showInfo={this.state.showWeather}/>
        <WeatherInfo temp={this.state.temp} conditions={this.state.conditions} loc={this.state.loc} show={this.state.showWeather}/>
      </div>
    );
  }
}

export default App;