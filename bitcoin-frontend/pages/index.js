// Filename - App.js
// It contains the Form, its Structure
// and Basic Form Functionalities

import { React, useState } from "react";
import axios from "axios"

function App() {
    const [selectedNetwork, setSelectedNetwork] = useState("");
    const [selectedFeeType, setSelectedFeeType] = useState("");
    const [selectedNumberOfRecipients, setSelectedNumberOfRecipients] = useState(1);
    const [result, setResult] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios.get('http://localhost:5000/getEstimatedFee', { params: {
          network: selectedNetwork,
          feeType: selectedFeeType,
          numberOfReceivers: selectedNumberOfRecipients
        } }).then(res => {
          setResult(res.data.estimatedFee);
        })
      };

    const handleReset = () => {
        setSelectedNetwork("");
        setSelectedFeeType("");
        setSelectedNumberOfRecipients(1);
    };

    return (
        <div className="App">
            <h1>Bitcoin Fee Estimation Tool</h1>
            <fieldset>
                <form action="#" method="get">
                    <label>Select Network</label>
                    <select
                        name="select"
                        id="select"
                        value={selectedNetwork}
                        onChange={(e) =>
                          setSelectedNetwork(
                                e.target.value
                            )
                        }
                        required={true}
                    >
                        <option
                            value=""
                            disabled
                            selected={selectedNetwork === ""}
                        >
                            Select Network
                        </option>
                        <option value="mainnet">Mainnet</option>
                        <option value="testnet">Testnet</option>
                    </select>
                    
                    <label>Select desired completion time</label>
                    <select
                        name="select"
                        id="select"
                        value={selectedFeeType}
                        onChange={(e) =>
                          setSelectedFeeType(
                                e.target.value
                            )
                        }
                        required={true}
                    >
                        <option
                            value=""
                            disabled
                            selected={selectedFeeType === ""}
                        >
                            Select desired completion time
                        </option>
                        <option value="high">Fast (1-2 blocks)</option>
                        <option value="medium">Medium (3-6 blocks)</option>
                        <option value="low">Slow (7+blocks)</option>
                    </select>

                    <label>Select number of recipients</label>
                    <input 
                      type="number"
                      min="1"
                      max="10"
                      value={selectedNumberOfRecipients}
                      onChange={(e) =>
                        setSelectedNumberOfRecipients(
                              e.target.value
                          )
                      }
                    />

                    <button
                        type="reset"
                        value="reset"
                        onClick={() => handleReset()}
                    >
                        Reset
                    </button>
                    <button
                        type="submit"
                        value="Submit"
                        disabled={selectedFeeType == "" || selectedNetwork == "" || selectedNumberOfRecipients == undefined}
                        onClick={(e) => handleSubmit(e)}
                    >
                        Submit
                    </button>
                </form>
                {result ? <div className="result"><h1>Estimated fee: {result} Satoshi (~{Math.ceil(result * 0.02616) / 100}$)</h1></div> : ''}
            </fieldset>
            <style jsx>{`

        body {
          background: #f3f3f3;
          text-align: center;
        }
        .App {
          background-color: #fff;
          border-radius: 15px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
          padding: 10px 20px;
          transition: transform 0.2s;
          width: 500px;
          text-align: center;
          margin: auto;
          margin-top: 20px;
        }
        
        h1 {
          font-size: x-large;
          text-align: center;
          color: #327c35;
        }
        
        fieldset {
          border: none;
        }
        
        input {
          display: block;
          width: 100%;
          padding: 8px;
          box-sizing: border-box;
          border: 1px solid #ddd;
          border-radius: 3px;
          font-size: 12px;
        }

        select {
          display: block;
          width: 100%;
          margin-bottom: 15px;
          padding: 10px;
          box-sizing: border-box;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        label {
          font-size: 15px;
          display: block;
          width: 100%;
          margin-top: 8px;
          margin-bottom: 5px;
          text-align: left;
          color: #555;
          font-weight: bold;
        }
        
        button {
          padding: 15px;
          border-radius: 10px;
          margin: 15px;
          border: none;
          color: white;
          cursor: pointer;
          background-color: #4caf50;
          width: 40%;
          font-size: 16px;
        }

        button:disabled,
        button[disabled]{
          border: 1px solid #999999;
          background-color: #cccccc;
          color: #666666;
        }
        
      `}</style>
        </div>
    );
}

export default App;
