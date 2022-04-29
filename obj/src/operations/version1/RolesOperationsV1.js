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
exports.RolesOperationsV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class RolesOperationsV1 extends pip_services3_rpc_nodex_1.RestOperations {
    constructor() {
        super();
        this._dependencyResolver.put('roles', new pip_services3_commons_nodex_1.Descriptor('service-roles', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._rolesClient = this._dependencyResolver.getOneRequired('roles');
    }
    getUserRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.route.params.user_id;
            try {
                let roles = yield this._rolesClient.getRolesById(null, userId);
                this.sendResult(req, res, roles);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    grantUserRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.route.params.user_id;
            let roles = req.body;
            try {
                let grantRoles = yield this._rolesClient.grantRoles(null, userId, roles);
                this.sendResult(req, res, grantRoles);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    revokeUserRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = req.route.params.user_id;
            let roles = req.body;
            try {
                let revokedRoles = yield this._rolesClient.revokeRoles(null, userId, roles);
                this.sendResult(req, res, revokedRoles);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
}
exports.RolesOperationsV1 = RolesOperationsV1;
//# sourceMappingURL=RolesOperationsV1.js.map