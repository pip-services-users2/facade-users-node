# Facade Operations for User Management Pip.Services in Node.js / ES2017

Using these moule developers are able to create facades and fill them with pre-built REST operations for:

* Signin/signup and session management
* User accounts
* Password management
* Email settings
* Role management

<a name="links"></a> Quick Links:

* [Development Guide](doc/Development.md)
* [REST Protocol V1](doc/RestProtocolV1.md)

## Install

Add dependency to the facade and operations into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "pip-services3-facade-nodex": "^1.0.*",
        "pip-facade-infrastructure-nodex": "^1.0.*",
        ...
    }
}
```

Then install the dependency using **npm** tool
```bash
# Install new dependencies
npm install

# Update already installed dependencies
npm update
```

## Use

Create facade service
```typescript
import { MainFacadeService } from 'pip-services3-facade-nodex'

export class MyFacadeServiceV1 extends MainFacadeService {
    ...
}
```

Get or create operations and register routes in the facade service
```typescript
import { AccountsOperations } from 'facade-users-node';

export class MyFacadeServiceV1 extends MainFacadeService {

    public register() {
        let logging = new LoggingOperations();
        this.registerRoute('get', '/accounts', (req, res) => logging.getAccounts(req, res));
        this.registerRoute('get', '/accounts/current', (req, res) => logging.getCurrentAccount(req, res));
        this.registerRoute('get', '/accounts/:account_id', (req, res) => logging.getAccount(req, res));
    }

}
```

Instantiate and configure facade. After that create microservice clients and set references to the facade.
When everything is ready, run the facade.
```typescript
let myFacade = new MyFacadeServiceV1();
myFacade.configure(ConfigParams.fromTuples(
    'connection.protocol', 'http',
    'connection.host', '0.0.0.0',
    'connection.port', 8080
));

let accountsClient = new AccountsHttpClientV1();
accountsClient.configure(ConfigParams.fromTuples(
    'connection.protocol', 'http',
    'connection.host', 'localhost',
    'connection.port', 8082
));

let references = References.fromTuples(
    new Descriptor('service-accounts', 'client', 'http', 'default', '1.0'), accountsClient
);
myFacade.setReferences(references)

await myFacade.open(null);

console.log('Client facade is running');
```

Alternatively to manual instantiation and cross-referencing you can use Pip.Services container
and instantiate the whole facade using simple configuration:
```yaml
---
-descriptor: service-accounts:client:http:default:1.0
 connection:
   protocol: http
   host: localhost
   port: 8082

-descriptor: my-facade:service:facade:default:1.0
 connection:
   protocol: http
   host: 0.0.0.0
   port: 8080
```

## Acknowledgements

This client SDK was created and currently maintained by *Sergey Seroukhov*.

