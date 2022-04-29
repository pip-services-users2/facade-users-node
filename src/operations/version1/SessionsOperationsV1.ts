import { ConfigParams } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex'; 

import { BadRequestException } from 'pip-services3-commons-nodex';
import { UnauthorizedException } from 'pip-services3-commons-nodex';
import { HttpRequestDetector, RestOperations } from 'pip-services3-rpc-nodex';

import { IAccountsClientV1 } from 'client-accounts-node';
import { AccountV1 } from 'client-accounts-node';
import { IPasswordsClientV1 } from 'client-passwords-node';
import { IRolesClientV1 } from 'client-roles-node';
import { ISessionsClientV1 } from 'client-sessions-node';
import { IEmailSettingsClientV1 } from 'client-emailsettings-node';
import { EmailSettingsV1 } from 'client-emailsettings-node';
import { ISmsSettingsClientV1 } from 'client-smssettings-node';
import { SmsSettingsV1 } from 'client-smssettings-node';

import { SessionUserV1 } from './SessionUserV1';

export class SessionsOperationsV1 extends RestOperations {
    private static _defaultConfig1 = ConfigParams.fromTuples(
        'options.cookie_enabled', true,
        'options.cookie', 'x-session-id',
        'options.max_cookie_age', 365 * 24 * 60 * 60 * 1000
    );

    private _cookie: string = 'x-session-id';
    private _cookieEnabled: boolean = true;
    private _maxCookieAge: number = 365 * 24 * 60 * 60 * 1000;

    private _accountsClient: IAccountsClientV1;
    private _sessionsClient: ISessionsClientV1;
    private _passwordsClient: IPasswordsClientV1;
    private _rolesClient: IRolesClientV1;
    private _emailSettingsClient: IEmailSettingsClientV1;
    private _smsSettingsClient: ISmsSettingsClientV1;
    
