import { IReferences } from 'pip-services3-commons-nodex';
import { RestOperations } from 'pip-services3-rpc-nodex';
export declare class RolesOperationsV1 extends RestOperations {
    private _rolesClient;
    constructor();
    setReferences(references: IReferences): void;
    getUserRoles(req: any, res: any): Promise<void>;
    grantUserRoles(req: any, res: any): Promise<void>;
    revokeUserRoles(req: any, res: any): Promise<void>;
}
