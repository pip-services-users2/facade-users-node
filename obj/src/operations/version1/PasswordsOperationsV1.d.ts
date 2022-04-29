import { IReferences } from 'pip-services3-commons-nodex';
import { RestOperations } from 'pip-services3-rpc-nodex';
export declare class PasswordsOperationsV1 extends RestOperations {
    private _accountsClient;
    private _passwordsClient;
    constructor();
    setReferences(references: IReferences): void;
    recoverPassword(req: any, res: any): Promise<void>;
    resetPassword(req: any, res: any): Promise<void>;
    changePassword(req: any, res: any): Promise<void>;
}
