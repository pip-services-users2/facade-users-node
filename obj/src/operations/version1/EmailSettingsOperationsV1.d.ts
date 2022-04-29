import { IReferences } from 'pip-services3-commons-nodex';
import { RestOperations } from 'pip-services3-rpc-nodex';
export declare class EmailSettingsOperationsV1 extends RestOperations {
    private _accountsClient;
    private _emailClient;
    constructor();
    setReferences(references: IReferences): void;
    getEmailSettings(req: any, res: any): Promise<void>;
    setEmailSettings(req: any, res: any): Promise<void>;
    resendVerification(req: any, res: any): Promise<void>;
    verifyEmail(req: any, res: any): Promise<void>;
}
