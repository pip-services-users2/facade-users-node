import { IReferences } from 'pip-services3-commons-nodex';
import { RestOperations } from 'pip-services3-rpc-nodex';
export declare class ActivitiesOperationsV1 extends RestOperations {
    private _activitiesClient;
    constructor();
    setReferences(references: IReferences): void;
    getActivities(req: any, res: any): Promise<void>;
    getPartyActivities(req: any, res: any): Promise<void>;
    logPartyActivity(req: any, res: any): Promise<void>;
}
