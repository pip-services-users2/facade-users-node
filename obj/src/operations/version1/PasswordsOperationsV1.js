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
exports.PasswordsOperationsV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class PasswordsOperationsV1 extends pip_services3_rpc_nodex_1.RestOperations {
    constructor() {
        super();
        this._dependencyResolver.put('accounts', new pip_services3_commons_nodex_1.Descriptor('service-accounts', 'client', '*', '*', '1.0'));
        this._dependencyResolver.put('passwords', new pip_services3_commons_nodex_1.Descriptor('service-passwords', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._accountsClient = this._dependencyResolver.getOneRequired('accounts');
        this._passwordsClient = this._dependencyResolver.getOneRequired('passwords');
    }
    recoverPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let login = req.param('login');
            let account;
            try {
                account = yield this._accountsClient.getAccountByIdOrLogin(null, login);
                if (account == null) {
                    throw new pip_services3_commons_nodex_2.NotFoundException(null, 'LOGIN_NOT_FOUND', 'Login ' + login + ' was not found').withDetails('login', login);
                }
                yield this._passwordsClient.recoverPassword(null, account.id);
                this.sendEmptyResult(req, res);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let login = req.param('login');
            let code = req.param('code');
            let password = req.param('password');
            let account;
            try {
                account = yield this._accountsClient.getAccountByIdOrLogin(null, login);
                if (account == null) {
                    throw new pip_services3_commons_nodex_2.NotFoundException(null, 'LOGIN_NOT_FOUND', 'Login ' + login + ' was not found').withDetails('login', login);
                }
                yield this._passwordsClient.resetPassword(null, account.id, code, password);
                this.sendEmptyResult(req, res);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.route.params.user_id;
            let oldPassword = req.param('old_password');
            let newPassword = req.param('new_password');
            try {
                yield this._passwordsClient.changePassword(null, userId, oldPassword, newPassword);
                this.sendEmptyResult(req, res);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
}
exports.PasswordsOperationsV1 = PasswordsOperationsV1;
//# sourceMappingURL=PasswordsOperationsV1.js.map