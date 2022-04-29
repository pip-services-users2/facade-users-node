import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex'; 
import { NotFoundException } from 'pip-services3-commons-nodex';

import { IAccountsClientV1 } from 'client-accounts-node';
import { ISmsSettingsClientV1 } from 'client-smssettings-node';
import { RestOperations } from 'pip-services3-rpc-nodex';

export class SmsSettingsOperationsV1 extends RestOperations {
    private _accountsClient: IAccountsClientV1;
    private _smsClient: ISmsSettingsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('service-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('smssettings', new Descriptor('service-smssettings', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._smsClient = this._dependencyResolver.getOneRequired<ISmsSettingsClientV1>('smssettings');
    }

    public async getSmsSettings(req: any, res: any): Promise<void> {
        let userId = req.route.params.user_id;

        try {
            let settings = await this._smsClient.getSettingsById(null, userId);
            this.sendResult(req, res, settings);
        } catch(err) {
            this.sendError(req, res, err);
        }
    }

    public async setSmsSettings(req: any, res: any): Promise<void> {
        let userId = req.route.params.user_id;
        let settings = req.body || {};
        settings.id = userId;

        try {
            let settedSettings = await this._smsClient.setSettings(null, settings);
            this.sendResult(req, res, settedSettings);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async resendVerification(req: any, res: any): Promise<void> {
        let login = req.param('login');

        try {
            let account = await this._accountsClient.getAccountByIdOrLogin(null, login);
            if (account == null) {
                throw new NotFoundException(
                    null,
                    'LOGIN_NOT_FOUND',
                    'Login ' + login + ' was not found'
                ).withDetails('login', login);
            }

            await this._smsClient.resendVerification(null, account.id);

            this.sendEmptyResult(req, res);
        } catch(err) {
            this.sendError(req, res, err);
        }
    }

    public async verifyPhone(req: any, res: any): Promise<void> {
        let login = req.param('login');
        let code = req.param('code');

        try {
            let account = await this._accountsClient.getAccountByIdOrLogin(null, login);
            if (account == null) {
                throw new NotFoundException(
                    null,
                    'LOGIN_NOT_FOUND',
                    'Login ' + login + ' was not found'
                ).withDetails('login', login);
            }

            await this._smsClient.verifyPhone(null, account.id, code);

            this.sendEmptyResult(req, res)
        } catch(err) {
            this.sendError(req, res, err);
        }
    }
}