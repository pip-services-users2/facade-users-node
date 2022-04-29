const assert = require('chai').assert;

import { Descriptor } from 'pip-services3-commons-nodex';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { AccountsOperationsV1 } from '../../../src/operations/version1/AccountsOperationsV1';

suite('AccountsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;

    setup(async () => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'accounts', 'default', '1.0'), new AccountsOperationsV1())
        await references.open(null);
    });

    teardown(async () => {
        await references.close(null);
    });

    test('should get the current account', async () => {
        let account = await rest.getAsUser(
            TestUsers.User1SessionId,
            '/api/v1/accounts/current'
        );

        assert.isObject(account);
        assert.equal(TestUsers.User1Id, account.id);
    });

    test('should get accounts as admin', async () => {
        let page = await rest.getAsUser(
            TestUsers.AdminUserSessionId,
            '/api/v1/accounts?paging=1&skip=0&take=2'
        );

        assert.isObject(page);
        assert.lengthOf(page.data, 2);
    });

    test('should get an account', async () => {
        let account = await rest.getAsUser(
            TestUsers.AdminUserSessionId,
            '/api/v1/accounts/' + TestUsers.User1Id
        );

        assert.isObject(account);
        assert.equal(TestUsers.User1Id, account.id);
    });

    test('should update user settings', async () => {
        let account = await rest.getAsUser(
            TestUsers.User1SessionId,
            '/api/v1/accounts/' + TestUsers.User1Id);

        assert.isObject(account);
        assert.equal(TestUsers.User1Id, account.id);

        account.name = 'New user name';

        account = await rest.putAsUser(
            TestUsers.User1SessionId,
            '/api/v1/accounts/' + TestUsers.User1Id,
            account);
        
        assert.isObject(account);
        assert.equal(account.name, 'New user name');
    });

});