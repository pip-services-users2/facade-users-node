import { IReferences } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { RestService } from 'pip-services3-rpc-nodex';
export declare class FacadeServiceV1 extends RestService {
    private _aboutOperations;
    private _accountsOperations;
    private _activitiesOperations;
    private _emailSettingsOperations;
    private _passwordsOperations;
    private _rolesOperations;
    private _sessionsOperations;
    private _smsSettingsOperationsV1;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    register(): void;
    private registerAdminRoutes;
    private registerUsersRoutes;
}
