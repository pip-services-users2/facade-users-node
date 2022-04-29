import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex'; 
import { NotFoundException } from 'pip-services3-commons-nodex';

import { IAccountsClientV1 } from 'client-accounts-node';
import { AccountV1 } from 'client-accounts-node';
import { IEmailSettingsClientV1 } from 'client-emailsettings-node';
import { RestOperations } from 'pip-services3-rpc-nodex';


export class EmailSettingsOperationsV1 extends RestOperations {
    private _accountsClient: IAccountsClientV1;
    private _emailClient: IEmailSettingsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('service-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new Descriptor('service-emailsettings', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._emailClient = this._dependencyResolver.getOneRequired<IEmailSettingsClientV1>('emailsettings');
    }

    public async getEmailSettings(req: any, res: any): Promise<void> {
        let userId = req.route.params.user_id;

        try {
            let settings = await this._emailClient.getSettingsById(null, userId);
            this.sendResult(req, res, settings);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async setEmailSettings(req: any, res: any): Promise<void> {
        let userId = req.route.params.user_id;
        let settings = req.body || {};
        settings.id = userId;

        try {
            let settedSettings = await this._emailClient.setSettings(null, settings);
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

            await this._emailClient.resendVerification(
                null, account.id
            );

            this.sendEmptyResult(req, res);
        } catch(err) {
            this.sendError(req, res, err);
        }
    }

    public async verifyEmail(req: any, res: any): Promise<void> {
        let login = req.param('login');
        let code = req.param('code');
        let account: AccountV1;

        try {
            account = await this._accountsClient.getAccountByIdOrLogin(null, login);
            if (account == null) {
                throw new NotFoundException(
                    null,
                    'LOGIN_NOT_FOUND',
                    'Login ' + login + ' was not found'
                ).withDetails('login', login);
            }

            await this._emailClient.verifyEmail(
                null, account.id, code
            );

            this.sendEmptyResult(req, res);
        } catch(err) {
            this.sendError(req, res, err);
        }
    }
}