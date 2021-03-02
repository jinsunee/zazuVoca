import React, { useEffect, useState } from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import DOMParser from 'react-native-html-parser';
import { Keyboard } from 'react-native';
import Layout from './Layout';
import { NotebookType } from '../../../types';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import { colors } from '../../../theme';
import { insertItem } from '../../../apis/insert';
import useNotebooksProvider from '../../../providers/notebooksProvider';
import useUserProvider from '../../../providers/userProvider';

function SearchVoca() {
  const { notebooks, addItem } = useNotebooksProvider();
  const { user } = useUserProvider();
  const [inputVoca, setInputVoca] = useState<string>('');
  const [inputResults, setInputResults] = useState<string[] | null>(null);

  const [selecteResultItems, setSelecteResultItems] = useState<number[] | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAddVoca, setLoadingAddVoca] = useState<boolean>(false);

  const [showSelectVocaListModal, setShowSelectVocaListModal] = useState<
    boolean
  >(false);
  const [shownAddNotebook, setShownAddNotebook] = useState<boolean>(false);

  const [focusedNotebook, setFocusedNotebook] = useState<NotebookType>();

  useEffect(() => {
    fetchFocusedNotebook();
  }, []);

  const fetchFocusedNotebook = async () => {
    try {
      const result = await AsyncStorage.getItem('focusedNotebookUID');

      if (result && notebooks) {
        const index =
          notebooks?.findIndex((n) => n.notebookUID === result) || 0;

        if (index >= 0) {
          setFocusedNotebook(notebooks[index]);
        }
      }

      await AsyncStorage.setItem('focusedNotebookUID', '임시단어장');
      if (notebooks) {
        setFocusedNotebook(notebooks[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const transe = async (input: string): Promise<string> => {
    try {
      const t = await axios.get(
        `https://endic.naver.com/searchAssistDict.nhn?query=${input}`,
      );

      return t.data;
    } catch (error) {
      console.log('error', error);
      return '';
    }
  };

  const request = async (input: string): Promise<void> => {
    try {
      const data = await transe(input);

      // var DOMParser = require('react-native-html-parser').DOMParser;
      var doc = new DOMParser.DOMParser().parseFromString(data);

      const set = new Set<string>();
      doc.querySelect('span[class="fnt_k20"] strong').map((item) => {
        set.add(item.childNodes[0].data);
      });

      const tmp: string[] = [];
      set.forEach((s) => tmp.push(s));

      setInputResults(tmp.sort());
    } catch (error) {
      console.log(error);
    }
  };

  const requestSearching = async () => {
    if (inputVoca) {
      setLoading(true);
      await request(inputVoca);
      setLoading(false);
    }
  };

  const setNotebookIndex = async (index: number, notebook?: NotebookType) => {
    try {
      if (notebook) {
        await AsyncStorage.setItem('index', '0');
        setFocusedNotebook(notebook);
        setShowSelectVocaListModal(false);
        return;
      }

      if (notebooks) {
        await AsyncStorage.setItem('index', index.toString());
        setFocusedNotebook(notebooks[index]);
        setShowSelectVocaListModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pressAddVocaList = (): void => {
    setShowSelectVocaListModal(false);

    setTimeout(() => {
      setShownAddNotebook(true);
    }, 700);
  };

  const pressCancel = (): void => {
    Keyboard.dismiss();
    setShownAddNotebook(false);
  };

  const addVoca = async () => {
    try {
      if (focusedNotebook && inputVoca && inputResults && selecteResultItems) {
        const newItem = inputResults.filter((i, index) =>
          selecteResultItems.includes(index),
        );

        let insertResult;

        if (user) {
          insertResult = await insertItem(
            focusedNotebook?.notebookUID,
            inputVoca,
            newItem,
          );
        } else {
          const fetchAsyncVocaList = await AsyncStorage.getItem('vocaList');

          if (fetchAsyncVocaList) {
            const tmp = JSON.parse(fetchAsyncVocaList).concat({
              itemUID: inputVoca,
              front: inputVoca,
              back: newItem,
            });

            insertResult = await AsyncStorage.setItem(
              'vocaList',
              JSON.stringify(tmp),
            );
          } else {
            const tmp = JSON.stringify([
              {
                itemUID: inputVoca,
                front: inputVoca,
                back: newItem,
              },
            ]);
            insertResult = await AsyncStorage.setItem('vocaList', tmp);
          }
        }

        Toast.show('단어 저장 완료 :)', {
          duration: Toast.durations.SHORT,
          position: 100,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          containerStyle: {
            borderColor: colors.primary,
            borderWidth: 1,
            backgroundColor: colors.backgroundColorDark,
          },
          textStyle: {
            color: colors.primary,
            fontWeight: 'bold',
          },
        });

        if (insertResult) {
          addItem(focusedNotebook?.notebookUID, {
            itemUID: insertResult,
            front: inputVoca,
            back: newItem,
          });
        }
      }

      setInputVoca('');
      setInputResults(null);
      setSelecteResultItems(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout
      inputVoca={inputVoca}
      setInputVoca={setInputVoca}
      setShowSelectVocaListModal={setShowSelectVocaListModal}
      title={focusedNotebook?.title || ''}
      showSelectVocaListModal={showSelectVocaListModal}
      loading={loading}
      loadingAddVoca={loadingAddVoca}
      requestSearching={requestSearching}
      inputResults={inputResults}
      setNotebookIndex={setNotebookIndex}
      pressAddVocaList={pressAddVocaList}
      shownAddNotebook={shownAddNotebook}
      pressCancel={pressCancel}
      selecteResultItems={selecteResultItems}
      setSelecteResultItems={setSelecteResultItems}
      addVoca={addVoca}
    />
  );
}

export default SearchVoca;