    public constructor() {
        super();

        this._dependencyResolver.put('accounts', new Descriptor('service-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new Descriptor('service-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('roles', new Descriptor('service-roles', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new Descriptor('service-emailsettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('smssettings', new Descriptor('service-smssettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new Descriptor('service-sessions', 'client', '*', '*', '1.0'));
    }

    public configure(config: ConfigParams): void {
        config = config.setDefaults(SessionsOperationsV1._defaultConfig1);
        this._dependencyResolver.configure(config);

        this._cookieEnabled = config.getAsBooleanWithDefault('options.cookie_enabled', this._cookieEnabled);
        this._cookie = config.getAsStringWithDefault('options.cookie', this._cookie);
        this._maxCookieAge = config.getAsLongWithDefault('options.max_cookie_age', this._maxCookieAge);
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._sessionsClient = this._dependencyResolver.getOneRequired<ISessionsClientV1>('sessions');
        this._accountsClient = this._dependencyResolver.getOneRequired<IAccountsClientV1>('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired<IPasswordsClientV1>('passwords');
        this._rolesClient = this._dependencyResolver.getOneOptional<IRolesClientV1>('roles');
        this._emailSettingsClient = this._dependencyResolver.getOneOptional<IEmailSettingsClientV1>('emailsettings');
        this._smsSettingsClient = this._dependencyResolver.getOneOptional<ISmsSettingsClientV1>('smssettings');
    }
    
    public async loadSession(req: any, res: any, next: () => void): Promise<void> {
        // Is user really cached? If yes, then we shall reinvalidate cache when connections are changed
        // if (req.user) {
        //     return req.user;
        // }

        // parse headers first, and if nothing in query
        // let sessionId = req.headers['x-session-id'] || req.query['ssid'];

        // parse headers first, and if nothing in headers get cookie
        let sessionId = req.headers['x-session-id'] || (req.cookies != null ? req.cookies[this._cookie] : null);
        
        if (sessionId != null) {
            try {
                let session = await this._sessionsClient.getSessionById('facade', sessionId);
                if (session == null) {
                    let err = new UnauthorizedException(
                        'facade',
                        'SESSION_NOT_FOUND',
                        'Session invalid or already expired.'
                    ).withDetails('session_id', sessionId).withStatus(440);
                    this.sendError(req, res, err);
                    return;
                }

                // Associate session user with the request
                req.user_id = session.user_id;
                req.user_name = session.user_name;
                req.user = session.user;
                req.session_id = session.id;
            } catch (err) {
                this.sendError(req, res, err);
                return;
            }
        }

        next();
    }

    public async openSession(req: any, res: any, account: AccountV1, roles: string[]): Promise<void> {
        try {
            let passwordInfo = await this._passwordsClient.getPasswordInfo(null, account.id);

            // You can take settings from user settings service
            // let settings = await this._settingsClient.getSectionById(null, account.id);

            // Open a new user session
            let user = <SessionUserV1>{
                id: account.id,
                name: account.name,
                login: account.login,
                create_time: account.create_time,
                time_zone: account.time_zone,
                language: account.language,
                theme: account.theme,
                roles: roles,
                settings: null, // <- set here predefined settings from external service,
                change_pwd_time: passwordInfo != null ? passwordInfo.change_time : null,
                custom_hdr: account.custom_hdr,
                custom_dat: account.custom_dat
            };

            let address = HttpRequestDetector.detectAddress(req);
            let client = HttpRequestDetector.detectBrowser(req);
            let platform = HttpRequestDetector.detectPlatform(req);

            let session = await this._sessionsClient.openSession(
                null, account.id, account.name,
                address, client, user, null
            );

            // Set cookie with session id
            if (session && this._cookieEnabled && res.cookie != null) {
                res.cookie(this._cookie, session.id, { maxAge: this._maxCookieAge });
            }
                
            
            this.sendResult(req, res, session);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async signup(req: any, res: any): Promise<void> {
        let signupData = req.body;
        let account: AccountV1 = null;

        // Validate password first
        // Todo: complete implementation after validate password is added

        // Create account
        let newAccount = <AccountV1> {
            name: signupData.name,
            login: signupData.login || signupData.email, // Use email by default
            language: signupData.language,
            theme: signupData.theme,
            time_zone: signupData.time_zone,
            // create_time: new Date(),
            // active: true,
            // about: null,
            // custom_hdr: null,
            // custom_dat: null
        };

        try {
            account = await this._accountsClient.createAccount(null, newAccount);

            // Create password for the account
            let password = signupData.password;
            await this._passwordsClient.setPassword(null, account.id, password);

            // Create email settings for the account
            let email = signupData.email;
            let newEmailSettings = <EmailSettingsV1>{
                id: account.id,
                name: account.name,
                email: email,
                language: account.language
            };

            if (this._emailSettingsClient != null) {
                await this._emailSettingsClient.setSettings(
                    null, newEmailSettings
                );
            }

            // Create sms settings for the account
            let phone = signupData.phone;
            let newSmsSettings = <SmsSettingsV1>{
                id: account.id,
                name: account.name,
                phone: phone,
                language: account.language
            };

            if (phone != null && this._emailSettingsClient != null) {
                await this._smsSettingsClient.setSettings(
                    null, newSmsSettings
                );
            }

            await this.openSession(req, res, account, []);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async signupValidate(req: any, res: any): Promise<void> {
        let login = req.param('login');

        if (login != null) {
            try {
                let account = await this._accountsClient.getAccountByIdOrLogin(null, login);
                if (account != null) {
                    let err = new BadRequestException(
                        null, 'LOGIN_ALREADY_USED',
                        'Login ' + login + ' already being used'
                    ).withDetails('login', login);
                    this.sendError(req, res, err);
                    return;
                }
            } catch (err) {
                this.sendError(req, res, err);
                return;
            }
        }

        this.sendEmptyResult(req, res);
    }

    public async signin(req: any, res: any): Promise<void> {
        let login = req.param('login');
        let password = req.param('password');

        let account: AccountV1;
        let roles: string[] = [];

        // Find user account
        try {
            account = await this._accountsClient.getAccountByIdOrLogin(null, login);
            if (account == null) {
                let err = new BadRequestException(
                    null,
                    'WRONG_LOGIN_OR_PASSWORD',
                    'Wrong login or password'
                ).withDetails('login', login);
                this.sendError(req, res, err);
                return;
            }

            // Authenticate user
            let result = await this._passwordsClient.authenticate(null, account.id, password);
            // wrong password error is UNKNOWN when use http client
            if (result == false) {
                let err = new BadRequestException(
                    null,
                    'WRONG_PASSWORD',
                    'Wrong password for account ' + login
                ).withDetails('login', login);
                this.sendError(req, res, err);
                return;
            }

            // Retrieve user roles
            if (this._rolesClient) {
                roles = await this._rolesClient.getRolesById(null, account.id);
            }
            await this.openSession(req, res, account, roles);

        } catch(err) {
            this.sendError(req, res, err);
        }
    }

    public async signout(req: any, res: any): Promise<void> {
        try {
            // Cleanup cookie with session id
            if (this._cookieEnabled && res.clearCookie)
                res.clearCookie(this._cookie);

            if (req.session_id) {
                await this._sessionsClient.closeSession(null, req.session_id);
            }
            this.sendEmptyResult(req, res);
        } catch(err) {
            this.sendError(req, res, err);
        }
    }

    public async getSessions(req: any, res: any): Promise<void> {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        try {
            let page = await await this._sessionsClient.getSessions(null, filter, paging);
            this.sendResult(req, res, page);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async restoreSession(req: any, res: any): Promise<void> {
        let sessionId = req.param('session_id');

        try {
            let session = await this._sessionsClient.getSessionById(null, sessionId);
            this.sendResult(req, res, session);
        } catch(err) {
            this.sendError(req, res, err);
        }
    }

    public async getUserSessions(req: any, res: any): Promise<void> {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let userId = req.route.params.user_id || req.route.params.account_id;
        filter.setAsObject('user_id', userId);

        try {
            let page = await this._sessionsClient.getSessions(null, filter, paging);
            this.sendResult(req, res, page);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async getCurrentSession(req: any, res: any): Promise<void> {
        // parse headers first, and if nothing in query
        // let sessionId = req.headers['x-session-id'] || req.query['ssid'];

        // parse headers first, and if nothing in headers get cookie
        let sessionId = req.headers['x-session-id'] || req.cookies[this._cookie];

        try {
            let session = await this._sessionsClient.getSessionById(null, sessionId);
            this.sendResult(req, res, session);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async closeSession(req: any, res: any): Promise<void> {
        let sessionId = req.route.params.session_id || req.param('session_id');

        try {
            let session = await this._sessionsClient.closeSession(null, sessionId);
            this.sendResult(req, res, session);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }
}