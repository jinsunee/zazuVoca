import firestore from '@react-native-firebase/firestore';

const db = firestore();

export const deleteNotebook = async (notebookUID: string): Promise<string> => {
  try {
    const notebooksRef = db.collection('notebooks').doc(notebookUID);

    const query = await notebooksRef.collection('items').get();

    query.forEach(async (q) => {
      await notebooksRef.collection('items').doc(q.id).delete();
    });

    await notebooksRef.delete();

    return notebookUID;
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const deleteItem = async (
  notebookUID: string,
  itemUID: string,
): Promise<string> => {
  try {
    await db
      .collection('notebooks')
      .doc(notebookUID)
      .collection('items')
      .doc(itemUID)
      .delete();

    return itemUID;
  } catch (error) {
    console.log(error);
    return '';
  }
};
