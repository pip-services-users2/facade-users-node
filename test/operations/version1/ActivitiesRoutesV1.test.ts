const assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-nodex';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { ActivitiesOperationsV1 } from '../../../src/operations/version1/ActivitiesOperationsV1';

suite('ActivitiesOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;

    setup(async () => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'activities', 'default', '1.0'), new ActivitiesOperationsV1())
        await references.open(null);
    });

    teardown(async () => {
        await references.close(null);
    });

    test('should get activities as admin', async () => {
        let page = await rest.getAsUser(
            TestUsers.AdminUserSessionId,
            '/api/v1/activities?paging=1&skip=0&take=2'
        );

        assert.isObject(page);
    });

    test('should get party activities as owner', async () => {
        let page = await rest.getAsUser(
            TestUsers.User1SessionId,
            '/api/v1/activities/' + TestUsers.User1SessionId + '?paging=1&skip=0&take=2'
        );

        assert.isObject(page);

    });

});