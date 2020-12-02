import { ItemType, NotebookType, User } from '../types';

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
          date: `${createdAt.getFullYear()}.${createdAt.getMonth()}.${createdAt.getDay()}`,
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
