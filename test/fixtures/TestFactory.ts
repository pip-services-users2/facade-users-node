import { CompositeFactory } from 'pip-services3-components-nodex';
import { DefaultContainerFactory } from 'pip-services3-container-nodex';

import { ActivitiesServiceFactory } from 'service-activities-node';
import { ActivitiesClientFactory } from 'client-activities-node';
import { AccountsServiceFactory } from 'service-accounts-node';
import { AccountsClientFactory } from 'client-accounts-node';
import { EmailSettingsServiceFactory } from 'service-emailsettings-node';
import { EmailSettingsClientFactory } from 'client-emailsettings-node';
import { SmsSettingsServiceFactory } from 'service-smssettings-node';
import { SmsSettingsClientFactory } from 'client-smssettings-node';
import { PasswordsServiceFactory } from 'service-passwords-node';
import { PasswordsClientFactory } from 'client-passwords-node';
import { SessionsServiceFactory } from 'service-sessions-node';
import { SessionsClientFactory } from 'client-sessions-node';
import { RolesServiceFactory } from 'service-roles-node';
import { RolesClientFactory } from 'client-roles-node';

import { UsersFacadeFactory } from '../../src/build/UsersFacadeFactory';
import { TestFacadeFactory } from './TestFacadeFactory';

export class TestFactory extends DefaultContainerFactory {

    public constructor() {
        super();

        this.add(new UsersFacadeFactory);
        this.add(new TestFacadeFactory);

        this.add(new ActivitiesServiceFactory);
        this.add(new ActivitiesClientFactory);
        this.add(new AccountsServiceFactory);
        this.add(new AccountsClientFactory);
        this.add(new EmailSettingsServiceFactory);
        this.add(new EmailSettingsClientFactory);
        this.add(new SmsSettingsServiceFactory);
        this.add(new SmsSettingsClientFactory);
        this.add(new PasswordsServiceFactory);
        this.add(new PasswordsClientFactory);
        this.add(new SessionsServiceFactory);
        this.add(new SessionsClientFactory);
        this.add(new RolesServiceFactory);
        this.add(new RolesClientFactory);
    }

}
