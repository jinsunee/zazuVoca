import { ItemType, NotebookType, User } from '../types';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const db = firestore();

export const fetchUserSize = async (): Promise<number> => {
  try {
    const query = await db.collection('users').get();

    return query.size || 0;
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export const fetchUser = async (userUID: string): Promise<User | void> => {
  try {
    const query = await db.collection('users').doc(userUID).get();

    const data = query.data();
    if (data) {
      return {
        userUID,
        userName: data.userName,
        profileImage: data.profileImage,
        email: data.email,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchNotebooks = async (
  userUID: string,
): Promise<NotebookType[] | void> => {
  try {
    const query = await db
      .collection('notebooks')
      .where('joinedUser', 'array-contains', userUID)
      .orderBy('createdAt', 'desc')
      .get();

    const tmpNotebooks: NotebookType[] = [];
    query.forEach(async (q) => {
      const data = q.data();

      if (data) {
        const createdAt = data.createdAt.toDate();

        tmpNotebooks.push({
          notebookUID: q.id,
          title: data.title,
          date: `${createdAt.getFullYear()}.${
            createdAt.getMonth() + 1
          }.${createdAt.getDay()}`,
        });
      }
    });

    return tmpNotebooks;
  } catch (error) {
    console.log(error);
  }
};

export const fetchItems = async (
  userUID: string,
  notebookUID: string,
): Promise<ItemType[] | void> => {
  try {
    const query = await db
      .collection('notebooks')
      .doc(notebookUID)
      .collection('items')
      .get();

    const tmpItems: ItemType[] = [];
    query.forEach(async (q) => {
      const data = q.data();

      if (data) {
        tmpItems.push({
          itemUID: q.id,
          front: data.front,
          back: data.back,
        });
      }
    });

    return tmpItems;
  } catch (error) {
    console.log(error);
  }
};

export const confirmUserForEmail = async (email: string): Promise<boolean> => {
  try {
    const query = await db
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .get();

    if (query.size > 0) {
      return true;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export async function signInEmail(
  email: string,
  password: string,
): Promise<string> {
  try {
    const firebaseAuth = auth();

    const query = await firebaseAuth.signInWithEmailAndPassword(
      email.toLowerCase(),
      password,
    );

    if (!query?.user) {
      return '';
    }

    if (!query.user.emailVerified) {
      return 'emailVerifiedFalse';
    }

    const userRef = db.collection('users').doc(query.user.uid);

    // 로그인 되어있는지 확인
    const confirmUserIsSignIn = await userRef.get();

    if (confirmUserIsSignIn.data()) {
      return query.user.uid;
    }

    const userSize = await fetchUserSize();
    const createdAt = firebase.firestore.Timestamp.fromDate(new Date());

    await Promise.all([
      await userRef.set({
        userName: `user_${userSize + 1}`, // `user_${count+1}`
        downloadedVersion: '1.0.0', // 1.0.0
        createdAt,
      }),
      await db.collection('notebooks').add({
        title: '임시 단어장이에요. 제목을 수정해보세요 :)',
        joinedUser: [query.user.uid],
        createdAt,
      }),
    ]);

    return '';
  } catch (error) {
    console.log(error);
    return '';
  }
}
