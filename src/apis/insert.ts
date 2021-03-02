import { ItemType, NotebookType } from '../types';

import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { fetchUserSize } from './fetch';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const db = firestore();

export async function signUpForEmail(
  email: string,
  password: string,
): Promise<boolean> {
  try {
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      password,
    );

    const currentUser = auth().currentUser;

    if (currentUser) {
      const usercred = await currentUser.linkWithCredential(credential);

      if (usercred.user) {
        await currentUser.sendEmailVerification();

        return true;
      }
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export const insertUser = async (): Promise<string> => {
  try {
    await auth().signInAnonymously();
    const currentUser = auth().currentUser;

    if (currentUser) {
      const createdAt = firebase.firestore.Timestamp.fromDate(new Date());
      const userSize = await fetchUserSize();

      await Promise.all([
        await db
          .collection('users')
          .doc(currentUser.uid)
          .set({
            userName: `user_${userSize + 1}`, // `user_${count+1}`
            downloadedVersion: '1.0.0', // 1.0.0
            createdAt,
          }),
        await db.collection('notebooks').add({
          title: '임시 단어장이에요. 제목을 수정해보세요 :)',
          joinedUser: [currentUser.uid],
          createdAt,
        }),
      ]);

      return currentUser.uid;
    }
  } catch (error) {
    console.log(error);
    return '';
  }
  return '';
};

export const insertItem = async (
  notebookUID: string,
  front: string, // 앞
  back: string[], // 뒤
): Promise<string> => {
  try {
    const createdAt = firebase.firestore.Timestamp.fromDate(new Date());
    const snapshot = await db
      .collection('notebooks')
      .doc(notebookUID)
      .collection('items')
      .add({
        front,
        back,
        createdAt,
      });

    return snapshot.id;
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const insertNotebook = async (
  userUID: string,
  title: string,
  item?: {
    front: string; // 앞
    back: string[]; // 뒤
  },
): Promise<{
  rtnNotebook: NotebookType;
  rtnItem?: ItemType;
} | void> => {
  try {
    const notebookRef = db.collection('notebooks');
    const createdAt = firebase.firestore.Timestamp.fromDate(new Date());
    const snapshot = await notebookRef.add({
      title,
      joinedUser: [userUID],
      createdAt,
    });

    const createdAtDate = createdAt.toDate();
    const rtnNotebook: NotebookType = {
      notebookUID: snapshot.id,
      title,
      date: `${createdAtDate.getFullYear()}.${createdAtDate.getMonth()}.${createdAtDate.getDay()}`,
    };

    if (item && snapshot) {
      const itemSnapshot = await notebookRef
        .doc(snapshot.id)
        .collection('items')
        .add({
          front: item.front,
          back: item.back,
          createdAt,
        });

      const rtnItem: ItemType = {
        itemUID: itemSnapshot.id,
        front: item.front,
        back: item.back,
      };
      return { rtnNotebook, rtnItem };
    }

    return { rtnNotebook };
  } catch (error) {
    console.log(error);
  }
};

export async function pressAppleButton() {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  const { identityToken, nonce } = appleAuthRequestResponse;

  if (identityToken) {
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    const userCredential = await auth().signInWithCredential(appleCredential);

    console.warn(
      `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`,
    );
  } else {
  }
}

export { appleAuth };
