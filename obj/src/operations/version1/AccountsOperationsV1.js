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
exports.AccountsOperationsV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class AccountsOperationsV1 extends pip_services3_rpc_nodex_1.RestOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services3_commons_nodex_2.Descriptor('service-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new pip_services3_commons_nodex_2.Descriptor('service-passwords', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new pip_services3_commons_nodex_2.Descriptor('service-emailsettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('smssettings', new pip_services3_commons_nodex_2.Descriptor('service-smssettings', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('sessions', new pip_services3_commons_nodex_2.Descriptor('service-sessions', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired('passwords');
        this._emailSettingsClient = this._dependencyResolver.getOneOptional('emailsettings');
        this._smsSettingsClient = this._dependencyResolver.getOneOptional('smssettings');
        this._sessionsClient = this._dependencyResolver.getOneRequired('sessions');
    }
    getAccounts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = this.getFilterParams(req);
            let paging = this.getPagingParams(req);
            try {
                let page = yield this._accountsClient.getAccounts(null, filter, paging);
                this.sendResult(req, res, page);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    getCurrentAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.user_id;
            try {
                let account = yield this._accountsClient.getAccountById(null, userId);
                this.sendResult(req, res, account);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    getAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.route.params.account_id || req.route.params.user_id;
            try {
                let account = yield this._accountsClient.getAccountById(null, userId);
                this.sendResult(req, res, account);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    createAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = req.body;
            let password = data.password;
            // Create account
            let newAccount = {
                id: pip_services3_commons_nodex_1.IdGenerator.nextLong(),
                name: data.name,
                login: data.login || data.email,
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
                let account = yield this._accountsClient.createAccount(null, newAccount);
                // Create password for the account
                if (password != null) {
                    // Use provided password
                    yield this._passwordsClient.setPassword(null, account.id, password);
                }
                else {
                    // Set temporary password
                    password = yield this._passwordsClient.setTempPassword(null, account.id);
                }
                account.password = password;
                // Create email settings for the account
                let email = data.email;
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
                let phone = data.phone;
                let newSmsSettings = {
                    id: account.id,
                    name: account.name,
                    phone: phone,
                    language: account.language
                };
                if (phone != null && this._smsSettingsClient != null) {
                    yield this._smsSettingsClient.setSettings(null, newSmsSettings);
                }
                this.sendCreatedResult(req, res, account);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    updateAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.route.params.account_id || req.route.params.user_id;
            let account = req.body;
            account.id = userId;
            try {
                // Update account
                let newAccount = yield this._accountsClient.updateAccount(null, account);
                // Update session data
                if (newAccount && req.session_id && req.user
                    && this._sessionsClient && req.user.id == newAccount.id) {
                    let user = Object.assign(req.user, newAccount);
                    yield this._sessionsClient.updateSessionUser(null, req.session_id, user);
                }
                this.sendResult(req, res, newAccount);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    deleteAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.route.params.account_id || req.route.params.user_id;
            try {
                let account = yield this._accountsClient.deleteAccountById(null, userId);
                this.sendDeletedResult(req, res, account);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
}
exports.AccountsOperationsV1 = AccountsOperationsV1;
//# sourceMappingURL=AccountsOperationsV1.js.map