const bitcoin = require('bitcoinjs-lib');
const express = require('express');
const axios = require('axios');
const cors = require('cors') 
const {NodeSSH} = require('node-ssh');

const ssh = new NodeSSH()

const app = express();
const port = 5000;
app.use(express.json())
app.use(cors()); 

ssh.connect({
   host: '172.19.100.27',
   username: 'stud',
   password: '***'
 })
 .then(() => {
   ssh.execCommand('bitcoin-cli estimatesmartfee 6', { cwd: '' }).then((result) => {
     console.log('STDOUT: ' + result.stdout);
     console.log('STDERR: ' + result.stderr);
   });
 });

app.get('/getEstimatedFee', async (req, res) => {
   if (!req.query.network || !req.query.numberOfReceivers || !req.query.feeType) {
     res.status(400).json({ error: 'Missing parameters' });
     return;
   }
   res.status(200).json({ estimatedFee: await estimateTransactionSize(req.query.network, req.query.numberOfReceivers, req.query.feeType) })
 });

async function estimateTransactionSize(network, numberOfReceivers, feeType) {
   const MAINNET = bitcoin.networks.MAINNET;
   const TESTNET = bitcoin.networks.testnet;
   
   if (network == "mainnet") {
      let fees;
      await axios.get('https://api.blockcypher.com/v1/btc/main', { params: {
         token: '29c050a002aa49cf85a24b4b749be326'
      } })
         .then(response => fees = response.data)
         .catch(error => console.log(error));
      const highFee = fees.high_fee_per_kb / 1000;
      const mediumFee = fees.medium_fee_per_kb / 1000;
      const lowFee = fees.low_fee_per_kb / 1000;

      const keyPair = bitcoin.ECPair.makeRandom({ network: MAINNET });
      let wif = keyPair.toWIF()
      let fkeyPair = bitcoin.ECPair.fromWIF(wif , MAINNET);
      let latestTx = 'b7efa37df6dac214d26c39d5d1931d9906c3b36b166c9372ec7da530e0eac951';
      var txb = new bitcoin.TransactionBuilder(MAINNET);
      let sendAmount = 150000;
      txb.addInput(latestTx, 1);
      for (i = 0; i < numberOfReceivers; i++) {
         txb.addOutput('1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71', sendAmount);
      }
      txb.addOutput('1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71', 1000);
      txb.sign(0, fkeyPair);
      let tx = txb.build();

      txSize = tx.virtualSize();
      let fee;

      switch (feeType) {
         case 'low':
            fee = lowFee;
            break;
         case 'medium':
            fee = mediumFee;
            break;
         case 'high':
            fee = highFee;
            break;
         default:
            return null;
      }
      return Math.ceil(txSize * fee);
   }
   if (network == "testnet") {
      let fees;
      await axios.get('https://api.blockcypher.com/v1/btc/test3', { params: {
         token: '29c050a002aa49cf85a24b4b749be326'
      } })
         .then(response => fees = response.data)
         .catch(error => console.log(error));
      const highFee = fees.high_fee_per_kb / 1000;
      const mediumFee = fees.medium_fee_per_kb / 1000;
      const lowFee = fees.low_fee_per_kb / 1000;

      const keyPair = bitcoin.ECPair.makeRandom({ network: TESTNET });
      let wif = keyPair.toWIF()
      let fkeyPair = bitcoin.ECPair.fromWIF(wif , TESTNET);
      let latestTx = 'e242ed6e6203fcf5567a75a4d804d8d400bf0450ced8bc1bb183469d80344431';
      var txb = new bitcoin.TransactionBuilder(TESTNET);
      let sendAmount = 150000;
      txb.addInput(latestTx, 1);
      for (i = 0; i < numberOfReceivers; i++) {
         txb.addOutput('tb1qfq7vlhtk2skjh50s8qjrdmnnzlqwd06h6uzw9k', sendAmount);
      }
      txb.addOutput('tb1qfq7vlhtk2skjh50s8qjrdmnnzlqwd06h6uzw9k', 1000);
      txb.sign(0, fkeyPair);
      let tx = txb.build();
      txSize = tx.virtualSize();
      let fee;

      switch (feeType) {
         case 'low':
            fee = lowFee;
            break;
         case 'medium':
            fee = mediumFee;
            break;
         case 'high':
            fee = highFee;
            break;
         default:
            return null;
      }
      return Math.ceil(txSize * fee);
   }
}

app.listen(port, '0.0.0.0', () => {
   console.log(`Application listening at http://0.0.0.0:${port}`);
 });
