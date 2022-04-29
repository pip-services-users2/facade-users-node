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
exports.ActivitiesOperationsV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class ActivitiesOperationsV1 extends pip_services3_rpc_nodex_1.RestOperations {
    constructor() {
        super();
        this._dependencyResolver.put('activities', new pip_services3_commons_nodex_1.Descriptor('service-activities', 'client', '*', '*', '1.0'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._activitiesClient = this._dependencyResolver.getOneRequired('activities');
    }
    getActivities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = this.getFilterParams(req);
            let paging = this.getPagingParams(req);
            try {
                let page = yield this._activitiesClient.getPartyActivities(null, filter, paging);
                this.sendResult(req, res, page);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    getPartyActivities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = this.getFilterParams(req);
            let paging = this.getPagingParams(req);
            let partyId = req.route.params.party_id;
            filter.setAsObject('party_id', partyId);
            try {
                let page = yield this._activitiesClient.getPartyActivities(null, filter, paging);
                this.sendResult(req, res, page);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
    logPartyActivity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let activity = req.body;
            try {
                let loggedActivity = yield this._activitiesClient.logPartyActivity(null, activity);
                this.sendResult(req, res, loggedActivity);
            }
            catch (err) {
                this.sendError(req, res, err);
            }
        });
    }
}
exports.ActivitiesOperationsV1 = ActivitiesOperationsV1;
//# sourceMappingURL=ActivitiesOperationsV1.js.map