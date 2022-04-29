const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { SmsSettingsController } from 'service-smssettings-node';

import { TestReferences } from '../../fixtures/TestReferences';
import { TestUsers } from '../../fixtures/TestUsers';
import { TestRestClient } from '../../fixtures/TestRestClient';
import { SmsSettingsOperationsV1 } from '../../../src/operations/version1/SmsSettingsOperationsV1';

suite('SmsSettingsOperationsV1', () => {
    let references: TestReferences;
    let rest: TestRestClient;
    let smsSettingsController: SmsSettingsController;

    setup(async () => {
        rest = new TestRestClient();
        references = new TestReferences();
        references.put(new Descriptor('pip-facade-users', 'operations', 'sms-settings', 'default', '1.0'), new SmsSettingsOperationsV1())
        smsSettingsController = references.getOneRequired<SmsSettingsController>(
            new Descriptor('service-smssettings', 'controller', '*', '*', '1.0')
        );
        smsSettingsController.configure(ConfigParams.fromTuples(
            'options.magic_code', 'magic'
        ));
        await references.open(null);
    });

    teardown(async () => {
        await references.close(null);
    });

    test('should verify sms', async () => {
        let settings = {
            id: TestUsers.User1Id,
            name: TestUsers.User1Name,
            phone: '+79102347439'
        };

        await rest.putAsUser(
            TestUsers.User1SessionId,
            '/api/v1/sms_settings/' + TestUsers.User1Id,
            settings
        );

        await rest.post(
            '/api/v1/sms_settings/resend',
            {
                login: TestUsers.User1Login
            }
        );

        await rest.post(
            '/api/v1/sms_settings/verify',
            {
                login: TestUsers.User1Login,
                code: 'magic'
            }
        );
    });

    test('should get and set sms settings', async () => {
        let settings = {
            id: TestUsers.User1Id,
            name: TestUsers.User1Name,
            phone: '+79102347439'
        };

        await rest.putAsUser(
            TestUsers.User1SessionId,
            '/api/v1/sms_settings/' + TestUsers.User1Id,
            settings
        );

        settings = await rest.getAsUser(
            TestUsers.User1SessionId,
            '/api/v1/sms_settings/' + TestUsers.User1Id
        );

        assert.isObject(settings);
    });

});