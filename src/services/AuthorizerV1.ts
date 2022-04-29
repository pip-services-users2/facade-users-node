import { UnauthorizedException } from 'pip-services3-commons-nodex';
import { HttpResponseSender } from 'pip-services3-rpc-nodex';
import { BasicAuthManager } from 'pip-services3-rpc-nodex';
import { RoleAuthManager } from 'pip-services3-rpc-nodex';

export class AuthorizerV1 {
    private basicAuth = new BasicAuthManager();
    private roleAuth = new RoleAuthManager();

    // Anybody who entered the system
    public anybody(): (req: any, res: any, next: () => void) => void {
        return this.basicAuth.anybody();
    }

    // Only registered and authenticated users
    public signed(): (req: any, res: any, next: () => void) => void {
        return this.basicAuth.signed();
    }

    // Only the user itself
    public owner(idParam: string = 'user_id'): (req: any, res: any, next: () => void) => void {
        return this.access(
            idParam, [],
            'NOT_OWNER', 'Only user owner access is allowed'
        );
    }

    // System administrator
    public admin(): (req: any, res: any, next: () => void) => void {
         return this.roleAuth.userInRole('admin');
    }

    // User owner, its substitute or system administrator
    public ownerOrAdmin(idParam: string = 'user_id'): (req: any, res: any, next: () => void) => void {
        return this.access(
            idParam, ['admin'],
            'NOT_OWNER_OR_ADMIN', 'Only user owner or system administrator access is allowed'
        );
    }

    private access(idParam: string = 'user_id', roles: string[],
        code: string, message: string): (req: any, res: any, next: () => void) => void {
        return (req, res, next) => {
            let user = req.user;
            let userId = req.params[idParam] || req.param(idParam);
            if (user == null) {
                HttpResponseSender.sendError(
                    req, res,
                    new UnauthorizedException(
                        null, 'NOT_SIGNED',
                        'User must be signed in to perform this operation'
                    ).withStatus(401)
                );
            } else if (userId == null) {
                HttpResponseSender.sendError(
                    req, res,
                    new UnauthorizedException(
                        null, 'NO_PARTY_ID',
                        'User id is not defined'
                    ).withStatus(401)
                );
            } else {
                let isOwner = userId == user.id;
                
                let isInRole = user.roles.find((role) => {
                    return roles.includes(role)
                }) != null;

                let authorized = isOwner || isInRole;

                if (!authorized) {
                    HttpResponseSender.sendError(
                        req, res,
                        new UnauthorizedException(
                            null, code, message
                        ).withDetails('user_id', userId).withStatus(403)
                    );
                } else { 
                    next();
                }
            }
        };
    }

}
