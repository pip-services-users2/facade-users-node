import { IReferences } from 'pip-services3-commons-nodex';
import { RestOperations } from 'pip-services3-rpc-nodex';
export declare class AccountsOperationsV1 extends RestOperations {
    private _accountsClient;
    private _passwordsClient;
    private _emailSettingsClient;
    private _smsSettingsClient;
    private _sessionsClient;
    constructor();
    setReferences(references: IReferences): void;
    getAccounts(req: any, res: any): Promise<void>;
    getCurrentAccount(req: any, res: any): Promise<void>;
    getAccount(req: any, res: any): Promise<void>;
    createAccount(req: any, res: any): Promise<void>;
    updateAccount(req: any, res: any): Promise<void>;
    deleteAccount(req: any, res: any): Promise<void>;
}
