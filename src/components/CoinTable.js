import React, {PureComponent} from "react";
import axios from "axios";
import CoinRow from "./tabelRow.js"
import {Button} from "reactstrap"


export class CoinTable extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      topTenCoins: ["BTC-USD", "ETH-USD", "USDT-USD", "XRP-USD", "BUSD-USD", "ADA-USD", "SOL-USD", "DOT-USD", "DOGE-USD", "AVAX-USD"],
      coinsData: [],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  componentDidMount() {
    const context = this;
    let usdProducts;
    let coinsData = [];

    // get coin data to get an id to search for price data
    axios.get('https://api.exchange.coinbase.com/products').then(function(response) {
      usdProducts = response.data.filter((product) => {
        if (context.state.topTenCoins.includes(product.id)) {
          return product;
        }
      })
    }).then(function() {
      //  for each coin, use id to get price data
      usdProducts.forEach((coin)=> {
          axios.get(`https://api.exchange.coinbase.com/products/${coin.id}/stats`).then(function(response) {
            coinsData.push({
              "coinName": coin.id,
              "currentValue": response.data.last,
              "previousValue": 0,
              "changeValue": ''
            })
          })
      })
      context.setState({coinsData: coinsData})
    })
  }


  handleChange(event) {
    let name = event.target.name;
    let idx = this.state.coinsData.findIndex((object) => object.coinName === name)
    let copy = [...this.state.coinsData];
    copy[idx]["changeValue"] = copy[idx]["changeValue"] + event.nativeEvent.data;
    this.setState({coinsData: copy});
  }

  handleSubmit(event) {
    let copy = [...this.state.coinsData];
    copy.forEach((coin) => {
      coin["previousValue"] = coin["currentValue"];
      if (coin["changeValue"] !== '') {
        coin["currentValue"] = coin["changeValue"]
      }
      coin["changeValue"] = '';
    })
    this.setState({coinsData: copy})
  }



  render() {
    return (
      <div>
        <h3>
        The Cointable
        </h3>
        <form>
          <table className="table">
            <thead>
              <tr>
                  <th>Coin Name</th>
                  <th>Current Value</th>
                  <th>Previous Value</th>
                  <th>Update Value: </th>
              </tr>
            </thead>
            <tbody>
              <CoinRow coins={this.state.coinsData} onChange={this.handleChange}/>
            </tbody>
          </table>
          <Button className="submit_btn" onClick={this.handleSubmit}>Submit</Button>
        </form>
      </div>
    )
  }


}
export default CoinTable;
