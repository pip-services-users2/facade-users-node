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
exports.EmailSettingsOperationsV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class EmailSettingsOperationsV1 extends pip_services3_rpc_nodex_1.RestOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services3_commons_nodex_1.Descriptor('service-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('emailsettings', new pip_services3_commons_nodex_1.Descriptor('service-emailsettings', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._emailClient = this._dependencyResolver.getOneRequired('emailsettings');
    }
    getEmailSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.route.params.user_id;
            try {
                let settings = yield this._emailClient.getSettingsById(null, userId);
                this.sendResult(req, res, settings);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    setEmailSettings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.route.params.user_id;
            let settings = req.body || {};
            settings.id = userId;
            try {
                let settedSettings = yield this._emailClient.setSettings(null, settings);
                this.sendResult(req, res, settedSettings);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    resendVerification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let login = req.param('login');
            try {
                let account = yield this._accountsClient.getAccountByIdOrLogin(null, login);
                if (account == null) {
                    throw new pip_services3_commons_nodex_2.NotFoundException(null, 'LOGIN_NOT_FOUND', 'Login ' + login + ' was not found').withDetails('login', login);
                }
                yield this._emailClient.resendVerification(null, account.id);
                this.sendEmptyResult(req, res);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let login = req.param('login');
            let code = req.param('code');
            let account;
            try {
                account = yield this._accountsClient.getAccountByIdOrLogin(null, login);
                if (account == null) {
                    throw new pip_services3_commons_nodex_2.NotFoundException(null, 'LOGIN_NOT_FOUND', 'Login ' + login + ' was not found').withDetails('login', login);
                }
                yield this._emailClient.verifyEmail(null, account.id, code);
                this.sendEmptyResult(req, res);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
}
exports.EmailSettingsOperationsV1 = EmailSettingsOperationsV1;
//# sourceMappingURL=EmailSettingsOperationsV1.js.map