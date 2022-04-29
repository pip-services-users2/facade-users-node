import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { ManagedReferences } from 'pip-services3-container-nodex';

import { IAccountsPersistence } from 'service-accounts-node';
import { AccountV1 } from 'service-accounts-node';
import { ISessionsPersistence } from 'service-sessions-node';
import { SessionV1 } from 'service-sessions-node';

import { TestUsers } from './TestUsers';
import { TestFactory } from './TestFactory';
import { DefaultRpcFactory, HttpEndpoint } from 'pip-services3-rpc-nodex';
import { TestFacadeService } from './TestFacadeService';

export class TestReferences extends ManagedReferences {
    private _factory = new TestFactory();

    public constructor() {
        super();

        // this._factory.add(new DefaultRpcFactory()); // todo chech
        this.appendCore();
        this.appendMicroservices();
        this.appendFacade();

        this.configureService();
        this.createUsersAndSessions();
    }

    private appendCore(): void {
        this.put(null, this._factory);

        // this.append(new Descriptor('pip-services', 'endpoint', 'http', 'default', '*')); // todo check
    }

    private appendMicroservices(): void {
        this.append(new Descriptor('service-activities', 'persistence', 'memory', 'default', '*'));
        this.append(new Descriptor('service-activities', 'controller', 'default', 'default', '*'));
        this.append(new Descriptor('service-activities', 'client', 'direct', 'default', '*'));
        this.append(new Descriptor('service-accounts', 'persistence', 'memory', 'default', '*'));
        this.append(new Descriptor('service-accounts', 'controller', 'default', 'default', '*'));
        this.append(new Descriptor('service-accounts', 'client', 'direct', 'default', '*'));
        this.append(new Descriptor('service-sessions', 'persistence', 'memory', 'default', '*'));
        this.append(new Descriptor('service-sessions', 'controller', 'default', 'default', '*'));
        this.append(new Descriptor('service-sessions', 'client', 'direct', 'default', '*'));
        this.append(new Descriptor('service-passwords', 'persistence', 'memory', 'default', '*'));
        this.append(new Descriptor('service-passwords', 'controller', 'default', 'default', '*'));
        this.append(new Descriptor('service-passwords', 'client', 'direct', 'default', '*'));
        this.append(new Descriptor('service-roles', 'persistence', 'memory', 'default', '*'));
        this.append(new Descriptor('service-roles', 'controller', 'default', 'default', '*'));
        this.append(new Descriptor('service-roles', 'client', 'direct', 'default', '*'));
        this.append(new Descriptor('service-emailsettings', 'persistence', 'memory', 'default', '*'));
        this.append(new Descriptor('service-emailsettings', 'controller', 'default', 'default', '*'));
        this.append(new Descriptor('service-emailsettings', 'client', 'direct', 'default', '*'));
        this.append(new Descriptor('service-smssettings', 'persistence', 'memory', 'default', '*'));
        this.append(new Descriptor('service-smssettings', 'controller', 'default', 'default', '*'));
        this.append(new Descriptor('service-smssettings', 'client', 'direct', 'default', '*'));
    }

    private appendFacade(): void {
        this.append(new Descriptor('pip-facade-users', 'operations', 'sessions', 'default', '1.0'));
        this.append(new Descriptor('service-facade', 'service', 'test', 'default', '1.0'));
    }

    public append(descriptor: Descriptor): void {
        let component = this._factory.create(descriptor);
        this.put(descriptor, component);
    }

    private configureService(): void {
        // Configure Facade service
        let service = this.getOneRequired<TestFacadeService>(
            new Descriptor('service-facade', 'service', 'test', 'default', '1.0')
        );
        service.configure(ConfigParams.fromTuples(
            'root_path', '', //'/api/v1',
            'connection.protocol', 'http',
            'connection.host', '0.0.0.0',
            'connection.port', 3000
        ));
    }

    private async createUsersAndSessions(): Promise<void> {
        let accountsPersistence = this.getOneRequired<IAccountsPersistence>(
            new Descriptor('service-accounts', 'persistence', '*', '*', '*')
        );
        let adminUserAccount = <AccountV1>{
            id: TestUsers.AdminUserId, 
            login: TestUsers.AdminUserLogin, 
            name: TestUsers.AdminUserName,
            active: true,
            create_time: new Date()
        };
        await accountsPersistence.create(null, adminUserAccount);
        let user1Account = <AccountV1>{
            id: TestUsers.User1Id, 
            login: TestUsers.User1Login, 
            name: TestUsers.User1Name,
            active: true,
            create_time: new Date()
        };
        await accountsPersistence.create(null, user1Account);
        let user2Account = <AccountV1>{
            id: TestUsers.User2Id, 
            login: TestUsers.User2Login, 
            name: TestUsers.User2Name,
            active: true,
            create_time: new Date()
        };
        await accountsPersistence.create(null, user2Account);

        let sessionsPersistence = this.getOneRequired<ISessionsPersistence>(
            new Descriptor('service-sessions', 'persistence', '*', '*', '*')
        );
        let adminUserSession = <SessionV1>{
            id: TestUsers.AdminUserSessionId,
            user_id: TestUsers.AdminUserId,
            user_name: TestUsers.AdminUserName,
            active: true,
            open_time: new Date(),
            request_time: new Date(),
            user: adminUserAccount
        };
        await sessionsPersistence.create(null, adminUserSession);
        let user1Session = <SessionV1>{
            id: TestUsers.User1SessionId,
            user_id: TestUsers.User1Id,
            user_name: TestUsers.User1Name,
            active: true,
            open_time: new Date(),
            request_time: new Date(),
            user: user1Account
        };
        await sessionsPersistence.create(null, user1Session);
        let user2Session = <SessionV1>{
            id: TestUsers.User2SessionId,
            user_id: TestUsers.User2Id,
            user_name: TestUsers.User2Name,
            active: true,
            open_time: new Date(),
            request_time: new Date(),
            user: user2Account
        };
        await sessionsPersistence.create(null, user2Session);
    }

}