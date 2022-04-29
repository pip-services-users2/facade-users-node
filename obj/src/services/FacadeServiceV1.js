"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacadeServiceV1 = void 0;
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const version1_1 = require("../operations/version1");
const AuthorizerV1_1 = require("./AuthorizerV1");
class FacadeServiceV1 extends pip_services3_rpc_nodex_1.RestService {
    constructor() {
        super();
        this._aboutOperations = new pip_services3_rpc_nodex_1.AboutOperations();
        this._accountsOperations = new version1_1.AccountsOperationsV1();
        this._activitiesOperations = new version1_1.ActivitiesOperationsV1();
        this._emailSettingsOperations = new version1_1.EmailSettingsOperationsV1();
        this._passwordsOperations = new version1_1.PasswordsOperationsV1();
        this._rolesOperations = new version1_1.RolesOperationsV1();
        this._sessionsOperations = new version1_1.SessionsOperationsV1();
        this._smsSettingsOperationsV1 = new version1_1.SmsSettingsOperationsV1();
        this._baseRoute = "api/v1";
    }
    configure(config) {
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
    setReferences(references) {
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
    register() {
        let auth = new AuthorizerV1_1.AuthorizerV1();
        // register charset middleware
        this.registerInterceptor('', (req, res, next) => {
            res.charSet('utf-8');
            next();
        });
        // Restore session middleware
        this.registerInterceptor('', (req, res, next) => { this._sessionsOperations.loadSession(req, res, next); });
        this.registerAdminRoutes(auth);
        this.registerUsersRoutes(auth);
    }
    registerAdminRoutes(auth) {
        // About Route
        this.registerRouteWithAuth('get', '/about', null, auth.anybody(), (req, res) => { this._aboutOperations.about(req, res); });
    }
    registerUsersRoutes(auth) {
        // Session Routes
        this.registerRouteWithAuth('post', '/users/signup', null, auth.anybody(), (req, res) => { this._sessionsOperations.signup(req, res); });
        this.registerRouteWithAuth('get', '/users/signup/validate', null, auth.anybody(), (req, res) => { this._sessionsOperations.signupValidate(req, res); });
        this.registerRouteWithAuth('post', '/users/signin', null, auth.anybody(), (req, res) => { this._sessionsOperations.signin(req, res); });
        this.registerRouteWithAuth('post', '/users/signout', null, auth.anybody(), (req, res) => { this._sessionsOperations.signout(req, res); });
        this.registerRouteWithAuth('get', '/users/sessions', null, auth.admin(), (req, res) => { this._sessionsOperations.getSessions(req, res); });
        this.registerRouteWithAuth('post', '/users/sessions/restore', null, auth.signed(), (req, res) => { this._sessionsOperations.restoreSession(req, res); });
        this.registerRouteWithAuth('get', '/users/sessions/current', null, auth.signed(), (req, res) => { this._sessionsOperations.getCurrentSession(req, res); });
        this.registerRouteWithAuth('get', '/users/:user_id/sessions', null, auth.ownerOrAdmin('user_id'), (req, res) => { this._sessionsOperations.getUserSessions(req, res); });
        this.registerRouteWithAuth('delete', '/users/:user_id/sessions/:session_id', null, auth.ownerOrAdmin('user_id'), (req, res) => { this._sessionsOperations.closeSession(req, res); });
        // Accounts Routes
        this.registerRouteWithAuth('get', '/users', null, auth.admin(), (req, res) => { this._accountsOperations.getAccounts(req, res); });
        this.registerRouteWithAuth('get', '/users/current', null, auth.signed(), (req, res) => { this._accountsOperations.getCurrentAccount(req, res); });
        this.registerRouteWithAuth('get', '/users/:user_id', null, auth.ownerOrAdmin('user_id'), (req, res) => { this._accountsOperations.getAccount(req, res); });
        this.registerRouteWithAuth('post', '/users', null, auth.admin(), (req, res) => { this._accountsOperations.createAccount(req, res); });
        this.registerRouteWithAuth('put', '/users/:user_id', null, auth.ownerOrAdmin('user_id'), (req, res) => { this._accountsOperations.updateAccount(req, res); });
        this.registerRouteWithAuth('delete', '/users/:user_id', null, auth.admin(), (req, res) => { this._accountsOperations.deleteAccount(req, res); });
        // Passwords Routes
        this.registerRouteWithAuth('post', '/users/passwords/recover', null, auth.anybody(), (req, res) => { this._passwordsOperations.recoverPassword(req, res); });
        this.registerRouteWithAuth('post', '/users/passwords/reset', null, auth.anybody(), (req, res) => { this._passwordsOperations.resetPassword(req, res); });
        this.registerRouteWithAuth('post', '/users/:user_id/passwords/change', null, auth.owner('user_id'), (req, res) => { this._passwordsOperations.changePassword(req, res); });
        // Roles Routes
        this.registerRouteWithAuth('get', '/users/:user_id/roles', null, auth.ownerOrAdmin('user_id'), (req, res) => { this._rolesOperations.getUserRoles(req, res); });
        this.registerRouteWithAuth('post', '/users/:user_id/roles/grant', null, auth.admin(), (req, res) => { this._rolesOperations.grantUserRoles(req, res); });
        this.registerRouteWithAuth('post', '/users/:user_id/roles/revoke', null, auth.admin(), (req, res) => { this._rolesOperations.revokeUserRoles(req, res); });
    }
}
exports.FacadeServiceV1 = FacadeServiceV1;
//# sourceMappingURL=FacadeServiceV1.js.map