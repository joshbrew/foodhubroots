
import { getRequestBody, Routes, setHeaders } from './util';

//CRUD client
import { btGateway } from './braintree';

//mongo client after init
import { mongo } from './mongodb';

//need to have handles to connect mongodb and braintree calls, really should just be macros probably