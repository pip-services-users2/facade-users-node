import { IReferences } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { AboutOperations, RestService } from 'pip-services3-rpc-nodex';
import { AccountsOperationsV1, ActivitiesOperationsV1, EmailSettingsOperationsV1, PasswordsOperationsV1, RolesOperationsV1, SessionsOperationsV1, SmsSettingsOperationsV1 } from '../operations/version1';

import { AuthorizerV1 } from './AuthorizerV1';



export class FacadeServiceV1 extends RestService {
    private _aboutOperations = new AboutOperations();
    private _accountsOperations = new AccountsOperationsV1();
    private _activitiesOperations = new ActivitiesOperationsV1();
    private _emailSettingsOperations = new EmailSettingsOperationsV1();
    private _passwordsOperations = new PasswordsOperationsV1();
    private _rolesOperations = new RolesOperationsV1();
    private _sessionsOperations = new SessionsOperationsV1();
    private _smsSettingsOperationsV1 = new SmsSettingsOperationsV1();

    public constructor() {
        super();
        this._baseRoute = "api/v1";
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        
        this._aboutOperations.configure(config);
        this._activitiesOperations.configure(config);
        this._accountsOperations.configure(config);
        this._emailSettingsOperations.configure(config);
        this._passwordsOperations.configure(config);
        this._rolesOperations.configure(config);
        this._sessionsOperations.configure(config);
        this._smsSettingsOperationsV1.configure(config);
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._aboutOperations.setReferences(references);
        this._activitiesOperations.setReferences(references);
        this._accountsOperations.setReferences(references);
        this._emailSettingsOperations.setReferences(references);
        this._passwordsOperations.setReferences(references);
        this._rolesOperations.setReferences(references);
        this._sessionsOperations.setReferences(references);
        this._smsSettingsOperationsV1.setReferences(references);
    }

    public register(): void {
        let auth = new AuthorizerV1();

        // register charset middleware
        this.registerInterceptor('',
            (req, res, next) => {
                res.charSet('utf-8');
                next();
            });

        // Restore session middleware
        this.registerInterceptor('',
            (req, res, next) => { this._sessionsOperations.loadSession(req, res, next); });

        this.registerAdminRoutes(auth);
        this.registerUsersRoutes(auth);
    }

    private registerAdminRoutes(auth: AuthorizerV1): void {
        // About Route
        this.registerRouteWithAuth('get', '/about', null, auth.anybody(),
            (req, res) => { this._aboutOperations.about(req, res); });
    }

    private registerUsersRoutes(auth: AuthorizerV1): void {
        // Session Routes
        this.registerRouteWithAuth('post', '/users/signup', null, auth.anybody(),
            (req, res) => { this._sessionsOperations.signup(req, res); });
        this.registerRouteWithAuth('get', '/users/signup/validate', null, auth.anybody(),
            (req, res) => { this._sessionsOperations.signupValidate(req, res); });
        this.registerRouteWithAuth('post', '/users/signin', null, auth.anybody(),
            (req, res) => { this._sessionsOperations.signin(req, res); });
        this.registerRouteWithAuth('post', '/users/signout', null, auth.anybody(),
            (req, res) => { this._sessionsOperations.signout(req, res); });
        this.registerRouteWithAuth('get', '/users/sessions', null, auth.admin(),
            (req, res) => { this._sessionsOperations.getSessions(req, res); });
        this.registerRouteWithAuth('post', '/users/sessions/restore', null, auth.signed(),
            (req, res) => { this._sessionsOperations.restoreSession(req, res); });
        this.registerRouteWithAuth('get', '/users/sessions/current', null, auth.signed(),
            (req, res) => { this._sessionsOperations.getCurrentSession(req, res); });
        this.registerRouteWithAuth('get', '/users/:user_id/sessions', null, auth.ownerOrAdmin('user_id'),
            (req, res) => { this._sessionsOperations.getUserSessions(req, res); });
        this.registerRouteWithAuth('delete', '/users/:user_id/sessions/:session_id', null, auth.ownerOrAdmin('user_id'),
            (req, res) => { this._sessionsOperations.closeSession(req, res); });

        // Accounts Routes
        this.registerRouteWithAuth('get', '/users', null, auth.admin(),
            (req, res) => { this._accountsOperations.getAccounts(req, res); });
        this.registerRouteWithAuth('get', '/users/current', null, auth.signed(),
            (req, res) => { this._accountsOperations.getCurrentAccount(req, res); });
        this.registerRouteWithAuth('get', '/users/:user_id', null, auth.ownerOrAdmin('user_id'),
            (req, res) => { this._accountsOperations.getAccount(req, res); });
        this.registerRouteWithAuth('post', '/users', null, auth.admin(),
            (req, res) => { this._accountsOperations.createAccount(req, res); });
        this.registerRouteWithAuth('put', '/users/:user_id', null, auth.ownerOrAdmin('user_id'),
            (req, res) => { this._accountsOperations.updateAccount(req, res); });
        this.registerRouteWithAuth('delete', '/users/:user_id', null, auth.admin(),
            (req, res) => { this._accountsOperations.deleteAccount(req, res); });

        // Passwords Routes
        this.registerRouteWithAuth('post', '/users/passwords/recover', null, auth.anybody(),
            (req, res) => { this._passwordsOperations.recoverPassword(req, res); });
        this.registerRouteWithAuth('post', '/users/passwords/reset', null, auth.anybody(),
            (req, res) => { this._passwordsOperations.resetPassword(req, res); });
        this.registerRouteWithAuth('post', '/users/:user_id/passwords/change', null, auth.owner('user_id'),
            (req, res) => { this._passwordsOperations.changePassword(req, res); });

        // Roles Routes
        this.registerRouteWithAuth('get', '/users/:user_id/roles', null, auth.ownerOrAdmin('user_id'),
            (req, res) => { this._rolesOperations.getUserRoles(req, res); });
        this.registerRouteWithAuth('post', '/users/:user_id/roles/grant', null, auth.admin(),
            (req, res) => { this._rolesOperations.grantUserRoles(req, res); });
        this.registerRouteWithAuth('post', '/users/:user_id/roles/revoke', null, auth.admin(),
            (req, res) => { this._rolesOperations.revokeUserRoles(req, res); });
    }

}
