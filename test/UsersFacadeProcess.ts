import { ProcessContainer } from 'pip-services3-container-nodex';

import { TestFactory } from './fixtures/TestFactory';

export class UsersFacadeProcess extends ProcessContainer {

    public constructor() {
        super("facade", "Client facade for user management microservice");
        this._factories.add(new TestFactory);
    }

}
