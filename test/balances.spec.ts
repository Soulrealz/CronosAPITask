
const chai = require('chai')
chai.use(require('chai-as-promised'))
const expect = chai.expect;

import { assert } from "chai";
import { getCROBalance, getTokenBalance } from "../src/queryCronos";

describe("CRC20 Token Balance", () => {
    // Taken from: https://cronoscan.com/token/0xfa9343c3897324496a05fc75abed6bac29f8a40f#balances
    const bnb: string = "0xfa9343c3897324496a05fc75abed6bac29f8a40f";
    const bnbHolder: string = "0x3653e71eb8eb7904cb9d086a70b1a751d60d9473";

    it("Should not fetch balance", async () => {
        // Test with invalid addresses
        await expect(getTokenBalance(bnb, "1")).to.eventually.be.rejectedWith(Error, 'User Address, 1, is invalid');
        await expect(getTokenBalance("2", bnbHolder)).to.eventually.be.rejectedWith(Error, 'Contract Address, 2, is invalid');
    })

    it("Should fetch balance", async () => {
        const balance: number = await getTokenBalance(bnb, bnbHolder);
        assert(balance > 0);
    })
})

describe("CRO Balance", () => {
    // Taken from: https://cronoscan.com/address/0xb3f60fcCa45267621b5767e10Eb275f2bb3c1058
    const croHolder: string = "0xb3f60fcCa45267621b5767e10Eb275f2bb3c1058";

    it("Should not fetch balance", async () => {
        await expect(getCROBalance("1")).to.eventually.be.rejectedWith(Error, 'Address, 1, is invalid');
    })

    it("Should fetch balance", async () => {
        const balance: number = await getCROBalance(croHolder);
        assert(balance > 0);
    })
})