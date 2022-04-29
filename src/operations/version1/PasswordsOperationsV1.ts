import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex'; 
import { NotFoundException } from 'pip-services3-commons-nodex';

import { IAccountsClientV1 } from 'client-accounts-node';
import { AccountV1 } from 'client-accounts-node';
import { IPasswordsClientV1 } from 'client-passwords-node';
import { RestOperations } from 'pip-services3-rpc-nodex';

export class PasswordsOperationsV1 extends RestOperations {
    private _accountsClient: IAccountsClientV1;
    private _passwordsClient: IPasswordsClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('service-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new Descriptor('service-passwords', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired<IPasswordsClientV1>('passwords');
    }

    public async recoverPassword(req: any, res: any): Promise<void> {
        let login = req.param('login');
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

            await this._passwordsClient.recoverPassword(
                null, account.id
            );

            this.sendEmptyResult(req, res);
        } catch(err) {
            this.sendError(req, res, err);
        }
    }

    public async resetPassword(req: any, res: any): Promise<void> {
        let login = req.param('login');
        let code = req.param('code');
        let password = req.param('password');
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

            await this._passwordsClient.resetPassword(
                null, account.id, code, password
            );

            this.sendEmptyResult(req, res);
        } catch(err) {
            this.sendError(req, res, err);
        }
    }

    public async changePassword(req: any, res: any): Promise<void> {
        let userId = req.route.params.user_id;
        let oldPassword = req.param('old_password');
        let newPassword = req.param('new_password');

        try {
            await this._passwordsClient.changePassword(
                null, userId, oldPassword, newPassword
            );

            this.sendEmptyResult(req, res);
        } catch(err) {
            this.sendError(req, res, err);
        }
        
    }

}