"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizerV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_rpc_nodex_2 = require("pip-services3-rpc-nodex");
const pip_services3_rpc_nodex_3 = require("pip-services3-rpc-nodex");
class AuthorizerV1 {
    constructor() {
        this.basicAuth = new pip_services3_rpc_nodex_2.BasicAuthManager();
        this.roleAuth = new pip_services3_rpc_nodex_3.RoleAuthManager();
    }
    // Anybody who entered the system
    anybody() {
        return this.basicAuth.anybody();
    }
    // Only registered and authenticated users
    signed() {
        return this.basicAuth.signed();
    }
    // Only the user itself
    owner(idParam = 'user_id') {
        return this.access(idParam, [], 'NOT_OWNER', 'Only user owner access is allowed');
    }
    // System administrator
    admin() {
        return this.roleAuth.userInRole('admin');
    }
    // User owner, its substitute or system administrator
    ownerOrAdmin(idParam = 'user_id') {
        return this.access(idParam, ['admin'], 'NOT_OWNER_OR_ADMIN', 'Only user owner or system administrator access is allowed');
    }
    access(idParam = 'user_id', roles, code, message) {
        return (req, res, next) => {
            let user = req.user;
            let userId = req.params[idParam] || req.param(idParam);
            if (user == null) {
                pip_services3_rpc_nodex_1.HttpResponseSender.sendError(req, res, new pip_services3_commons_nodex_1.UnauthorizedException(null, 'NOT_SIGNED', 'User must be signed in to perform this operation').withStatus(401));
            }
            else if (userId == null) {
                pip_services3_rpc_nodex_1.HttpResponseSender.sendError(req, res, new pip_services3_commons_nodex_1.UnauthorizedException(null, 'NO_PARTY_ID', 'User id is not defined').withStatus(401));
            }
            else {
                let isOwner = userId == user.id;
                let isInRole = user.roles.find((role) => {
                    return roles.includes(role);
                }) != null;
                let authorized = isOwner || isInRole;
                if (!authorized) {
                    pip_services3_rpc_nodex_1.HttpResponseSender.sendError(req, res, new pip_services3_commons_nodex_1.UnauthorizedException(null, code, message).withDetails('user_id', userId).withStatus(403));
                }
                else {
                    next();
                }
            }
        };
    }
}
exports.AuthorizerV1 = AuthorizerV1;
//# sourceMappingURL=AuthorizerV1.js.map