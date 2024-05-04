const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

import { getTokenBalance, getCROBalance } from "../Services";

/**
 * @dev endpoint for CRO Balance
 * 
 * @param address target used address
 */
app.get('/CRO-balance/:address', async (req: any, res: any) => {
    try {
        const { address } = req.params;
        const result = await getCROBalance(address);
        res.json({ result });
    } catch (error: any) {
        console.log("err.msg: ", error.message);
        res.status(500).json({ error: error.message });
    }
});

//BNB Smart Contract - 0xfA9343C3897324496A05fC75abeD6bAC29f8A40f
//Top BNB Holder - 0xfA9343C3897324496A05fC75abeD6bAC29f8A40f
//Taken from - https://cronoscan.com/token/0xfa9343c3897324496a05fc75abed6bac29f8a40f#balances
/**
 * @dev endpoint for crc20 token balance
 * 
 * @param contractAddress Which CRC20 balance to check for
 * @param address Which User to check for
 */
app.get('/CRC20-balance/:contractAddress/:address', async (req: any, res: any) => {
    try {
        const { contractAddress, address } = req.params;
        const balance = await getTokenBalance(contractAddress, address);
        res.json({ balance });
    } catch (error: any) {
        console.log("err.msg: ", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
