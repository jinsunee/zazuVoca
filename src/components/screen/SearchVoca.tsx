import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import React, { ReactElement, useEffect, useState } from 'react';
import {
  SvgBack,
  SvgCheck1,
  SvgSave,
  SvgSearch,
  SvgToBottom,
} from '../../utils/Icons';

import AddNotebookModal from '../shared/AddNotebookModal';
import AsyncStorage from '@react-native-community/async-storage';
import { NotebookType } from '../../types';
import SelectVocaListModal from '../shared/SelectVocaListModal';
import Toast from 'react-native-root-toast';
import axios from 'axios';
import { colors } from '../../theme';
import { insertItem } from '../../apis/insert';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import useNotebooksProvider from '../../providers/notebooksProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColorDark};
`;

const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  padding: 20px;
  justify-content: center;
`;

const VocaTitleButton = styled.TouchableOpacity`
  /* height: 60px; */
  flex-direction: row;
  align-items: center;
`;

const VocaTitleText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.light};
  margin-right: 5px;
`;

const InputVocaWrapper = styled.View`
  width: 100%;
  padding: 20px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray5};
  flex-direction: row;
  align-items: center;
`;

const InputVoca = styled.TextInput`
  font-size: 30px;
  font-weight: bold;
  color: ${colors.light};
`;

const ResultItem = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 20px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ResultWrapper = styled.View`
  flex: 1;
  margin-left: 10px;
`;

const ResultText = styled.Text`
  font-size: 20px;
  font-weight: 300;
  color: ${colors.light};
`;

const LoadingWrapper = styled.View`
  flex: 1;
  padding-top: 100px;
`;

const EmptyWrapper = styled.View`
  flex: 1;
  padding-top: 200px;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: ${colors.lightGray5};
`;

const BottomButton = styled(Pressable)`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${colors.primary};
  position: absolute;
  bottom: 0;
`;

const BottomButtonText = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.backgroundColorDark};
  margin-left: 5px;
`;

const BottomButtonInactivate = styled.TouchableOpacity`
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: ${colors.darkGray3};
  position: absolute;
  bottom: 0;
`;

const BottomButtonTextInactivate = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.backgroundColorDark};
  margin-left: 5px;
`;

const HideKeyboardButton = styled(Pressable)`
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-top-width: 1px;
  border-top-color: ${colors.darkGray5};
