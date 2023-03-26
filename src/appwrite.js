import { Client as Appwrite, Databases, Account } from 'appwrite';
const server = {
    endpoint: 'http://localhost/v1',
    project: '641ce07103bff7c6ce23'
};
const client = new Appwrite();
const account = new Account(client);
client.setEndpoint(server.endpoint).setProject(server.project);
const sdk = { account };
export { sdk, server };