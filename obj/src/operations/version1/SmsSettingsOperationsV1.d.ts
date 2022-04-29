import { IReferences } from 'pip-services3-commons-nodex';
import { RestOperations } from 'pip-services3-rpc-nodex';
export declare class SmsSettingsOperationsV1 extends RestOperations {
    private _accountsClient;
    private _smsClient;
    constructor();
    setReferences(references: IReferences): void;
    getSmsSettings(req: any, res: any): Promise<void>;
    setSmsSettings(req: any, res: any): Promise<void>;
    resendVerification(req: any, res: any): Promise<void>;
    verifyPhone(req: any, res: any): Promise<void>;
}
