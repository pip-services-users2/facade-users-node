import { Descriptor } from 'pip-services3-commons-nodex';
import { RestService } from 'pip-services3-rpc-nodex';

import { SessionsOperationsV1 } from '../../src/operations/version1/SessionsOperationsV1';
import { AccountsOperationsV1 } from '../../src/operations/version1/AccountsOperationsV1';
import { ActivitiesOperationsV1 } from '../../src/operations/version1/ActivitiesOperationsV1';
import { PasswordsOperationsV1 } from '../../src/operations/version1/PasswordsOperationsV1';
import { RolesOperationsV1 } from '../../src/operations/version1/RolesOperationsV1';
import { EmailSettingsOperationsV1 } from '../../src/operations/version1/EmailSettingsOperationsV1';
import { SmsSettingsOperationsV1 } from '../../src/operations/version1/SmsSettingsOperationsV1';

export class TestFacadeService extends RestService {

    public constructor() {
        super();
        
        this._baseRoute = "api/v1";

        this._dependencyResolver.put('sessions', new Descriptor("pip-facade-users", "operations", "sessions", "*", "1.0"));
        this._dependencyResolver.put('accounts', new Descriptor("pip-facade-users", "operations", "accounts", "*", "1.0"));
        this._dependencyResolver.put('activities', new Descriptor("pip-facade-users", "operations", "activities", "*", "1.0"));
        this._dependencyResolver.put('passwords', new Descriptor("pip-facade-users", "operations", "passwords", "*", "1.0"));
        this._dependencyResolver.put('roles', new Descriptor("pip-facade-users", "operations", "roles", "*", "1.0"));
        this._dependencyResolver.put('email-settings', new Descriptor("pip-facade-users", "operations", "email-settings", "*", "1.0"));
        this._dependencyResolver.put('sms-settings', new Descriptor("pip-facade-users", "operations", "sms-settings", "*", "1.0"));
    }

    // Todo: Add proper authorization for testing
    public register(): void {
        let sessions = this._dependencyResolver.getOneOptional<SessionsOperationsV1>('sessions');
        if (sessions) {
            this.registerInterceptor('', (req, res, next) => sessions.loadSession(req, res, next));
            this.registerRoute('post', '/signup', null, (req, res) => sessions.signup(req, res));
            this.registerRoute('get', '/signup/validate', null, (req, res) => sessions.signupValidate(req, res));
            this.registerRoute('post', '/signin', null, (req, res) => sessions.signin(req, res));
            this.registerRoute('get', '/signout', null, (req, res) => sessions.signout(req, res));

            this.registerRoute('get', '/sessions', null, (req, res) => sessions.getSessions(req, res));
            this.registerRoute('post', '/sessions/restore', null, (req, res) => sessions.restoreSession(req, res));
            this.registerRoute('get', '/sessions/current', null, (req, res) => sessions.getCurrentSession(req, res));
            this.registerRoute('get', '/sessions/:user_id', null, (req, res) => sessions.getUserSessions(req, res));
            this.registerRoute('del', '/sessions/:session_id', null, (req, res) => sessions.closeSession(req, res));
        }

        let accounts = this._dependencyResolver.getOneOptional<AccountsOperationsV1>('accounts');
        if (accounts) {
            this.registerRoute('get', '/accounts', null, (req, res) => accounts.getAccounts(req, res));
            this.registerRoute('get', '/accounts/current', null, (req, res) => accounts.getCurrentAccount(req, res));
            this.registerRoute('get', '/accounts/:user_id', null, (req, res) => accounts.getAccount(req, res));
            this.registerRoute('post', '/accounts', null, (req, res) => accounts.createAccount(req, res));
            this.registerRoute('put', '/accounts/:user_id', null, (req, res) => accounts.updateAccount(req, res));
            this.registerRoute('del', '/accounts/:user_id', null, (req, res) => accounts.deleteAccount(req, res));
        }

        let activities = this._dependencyResolver.getOneOptional<ActivitiesOperationsV1>('activities');
        if (activities) {
            this.registerRoute('get', '/activities', null, (req, res) => activities.getActivities(req, res));
            this.registerRoute('get', '/activities/:party_id', null, (req, res) => activities.getPartyActivities(req, res));
            this.registerRoute('post', '/activities', null, (req, res) => activities.logPartyActivity(req, res));
        }

        let passwords = this._dependencyResolver.getOneOptional<PasswordsOperationsV1>('passwords');
        if (passwords) {
            this.registerRoute('post', '/passwords/recover', null, (req, res) => passwords.recoverPassword(req, res));
            this.registerRoute('post', '/passwords/reset', null, (req, res) => passwords.resetPassword(req, res));
            this.registerRoute('post', '/passwords/:user_id/change', null, (req, res) => passwords.changePassword(req, res));
        }

        let emailSettings = this._dependencyResolver.getOneOptional<EmailSettingsOperationsV1>('email-settings');
        if (emailSettings) {
            this.registerRoute('post', '/email_settings/resend', null, (req, res) => emailSettings.resendVerification(req, res));
            this.registerRoute('post', '/email_settings/verify', null, (req, res) => emailSettings.verifyEmail(req, res));
            this.registerRoute('get', '/email_settings/:user_id', null, (req, res) => emailSettings.getEmailSettings(req, res));
            this.registerRoute('put', '/email_settings/:user_id', null, (req, res) => emailSettings.setEmailSettings(req, res));
        }

        let smsSettings = this._dependencyResolver.getOneOptional<SmsSettingsOperationsV1>('sms-settings');
        if (smsSettings) {
            this.registerRoute('post', '/sms_settings/resend', null, (req, res) => smsSettings.resendVerification(req, res));
            this.registerRoute('post', '/sms_settings/verify', null, (req, res) => smsSettings.verifyPhone(req, res));
            this.registerRoute('get', '/sms_settings/:user_id', null, (req, res) => smsSettings.getSmsSettings(req, res));
            this.registerRoute('put', '/sms_settings/:user_id', null, (req, res) => smsSettings.setSmsSettings(req, res));
        }

        let roles = this._dependencyResolver.getOneOptional<RolesOperationsV1>('roles');
        if (roles) {
            this.registerRoute('get', '/roles/:user_id', null, (req, res) => roles.getUserRoles(req, res));
            this.registerRoute('post', '/roles/:user_id/grant', null, (req, res) => roles.grantUserRoles(req, res));
            this.registerRoute('post', '/roles/:user_id/revoke', null, (req, res) => roles.revokeUserRoles(req, res));
        }
    }

}