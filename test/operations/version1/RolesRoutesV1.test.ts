const assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-nodex';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { RolesOperationsV1 } from '../../../src/operations/version1/RolesOperationsV1';

suite('RolesOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;

    setup(async () => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'roles', 'default', '1.0'), new RolesOperationsV1())
        await references.open(null);
    });

    teardown(async () => {
        await references.close(null);
    });

    test('should read roles as user', async () => {
        let roles = await rest.postAsUser(
            TestUsers.AdminUserSessionId,
            '/api/v1/roles/' + TestUsers.User1Id + '/grant', ['paid']);

        assert.isArray(roles);
        assert.sameMembers(['paid'], roles);

        roles = await rest.getAsUser(
            TestUsers.User1SessionId,
            '/api/v1/roles/' + TestUsers.User1Id);

        assert.isArray(roles);
        assert.sameMembers(['paid'], roles);
    });

    test('should grant and revoke roles as admin', async () => {
        let roles = await rest.postAsUser(
            TestUsers.AdminUserSessionId,
            '/api/v1/roles/' + TestUsers.User1Id + '/grant',
            ['paid']);

        assert.isArray(roles);
        assert.sameMembers(['paid'], roles);

        roles = await rest.postAsUser(
            TestUsers.AdminUserSessionId,
            '/api/v1/roles/' + TestUsers.User1Id + '/revoke',
            ['paid']);

        assert.isArray(roles);
        assert.lengthOf(roles, 0);
    });

});