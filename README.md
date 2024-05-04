# Solution to interview task
Program that uses RPC calls to connect to the Chronos blockchain in order to query balances of desired CRC20 tokens and CRO.

## How to run
1. Clone
2. Run npm install
3. Compile with:
`npx run build`
4. Run with:
`npm start`
5. Run tests with:
`npm test`

## How to test using curl
1. Run `npm start`
2. If you want to get CRO balance
`curl http://localhost:3000/CRO-balance/YOUR_ADDR`

Like so: `curl http://localhost:3000/CRO-balance/0xb3f60fcCa45267621b5767e10Eb275f2bb3c1058`

3. If you want to get CRC20 Balance
`curl http://localhost:3000/CRC20-balance/CONTRACT_ADDR/USER_ADDR`

Like so: `curl http://localhost:3000/CRC20-balance/0xfa9343c3897324496a05fc75abed6bac29f8a40f/0x3653e71eb8eb7904cb9d086a70b1a751d60d9473`