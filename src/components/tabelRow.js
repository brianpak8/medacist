import React, {PureComponent} from 'react';

function CoinRow(props) {
  
  let coins = props.coins.sort((a, b) => parseFloat(b["currentValue"]) - parseFloat(a["currentValue"]));
  return coins.map((coin, idx) => {
    return(
      <React.Fragment key={idx}>
        <tr>
          <td>{coin["coinName"]}</td>
          <td>{coin["currentValue"]}</td>
          {coin["previousValue"] === 0  ? <td>{''}</td> : <td>{coin["previousValue"]}</td>}
          <input name={coin["coinName"]} onKeyPress={props.onKeyPress} onChange={props.onChange}value={coin["changeValue"]}></input>
        </tr>
      </React.Fragment>
    )
  })
}

export default CoinRow;
