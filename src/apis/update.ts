import { ItemType } from '../types';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const db = firestore();

export const updateNotebook = async (
  notebookUID: string,
  title: string,
): Promise<string> => {
  try {
    await db
      .collection('notebooks')
      .doc(notebookUID)
      .update({
        title,
        updateAt: firebase.firestore.Timestamp.fromDate(new Date()),
      });
    return notebookUID;
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const updateItem = async (
  notebookUID: string,
  item: ItemType,
): Promise<string> => {
  try {
    console.log(notebookUID, item);
    await db
      .collection('notebooks')
      .doc(notebookUID)
      .collection('items')
      .doc(item.itemUID)
      .update({
        front: item.front,
        back: item.back,
        updateAt: firebase.firestore.Timestamp.fromDate(new Date()),
      });
    return item.itemUID;
  } catch (error) {
    console.log(error);
    return '';
  }
};