`;

function AddVoca(): ReactElement {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const { notebooks, addItem } = useNotebooksProvider();

  const [inputVoca, setInputVoca] = useState<string>();
  const [inputResults, setInputResults] = useState<string[] | null>();

  const [selecteResultItems, setSelecteResultItems] = useState<
    number[] | null
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingAddVoca, setLoadingAddVoca] = useState<boolean>(false);

  const [showSelectVocaListModal, setShowSelectVocaListModal] = useState<
    boolean
  >(false);
  const [shownAddNotebook, setShownAddNotebook] = useState<boolean>(false);

  const [focusedNotebook, setFocusedNotebook] = useState<NotebookType>();

  const transe = async (input: string): Promise<string> => {
    try {
      const t = await axios.get(`https://glosbe.com/en/ko/${input}`);

      return t.data;
    } catch (error) {
      console.log('error', error);
      return '';
    }
  };

  const request = async (input: string): Promise<void> => {
    try {
      const data = await transe(input);
      const resultTag = data.match(
        /<div class="text-info"><strong class="nobold phr">[(^가-힣ㄱ-ㅎㅏ-ㅣ)]*<\/strong>/g,
      );

      if (resultTag) {
        const rtn: string[] = [];
        for (const r of resultTag) {
          rtn.push(removeTag(r));
        }

        setInputResults(rtn);

        return;
      }

      setInputResults(null);
      setSelecteResultItems(null);
    } catch (error) {
      console.log(error);
    }
  };

  const addVoca = async (): Promise<void> => {
    try {
      if (focusedNotebook && inputVoca && inputResults && selecteResultItems) {
        const newItem = inputResults.filter((i, index) =>
          selecteResultItems.includes(index),
        );
        const insertResult = await insertItem(
          focusedNotebook?.notebookUID,
          inputVoca,
          newItem,
        );

        if (insertResult) {
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

  const removeTag = (str: string): string => {
    return str.replace(/(<([^>]+)>)/gi, '');
  };

  const fetchNotebookIndex = async () => {
    try {
      const index = parseInt((await AsyncStorage.getItem('index')) || '0');

      if (notebooks[index]) {
        setFocusedNotebook(notebooks[index]);
        return;
      }

      setFocusedNotebook(notebooks[0]);
    } catch (error) {
      console.log(error);
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
      await AsyncStorage.setItem('index', index.toString());
      setFocusedNotebook(notebooks[index]);
      setShowSelectVocaListModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotebookIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (inputVoca) {
      setTimeout(() => {
        setSearching(inputVoca);
      }, 1500);
      setSearching('');
      return;
    }

    setInputResults(null);
    setSelecteResultItems(null);
  }, [inputVoca]);

  const fetch = async (input: string) => {
    setLoading(true);
    await request(input);
    setLoading(false);
    setSearching('');
  };

  const [searching, setSearching] = useState<string>();

  useEffect(() => {
    if (!loading && searching) {
      fetch(searching);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, searching]);

  const goToBack = (): void => {
    if (navigation) {
      navigation.goBack();
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

  const renderHeader = (): ReactElement => {
    return (
      <Header>
        <BackButton onPress={goToBack}>
          <SvgBack fill={colors.light} />
        </BackButton>
        <VocaTitleButton
          onPress={(): void => {
            Keyboard.dismiss();
            setShowSelectVocaListModal(true);
          }}
        >
          <VocaTitleText>{focusedNotebook?.title}</VocaTitleText>
          <SvgToBottom fill={colors.light} />
        </VocaTitleButton>
      </Header>
    );
  };

  const renderInputVoca = (): ReactElement => {
    return (
      <InputVocaWrapper>
        <SvgSearch />
        <InputVoca
          multiline={true}
          value={inputVoca}
          onChangeText={(text) => setInputVoca(text.toLowerCase())}
          placeholder={'단어를 입력해주세요 :)'}
          placeholderTextColor={colors.lightGray5}
          style={{
            marginLeft: 10,
            flex: 1,
            fontSize: 20,
            paddingTop: 0,
            paddingBottom: 0,
          }}
        />
      </InputVocaWrapper>
    );
  };

  const renderBottomButton = (): ReactElement => {
    if (loading) {
      return (
        <BottomButtonInactivate
          disabled={true}
          style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}
        >
          <ActivityIndicator color={colors.backgroundColorDark} size={24} />
        </BottomButtonInactivate>
      );
    }

    if (loadingAddVoca) {
      return (
        <BottomButton
          disabled={true}
          style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}
        >
          <ActivityIndicator color={colors.backgroundColorDark} size={24} />
        </BottomButton>
      );
    }

    if (!inputVoca || (inputVoca && !inputResults)) {
      return (
        <BottomButtonInactivate
          disabled={true}
          style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}
        >
          <SvgSave />
          <BottomButtonTextInactivate>저장하기</BottomButtonTextInactivate>
        </BottomButtonInactivate>
      );
    }

    return (
      <BottomButton
        onPress={async () => {
          setLoadingAddVoca(true);

          setTimeout(() => {
            setLoadingAddVoca(false);
            addVoca();
          }, 1500);
        }}
        style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}
      >
        <SvgSave />
        <BottomButtonText>저장하기</BottomButtonText>
      </BottomButton>
    );
  };

  const renderHideButton = (): ReactElement | null => {
    return (
      <HideKeyboardButton onPress={(): void => Keyboard.dismiss()}>
        <SvgToBottom fill={colors.darkGray5} />
      </HideKeyboardButton>
    );
  };

  if (loading) {
    return (
      <Container
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
          {renderHeader()}
          {renderInputVoca()}
          <LoadingWrapper>
            <ActivityIndicator />
          </LoadingWrapper>
          <SelectVocaListModal
            showModal={showSelectVocaListModal}
            setShowModal={setShowSelectVocaListModal}
            setNotebookIndex={setNotebookIndex}
            addVocaList={pressAddVocaList}
          />
          <AddNotebookModal
            showModal={shownAddNotebook}
            cancel={pressCancel}
            setNotebookIndex={setNotebookIndex}
          />
          {renderHideButton()}
        </KeyboardAvoidingView>
        {renderBottomButton()}
      </Container>
    );
  }

  if (!inputVoca) {
    return (
      <Container
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
          {renderHeader()}
          {renderInputVoca()}
          <EmptyWrapper>
            <EmptyText>한글 뜻이 나와요!</EmptyText>
          </EmptyWrapper>
          <SelectVocaListModal
            showModal={showSelectVocaListModal}
            setShowModal={setShowSelectVocaListModal}
            setNotebookIndex={setNotebookIndex}
            addVocaList={pressAddVocaList}
          />
          <AddNotebookModal
            showModal={shownAddNotebook}
            cancel={pressCancel}
            setNotebookIndex={setNotebookIndex}
          />
          {renderHideButton()}
        </KeyboardAvoidingView>
        {renderBottomButton()}
      </Container>
    );
  }

  if (inputVoca && !inputResults) {
    return (
      <Container
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
          {renderHeader()}
          {renderInputVoca()}
          <EmptyWrapper>
            <EmptyText>검색 결과가 없어요.</EmptyText>
          </EmptyWrapper>
          <SelectVocaListModal
            showModal={showSelectVocaListModal}
            setShowModal={setShowSelectVocaListModal}
            setNotebookIndex={setNotebookIndex}
            addVocaList={pressAddVocaList}
          />
          <AddNotebookModal
            showModal={shownAddNotebook}
            cancel={pressCancel}
            setNotebookIndex={setNotebookIndex}
          />
          {renderHideButton()}
        </KeyboardAvoidingView>
        {renderBottomButton()}
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
        {renderHeader()}
        {renderInputVoca()}
        <FlatList
          data={inputResults}
          keyExtractor={(item, index): string => index.toString()}
          contentContainerStyle={{ paddingTop: 10 }}
          renderItem={({ item, index }): ReactElement => {
            return (
              <ResultItem
                key={`items__${index}`}
                onPress={(): void => {
                  if (selecteResultItems?.includes(index)) {
                    const newItem = selecteResultItems.filter(
                      (i) => i !== index,
                    );

                    setSelecteResultItems(newItem);
                    return;
                  }

                  setSelecteResultItems((prev) => {
                    if (prev) {
                      return prev.concat(index);
                    }

                    return [index];
                  });
                }}
              >
                {selecteResultItems?.includes(index) ? (
                  <SvgCheck1 fill={colors.primary} width={10} height={10} />
                ) : (
                  <SvgCheck1 fill={colors.lightGray5} width={10} height={10} />
                )}

                <ResultWrapper>
                  <ResultText>{item}</ResultText>
                </ResultWrapper>
              </ResultItem>
            );
          }}
        />
        <SelectVocaListModal
          showModal={showSelectVocaListModal}
          setShowModal={setShowSelectVocaListModal}
          setNotebookIndex={setNotebookIndex}
          addVocaList={pressAddVocaList}
        />
        <AddNotebookModal
          showModal={shownAddNotebook}
          cancel={pressCancel}
          setNotebookIndex={setNotebookIndex}
        />
        {renderHideButton()}
      </KeyboardAvoidingView>
      {renderBottomButton()}
    </Container>
  );
}

export default AddVoca;
