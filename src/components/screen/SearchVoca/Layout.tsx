import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Platform,
  Pressable,
} from 'react-native';
import {
  SvgBack,
  SvgCheck1,
  SvgSave,
  SvgSearch,
  SvgToBottom,
} from '../../../utils/Icons';

import AddNotebookModal from '../../shared/AddNotebookModal';
import { NotebookType } from '../../../types';
import React from 'react';
import SelectVocaListModal from '../../shared/SelectVocaListModal';
import { colors } from '../../../theme';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  inputVoca: string;
  setInputVoca: (input: string) => void;
  setShowSelectVocaListModal: (shown: boolean) => void;
  title: string;
  showSelectVocaListModal: boolean;
  loading: boolean;
  loadingAddVoca: boolean;
  requestSearching: () => void;
  inputResults: string[] | null;
  setNotebookIndex: (index: number, notebook?: NotebookType) => void;
  pressAddVocaList: () => void;
  shownAddNotebook: boolean;
  pressCancel: () => void;
  selecteResultItems: number[] | null;
  setSelecteResultItems: (inputs: number[]) => void;
  addVoca: () => void;
}

function Layout(props: Props) {
  const {
    title,
    loading,
    loadingAddVoca,
    inputVoca,
    setInputVoca,
    inputResults,
    showSelectVocaListModal,
    setShowSelectVocaListModal,
    shownAddNotebook,
    requestSearching,
    setNotebookIndex,
    pressAddVocaList,
    pressCancel,
    selecteResultItems,
    setSelecteResultItems,
    addVoca,
  } = props;

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  const renderHeader = (): React.ReactElement => {
    return (
      <Header>
        <BackButton onPress={goBack}>
          <SvgBack fill={colors.light} />
        </BackButton>
        <VocaTitleButton
          onPress={(): void => {
            Keyboard.dismiss();
            setShowSelectVocaListModal(true);
          }}
        >
          <VocaTitleText>{title}</VocaTitleText>
          <SvgToBottom fill={colors.light} />
        </VocaTitleButton>
      </Header>
    );
  };

  const renderInputVoca = (): React.ReactElement => {
    const inputViewStyle = {
      flex: 1,
      fontSize: 20,
      paddingTop: 0,
      paddingBottom: 0,
    };

    return (
      <InputVocaWrapper>
        <InputVoca
          value={inputVoca}
          onChangeText={(text) => setInputVoca(text.toLowerCase())}
          placeholder={'단어를 입력해주세요 :)'}
          placeholderTextColor={colors.lightGray5}
          style={inputViewStyle}
          onSubmitEditing={requestSearching}
        />
        <SearchButton onPress={requestSearching}>
          <SvgSearch />
        </SearchButton>
      </InputVocaWrapper>
    );
  };

  const renderHideButton = (): React.ReactElement | null => {
    return (
      <HideKeyboardButton onPress={(): void => Keyboard.dismiss()}>
        <SvgToBottom fill={colors.darkGray5} />
      </HideKeyboardButton>
    );
  };

  const renderBottomButton = (): React.ReactElement => {
    const bottomButtonStyle = {
      paddingTop: 20,
      paddingBottom: insets.bottom + 20,
    };

    if (loading) {
      return (
        <BottomButtonInactivate disabled={true} style={bottomButtonStyle}>
          <ActivityIndicator color={colors.backgroundColorDark} size={24} />
        </BottomButtonInactivate>
      );
    }

    if (loadingAddVoca) {
      return (
        <BottomButton disabled={true} style={bottomButtonStyle}>
          <ActivityIndicator color={colors.backgroundColorDark} size={24} />
        </BottomButton>
      );
    }

    if (!inputVoca || (inputVoca && !inputResults)) {
      return (
        <BottomButtonInactivate disabled={true} style={bottomButtonStyle}>
          <SvgSave />
          <BottomButtonTextInactivate>저장하기</BottomButtonTextInactivate>
        </BottomButtonInactivate>
      );
    }

    return (
      <BottomButton onPress={addVoca} style={bottomButtonStyle}>
        <SvgSave />
        <BottomButtonText>저장하기</BottomButtonText>
      </BottomButton>
    );
  };

  const renderView = () => {
    if (loading) {
      return (
        <LoadingWrapper>
          <ActivityIndicator />
        </LoadingWrapper>
      );
    }

    if (!inputVoca || (inputVoca && !inputResults)) {
      return (
        <EmptyWrapper>
          <EmptyText>한글 뜻이 나와요!</EmptyText>
        </EmptyWrapper>
      );
    }

    if (!inputResults) {
      return (
        <EmptyWrapper>
          <EmptyText>검색 결과가 없어요.</EmptyText>
        </EmptyWrapper>
      );
    }

    return (
      <FlatList
        data={inputResults}
        keyExtractor={(item, index): string => index.toString()}
        contentContainerStyle={{ paddingTop: 10 }}
        renderItem={({ item, index }): React.ReactElement => {
          return (
            <ResultItem
              key={`items__${index}`}
              onPress={(): void => {
                if (selecteResultItems?.includes(index)) {
                  const newItem = selecteResultItems.filter((i) => i !== index);

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
    );
  };

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <KeyboardAvoiding behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {renderHeader()}
        {renderInputVoca()}
        {renderView()}
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
      </KeyboardAvoiding>
      {renderBottomButton()}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColorDark};
`;

const KeyboardAvoiding = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: center;
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
  padding: 15px;
  justify-content: center;
`;

const VocaTitleButton = styled.TouchableOpacity`
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
  padding: 20px 15px 10px 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray5};
  flex-direction: row;
  align-items: center;
`;

const InputVoca = styled.TextInput`
  font-size: 25px;
  font-weight: bold;
  color: ${colors.light};
`;

const SearchButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  padding: 15px;
  justify-content: center;
  align-items: center;
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

export default Layout;
