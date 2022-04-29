"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsOperationsV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class SessionsOperationsV1 extends pip_services3_rpc_nodex_1.RestOperations {
    constructor() {
        super();
        this._cookie = 'x-session-id';
        this._cookieEnabled = true;
        this._maxCookieAge = 365 * 24 * 60 * 60 * 1000;
        this._dependencyResolver.put('accounts', new pip_services3_commons_nodex_2.Descriptor('service-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new pip_services3_commons_nodex_2.Descriptor('service-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('roles', new pip_services3_commons_nodex_2.Descriptor('service-roles', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new pip_services3_commons_nodex_2.Descriptor('service-emailsettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('smssettings', new pip_services3_commons_nodex_2.Descriptor('service-smssettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new pip_services3_commons_nodex_2.Descriptor('service-sessions', 'client', '*', '*', '1.0'));
    }
    configure(config) {
        config = config.setDefaults(SessionsOperationsV1._defaultConfig1);
        this._dependencyResolver.configure(config);
        this._cookieEnabled = config.getAsBooleanWithDefault('options.cookie_enabled', this._cookieEnabled);
        this._cookie = config.getAsStringWithDefault('options.cookie', this._cookie);
        this._maxCookieAge = config.getAsLongWithDefault('options.max_cookie_age', this._maxCookieAge);
    }
    setReferences(references) {
        super.setReferences(references);
        this._sessionsClient = this._dependencyResolver.getOneRequired('sessions');
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired('passwords');
        this._rolesClient = this._dependencyResolver.getOneOptional('roles');
        this._emailSettingsClient = this._dependencyResolver.getOneOptional('emailsettings');
        this._smsSettingsClient = this._dependencyResolver.getOneOptional('smssettings');
    }
    loadSession(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    let session = yield this._sessionsClient.getSessionById('facade', sessionId);
                    if (session == null) {
                        let err = new pip_services3_commons_nodex_4.UnauthorizedException('facade', 'SESSION_NOT_FOUND', 'Session invalid or already expired.').withDetails('session_id', sessionId).withStatus(440);
                        this.sendError(req, res, err);
                        return;
                    }
                    // Associate session user with the request
                    req.user_id = session.user_id;
                    req.user_name = session.user_name;
                    req.user = session.user;
                    req.session_id = session.id;
                }
                catch (err) {
                    this.sendError(req, res, err);
                    return;
                }
            }
            next();
        });
    }
    openSession(req, res, account, roles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let passwordInfo = yield this._passwordsClient.getPasswordInfo(null, account.id);
                // You can take settings from user settings service
                // let settings = await this._settingsClient.getSectionById(null, account.id);
                // Open a new user session
                let user = {
                    id: account.id,
                    name: account.name,
                    login: account.login,
                    create_time: account.create_time,
                    time_zone: account.time_zone,
                    language: account.language,
                    theme: account.theme,
                    roles: roles,
                    settings: null,
                    change_pwd_time: passwordInfo != null ? passwordInfo.change_time : null,
                    custom_hdr: account.custom_hdr,
                    custom_dat: account.custom_dat
                };
                let address = pip_services3_rpc_nodex_1.HttpRequestDetector.detectAddress(req);
                let client = pip_services3_rpc_nodex_1.HttpRequestDetector.detectBrowser(req);
                let platform = pip_services3_rpc_nodex_1.HttpRequestDetector.detectPlatform(req);
                let session = yield this._sessionsClient.openSession(null, account.id, account.name, address, client, user, null);
                // Set cookie with session id
                if (session && this._cookieEnabled && res.cookie != null) {
                    res.cookie(this._cookie, session.id, { maxAge: this._maxCookieAge });
                }
                this.sendResult(req, res, session);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    signup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let signupData = req.body;
            let account = null;
            // Validate password first
            // Todo: complete implementation after validate password is added
            // Create account
            let newAccount = {
                name: signupData.name,
                login: signupData.login || signupData.email,
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
                account = yield this._accountsClient.createAccount(null, newAccount);
                // Create password for the account
                let password = signupData.password;
                yield this._passwordsClient.setPassword(null, account.id, password);
                // Create email settings for the account
                let email = signupData.email;
                let newEmailSettings = {
                    id: account.id,
                    name: account.name,
                    email: email,
                    language: account.language
                };
                if (this._emailSettingsClient != null) {
                    yield this._emailSettingsClient.setSettings(null, newEmailSettings);
                }
                // Create sms settings for the account
                let phone = signupData.phone;
                let newSmsSettings = {
                    id: account.id,
                    name: account.name,
                    phone: phone,
                    language: account.language
                };
                if (phone != null && this._emailSettingsClient != null) {
                    yield this._smsSettingsClient.setSettings(null, newSmsSettings);
                }
                yield this.openSession(req, res, account, []);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    signupValidate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let login = req.param('login');
            if (login != null) {
                try {
                    let account = yield this._accountsClient.getAccountByIdOrLogin(null, login);
                    if (account != null) {
                        let err = new pip_services3_commons_nodex_3.BadRequestException(null, 'LOGIN_ALREADY_USED', 'Login ' + login + ' already being used').withDetails('login', login);
                        this.sendError(req, res, err);
                        return;
                    }
                }
                catch (err) {
                    this.sendError(req, res, err);
                    return;
                }
            }
            this.sendEmptyResult(req, res);
        });
    }
    signin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let login = req.param('login');
            let password = req.param('password');
            let account;
            let roles = [];
            // Find user account
            try {
                account = yield this._accountsClient.getAccountByIdOrLogin(null, login);
                if (account == null) {
                    let err = new pip_services3_commons_nodex_3.BadRequestException(null, 'WRONG_LOGIN_OR_PASSWORD', 'Wrong login or password').withDetails('login', login);
                    this.sendError(req, res, err);
                    return;
                }
                // Authenticate user
                let result = yield this._passwordsClient.authenticate(null, account.id, password);
                // wrong password error is UNKNOWN when use http client
                if (result == false) {
                    let err = new pip_services3_commons_nodex_3.BadRequestException(null, 'WRONG_PASSWORD', 'Wrong password for account ' + login).withDetails('login', login);
                    this.sendError(req, res, err);
                    return;
                }
                // Retrieve user roles
                if (this._rolesClient) {
                    roles = yield this._rolesClient.getRolesById(null, account.id);
                }
                yield this.openSession(req, res, account, roles);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    signout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Cleanup cookie with session id
                if (this._cookieEnabled && res.clearCookie)
                    res.clearCookie(this._cookie);
                if (req.session_id) {
                    yield this._sessionsClient.closeSession(null, req.session_id);
                }
                this.sendEmptyResult(req, res);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    getSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = this.getFilterParams(req);
            let paging = this.getPagingParams(req);
            try {
                let page = yield yield this._sessionsClient.getSessions(null, filter, paging);
                this.sendResult(req, res, page);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    restoreSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let sessionId = req.param('session_id');
            try {
                let session = yield this._sessionsClient.getSessionById(null, sessionId);
                this.sendResult(req, res, session);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    getUserSessions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = this.getFilterParams(req);
            let paging = this.getPagingParams(req);
            let userId = req.route.params.user_id || req.route.params.account_id;
            filter.setAsObject('user_id', userId);
            try {
                let page = yield this._sessionsClient.getSessions(null, filter, paging);
                this.sendResult(req, res, page);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    getCurrentSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // parse headers first, and if nothing in query
            // let sessionId = req.headers['x-session-id'] || req.query['ssid'];
            // parse headers first, and if nothing in headers get cookie
            let sessionId = req.headers['x-session-id'] || req.cookies[this._cookie];
            try {
                let session = yield this._sessionsClient.getSessionById(null, sessionId);
                this.sendResult(req, res, session);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    closeSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let sessionId = req.route.params.session_id || req.param('session_id');
            try {
                let session = yield this._sessionsClient.closeSession(null, sessionId);
                this.sendResult(req, res, session);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
}
exports.SessionsOperationsV1 = SessionsOperationsV1;
SessionsOperationsV1._defaultConfig1 = pip_services3_commons_nodex_1.ConfigParams.fromTuples('options.cookie_enabled', true, 'options.cookie', 'x-session-id', 'options.max_cookie_age', 365 * 24 * 60 * 60 * 1000);
//# sourceMappingURL=SessionsOperationsV1.js.map