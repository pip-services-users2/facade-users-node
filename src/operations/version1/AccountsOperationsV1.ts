import { IdGenerator, IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { IAccountsClientV1 } from 'client-accounts-node';
import { AccountV1 } from 'client-accounts-node';
import { IPasswordsClientV1 } from 'client-passwords-node';
import { IEmailSettingsClientV1 } from 'client-emailsettings-node';
import { EmailSettingsV1 } from 'client-emailsettings-node';
import { ISmsSettingsClientV1 } from 'client-smssettings-node';
import { SmsSettingsV1 } from 'client-smssettings-node';
import { ISessionsClientV1 } from 'client-sessions-node';
import { RestOperations } from 'pip-services3-rpc-nodex';

export class AccountsOperationsV1 extends RestOperations {
    private _accountsClient: IAccountsClientV1;
    private _passwordsClient: IPasswordsClientV1;
    private _emailSettingsClient: IEmailSettingsClientV1;
    private _smsSettingsClient: ISmsSettingsClientV1;
    private _sessionsClient: ISessionsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('service-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new Descriptor('service-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new Descriptor('service-emailsettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('smssettings', new Descriptor('service-smssettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new Descriptor('service-sessions', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired<IPasswordsClientV1>('passwords');
        this._emailSettingsClient = this._dependencyResolver.getOneOptional<IEmailSettingsClientV1>('emailsettings');
        this._smsSettingsClient = this._dependencyResolver.getOneOptional<ISmsSettingsClientV1>('smssettings');
        this._sessionsClient = this._dependencyResolver.getOneRequired<ISessionsClientV1>('sessions');
    }

    public async getAccounts(req: any, res: any): Promise<void> {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        try {
            let page = await this._accountsClient.getAccounts(null, filter, paging);
            this.sendResult(req, res, page);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async getCurrentAccount(req: any, res: any): Promise<void> {
        let userId = req.user_id;

        try {
            let account = await this._accountsClient.getAccountById(null, userId);
            this.sendResult(req, res, account);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async getAccount(req: any, res: any): Promise<void> {
        let userId = req.route.params.account_id || req.route.params.user_id;
        try {
            let account = await this._accountsClient.getAccountById(null, userId);
            this.sendResult(req, res, account);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async createAccount(req: any, res: any): Promise<void> {
        let data = req.body;
        let password = data.password;

        // Create account
        let newAccount: AccountV1 = {
            id: IdGenerator.nextLong(),
            name: data.name,
            login: data.login || data.email, // Use email as login by default
            language: data.language,
            theme: data.theme,
            time_zone: data.time_zone,
            create_time: new Date(),
            active: true,
            about: null,
            custom_hdr: null,
            custom_dat: null
        };

        try {
            let account = await this._accountsClient.createAccount(null, newAccount);

            // Create password for the account
            if (password != null) {
                // Use provided password
                await this._passwordsClient.setPassword(null, account.id, password);
            } else {
                // Set temporary password
                password = await this._passwordsClient.setTempPassword(null, account.id);
            }
            (<any>account).password = password;

            // Create email settings for the account
            let email = data.email;
            let newEmailSettings = <EmailSettingsV1>{
                id: account.id,
                name: account.name,
                email: email,
                language: account.language
            };

            if (this._emailSettingsClient != null) {
                await this._emailSettingsClient.setSettings(null, newEmailSettings);
            }

            // Create sms settings for the account
            let phone = data.phone;
            let newSmsSettings = <SmsSettingsV1>{
                id: account.id,
                name: account.name,
                phone: phone,
                language: account.language
            };

            if (phone != null && this._smsSettingsClient != null) {
                await this._smsSettingsClient.setSettings(null, newSmsSettings);
            }

            this.sendCreatedResult(req, res, account);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async updateAccount(req: any, res: any): Promise<void> {
        let userId = req.route.params.account_id || req.route.params.user_id;
        let account = req.body;
        account.id = userId;

        try {
            // Update account
            let newAccount = await this._accountsClient.updateAccount(null, account);

            // Update session data
            if (newAccount && req.session_id && req.user
                && this._sessionsClient && req.user.id == newAccount.id) {
                let user = Object.assign(req.user, newAccount);
                await this._sessionsClient.updateSessionUser(null, req.session_id, user);
            }

            this.sendResult(req, res, newAccount);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async deleteAccount(req: any, res: any): Promise<void> {
        let userId = req.route.params.account_id || req.route.params.user_id;

        try {
            let account = await this._accountsClient.deleteAccountById(null, userId);
            this.sendDeletedResult(req, res, account);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }
}