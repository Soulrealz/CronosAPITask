const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

import { getTokenBalance, getCROBalance } from "./queryCronos";
import { RPCError } from "./RPCError";

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
        if (error instanceof RPCError) {
            res.status(500).json({
                message: error.userMessage,
                errorCode: error.errorCode,
                errorMessage: error.errorMessage
            });
        } else {
            res.status(400).json({ error: error.message});
        }
    }
});

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
        if (error instanceof RPCError) {
            res.status(500).json({
                message: error.userMessage,
                errorCode: error.errorCode,
                errorMessage: error.errorMessage
            });
        } else {
            res.status(400).json({ error: error.message});
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
