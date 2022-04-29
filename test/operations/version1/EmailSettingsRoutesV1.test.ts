const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { EmailSettingsController } from 'service-emailsettings-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { EmailSettingsOperationsV1 } from '../../../src/operations/version1/EmailSettingsOperationsV1';

suite('EmailSettingsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;
    let emailSettingsController: EmailSettingsController;

    setup(async () => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'email-settings', 'default', '1.0'), new EmailSettingsOperationsV1())
        emailSettingsController = references.getOneRequired<EmailSettingsController>(
            new Descriptor('service-emailsettings', 'controller', '*', '*', '1.0')
        );
        emailSettingsController.configure(ConfigParams.fromTuples(
            'options.magic_code', 'magic'
        ));
        await references.open(null);
    });

    teardown(async () => {
        await references.close(null);
    });

    test('should verify email', async () => {
        let settings = {
            id: TestUsers.User1Id,
            name: TestUsers.User1Name,
            email: 'test1@somewhere.com'
        };

        await rest.putAsUser(
            TestUsers.User1SessionId,
            '/api/v1/email_settings/' + TestUsers.User1Id,
            settings
        );

        await rest.post(
            '/api/v1/email_settings/resend',
            {
                login: TestUsers.User1Login
            }
        );

        await rest.post(
            '/api/v1/email_settings/verify',
            {
                login: TestUsers.User1Login,
                code: 'magic'
            }
        );
    });

    test('should get and set email settings', async () => {
        let settings = {
            id: TestUsers.User1Id,
            name: TestUsers.User1Name,
            email: 'test1@somewhere.com'
        };

        await rest.putAsUser(
            TestUsers.User1SessionId,
            '/api/v1/email_settings/' + TestUsers.User1Id,
            settings
        );

        settings = await rest.getAsUser(
            TestUsers.User1SessionId,
            '/api/v1/email_settings/' + TestUsers.User1Id
        );

        assert.isObject(settings);
    });

});