import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { IActivitiesClientV1 } from 'client-activities-node';
import { RestOperations } from 'pip-services3-rpc-nodex';

export class ActivitiesOperationsV1 extends RestOperations {
    private _activitiesClient: IActivitiesClientV1;

    public constructor() {
        super();

        this._dependencyResolver.put('activities', new Descriptor('service-activities', 'client', '*', '*', '1.0'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);

        this._activitiesClient = this._dependencyResolver.getOneRequired<IActivitiesClientV1>('activities');
    }

    public async getActivities(req: any, res: any): Promise<void> {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);

        try {
            let page = await this._activitiesClient.getPartyActivities(
                null, filter, paging,
            );
            this.sendResult(req, res, page);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async getPartyActivities(req: any, res: any): Promise<void> {
        let filter = this.getFilterParams(req);
        let paging = this.getPagingParams(req);
        let partyId = req.route.params.party_id;
        filter.setAsObject('party_id', partyId);

        try {
            let page = await this._activitiesClient.getPartyActivities(
                null, filter, paging
            );
            this.sendResult(req, res, page);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }

    public async logPartyActivity(req: any, res: any): Promise<void> {
        let activity = req.body;

        try {
            let loggedActivity = await this._activitiesClient.logPartyActivity(
                null, activity
            );
            this.sendResult(req, res, loggedActivity);
        } catch (err) {
            this.sendError(req, res, err);
        }
    }
}