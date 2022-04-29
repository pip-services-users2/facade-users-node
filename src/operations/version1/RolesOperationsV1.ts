import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex'; 

import { IRolesClientV1 } from 'client-roles-node';
import { RestOperations } from 'pip-services3-rpc-nodex';

export class RolesOperationsV1 extends RestOperations {
    private _rolesClient: IRolesClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('roles', new Descriptor('service-roles', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._rolesClient = this._dependencyResolver.getOneRequired<IRolesClientV1>('roles');
    }

    public async getUserRoles(req: any, res: any): Promise<void> {
        let userId = req.route.params.user_id;

        try {
            let roles = await this._rolesClient.getRolesById(
                null, userId
            );
            this.sendResult(req, res, roles);
        } catch(err) {
            this.sendError(req, res, err);
        }
        
    }

    public async grantUserRoles(req: any, res: any): Promise<void> {
        let userId = req.route.params.user_id;
        let roles = req.body;

        try {
            let grantRoles = await this._rolesClient.grantRoles(
                null, userId, roles
            );
            this.sendResult(req, res, grantRoles);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async revokeUserRoles(req: any, res: any): Promise<void> {
        let userId = req.route.params.user_id;
        let roles = req.body;

        try {
            let revokedRoles = await this._rolesClient.revokeRoles(
                null, userId, roles
            );
            this.sendResult(req, res, revokedRoles);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

}