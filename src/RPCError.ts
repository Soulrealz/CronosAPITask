/**
 * @dev class designed to hold information related to RPC calls when they fail
 */
export class RPCError {
    userMessage: string;
    errorCode: string;
    errorMessage: string;

    constructor(userMessage: string, errorCode: string, errorMessage: string) {
        this.userMessage = userMessage;
        this.errorCode = errorCode;
        this.errorMessage = errorMessage;
    }
}