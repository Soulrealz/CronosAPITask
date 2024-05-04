import axios from 'axios';
import Web3, { RpcError } from 'web3';
import dotenv from "dotenv";
import { isAddress } from 'web3-validator';
import { RPCError } from "./RPCError";
dotenv.config();

// Use value in .env or public testnet if no such value is found
const RPC_ENDPOINT: string = process.env.RPC || 'https://evm-t3.cronos.org'

/**
 * @dev interface that allows the modification of addresses
 * It is used to append 0x to the front of addresses that are lacking it.
 */
interface ModifiableAddress {
    value: string;
}

/**
 * @dev check if the given address is in a valid format
 * 
 * @param addressToValidate address to be checked
 * @returns true if the address is valid, false if invalid
 */
function isAddressValid(addressToValidate: ModifiableAddress): boolean {
    if (!isAddress(addressToValidate.value)) {
        return false;
    }

    // The above check will return true for addresses
    // that don't start with 0x but have a correct format nonetheless
    // 0x has to be added to make the rpc calls work
    if (!addressToValidate.value.startsWith("0x")) {
        addressToValidate.value = "0x" + addressToValidate.value;
    }

    return true;
}

/**
 * @dev throws error if the call has failed
 * 
 * @param data var that potentially contains error object with info on what happened
 */
function validateResponseData(data: any) {
    if ('error' in data) {
        throw new RPCError("Execution Failed", data.error.code, data.error.message);
    }
}

/**
 * @dev Balance results are in hex this function converts them to decimal
 * @param hexnumber number to convert
 * @returns converted number 
 */
function parseHexToDecimal(hexnumber: any): number {
    return parseInt(hexnumber, 16);
}

/**
 * @dev Get CRO balance of user
 * 
 * @param target_address address of user
 * @returns User CRO balance
 */
export async function getCROBalance(target_address: string) {
    const target: ModifiableAddress = { value: target_address };
    if (!isAddressValid(target)) {
        throw new Error(`Address, ${target.value}, is invalid`);
    }

    const response = await axios.post(RPC_ENDPOINT, {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [target.value, 'latest'],
        id: 1
    })
    validateResponseData(response.data);

    return parseHexToDecimal(response.data.result);
}


/**
 * @dev Provide CRC20 token address and a user address.
 * The balance of the user's specified CRC20 will be returned
 * 
 * @param contractAddress Which CRC20 balance to check for
 * @param address Which User to check for
 * @returns User CRC20 Balance
 */
export async function getTokenBalance(contractAddress: string, address: string): Promise<number> {
    const contract: ModifiableAddress = { value: contractAddress };
    const user: ModifiableAddress = { value: address };
    if (!isAddressValid(contract)) {
        throw new Error(`Contract Address, ${contract.value}, is invalid`);
    }
    if (!isAddressValid(user)) {
        throw new Error(`User Address, ${user.value}, is invalid`);
    }

    const encodedData = encodeData(user.value);

    const response = await axios.post(RPC_ENDPOINT, {
        jsonrpc: '2.0',
        method: 'eth_call',
        params: [{
            to: contract.value,
            data: encodedData,
        }, 'latest'],
        id: 1,
    });
    validateResponseData(response.data);

    return parseHexToDecimal(response.data.result);
}

/**
 * @dev Take address and encode the balanceOf selector and data
 * 
 * @param address - address to be encoded with the selector
 * @returns encoded selector + data
 */
function encodeData(address: string): string {
    // Needed for encoding
    const web3 = new Web3();
    const signature = 'balanceOf(address)';
    const selector = web3.eth.abi.encodeFunctionSignature(signature);
    const data = web3.eth.abi.encodeParameters(['address'], [address]);

    // Remove 0x from the address in data and return the combined selector + encoded data
    return selector + data.substring(2);
}

