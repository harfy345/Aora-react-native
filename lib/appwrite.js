
import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';


export const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.3h.aora',
    projectId: '661af3607ffcc4c8008e',
    databaseId: '661af4a3147081427c12',
    usersCollectionID: '661af4b59d8dfee15fbd',
    videosCollectionID: '661af4cc4919c191119f',
    storageId: '661af614ed45a0821f9f'
}

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)
    ;
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


// Register user
export const  createUser = async (email, password, username)=> {
    try {
      const newAccount = await account.create(
        ID.unique(),
        email,
        password,
        username
      );
  
      if (!newAccount) throw Error;
  
      const avatarUrl = avatars.getInitials(username);
  
      await signIn(email, password);
  
      const newUser = await databases.createDocument(
        config.databaseId,
        config.usersCollectionID,
        ID.unique(),
        {
          accountId: newAccount.$id,
          email: email,
          username: username,
          avatar: avatarUrl,
        }
      );
  
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  // Sign In
  export const  signIn = async (email, password)=> {
    try {
      const session = await account.createEmailSession(email, password);
  
      return session;
    } catch (error) {
      throw new Error(error);
    }
  }

  export const getCurrentUser = async ()=>{
    try{
      const currentAccount = await account.get();

      if(!currentAccount) throw Error;

      const currentUser = await databases.listDocuments(
        config.databaseId,
        config.usersCollectionID,
        [Query.equal('accountId', currentAccount.$id)]
      );

      if(!currentUser) throw Error;

      return currentUser.documents[0];
    } catch (error){
      console.log(error);
    }
  } 

  export const getAllPosts = async ()=>{
    try{
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videosCollectionID,

      );

      return posts.documents;
    } catch(error){
      throw new Error(error);
    }
  }
  export const getLatestPosts = async ()=>{
    try{
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videosCollectionID,
        [Query.orderDesc('$createdAt' , Query.limit(7))]
      );

      return posts.documents;
    } catch(error){
      throw new Error(error);
    }
  }
  