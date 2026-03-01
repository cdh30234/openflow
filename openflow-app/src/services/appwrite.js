import { Client, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('openflow-core');

export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID, Query };

export const AppwriteConfig = {
    databaseId: 'hamad_ops',
    tasksCollectionId: 'tasks',
    resultsCollectionId: 'results',
    messagesCollectionId: 'messages',
    bucketId: 'hamad-files'
};
