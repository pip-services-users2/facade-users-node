const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { PasswordsController } from 'service-passwords-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { PasswordsOperationsV1 } from '../../../src/operations/version1/PasswordsOperationsV1';

suite('PasswordsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;
    let passwordsController: PasswordsController;

    setup(async () => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'passwords', 'default', '1.0'), new PasswordsOperationsV1())
        passwordsController = references.getOneRequired<PasswordsController>(
            new Descriptor('service-passwords', 'controller', '*', '*', '1.0')
        );
        passwordsController.configure(ConfigParams.fromTuples(
            'options.magic_code', 'magic'
        ));
        await references.open(null);
    });

    teardown(async () => {
        await references.close(null);
    });

    test('should reset password', async () => {
        await passwordsController.setPassword(null,
            TestUsers.User1Id, TestUsers.User1Password
        );

        await rest.post(
            '/api/v1/passwords/recover',
            {
                login: TestUsers.User1Login
            }
        );

        await rest.post(
            '/api/v1/passwords/reset',
            {
                login: TestUsers.User1Login,
                code: 'magic',
                password: 'OIUWEFKHEKJF'
            }
        );

        let session = await rest.postAsUser(
            TestUsers.User1SessionId,
            '/api/v1/signin',
            {
                login: TestUsers.User1Login,
                password: 'OIUWEFKHEKJF'
            }
        );

        assert.isObject(session);
    });

    test('should change password', async () => {

        await passwordsController.setPassword(null,
            TestUsers.User1Id, TestUsers.User1Password
        );

        await rest.postAsUser(
            TestUsers.User1SessionId,
            '/api/v1/passwords/' + TestUsers.User1Id + '/change',
            {
                old_password: TestUsers.User1Password,
                new_password: 'JHWKJHFLDAJSH'
            }
        );

        let session = await rest.postAsUser(
            TestUsers.User1SessionId,
            '/api/v1/signin',
            {
                login: TestUsers.User1Login,
                password: 'JHWKJHFLDAJSH'
            }
        );

        assert.isObject(session);
    });

});