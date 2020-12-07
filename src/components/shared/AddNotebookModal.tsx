/* eslint-disable react-native/no-inline-styles */
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, { ReactElement, useState } from 'react';

import { ActivityIndicator } from 'react-native-paper';
import Modal from 'react-native-modal';
import { NotebookType } from '../../types';
import { SvgClose } from '../../utils/Icons';
import { colors } from '../../theme';
import { insertNotebook } from '../../apis/insert';
import { screenHeight } from '../../utils/common';
import styled from 'styled-components/native';
import useNotebooksProvider from '../../providers/notebooksProvider';
import useUserProvider from '../../providers/userProvider';

const Container = styled.View`
  /* background-color: ${({ theme }): string => theme.background}; */
  background-color: ${colors.backgroundColorDark};
  border-radius: 20px;
  border-radius: 20px;
  align-items: center;
  max-height: ${screenHeight * 0.9}px;
`;

const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  left: 20px;
  top: 20px;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.lightGray6};
`;

const BottomWrapper = styled.View`
  width: 100%;
  flex-direction: row;
`;

const BottomButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const BottomButtonCancelText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.lightGray6};
`;

const BottomButtonCompleteText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.primary};
`;

const Wrapper = styled.View`
  width: 100%;
  padding: 20px;
`;

const Title = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.lightGray6};
`;

const InputWrapper = styled.View`
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray5};
`;

const Input = styled.TextInput`
  font-size: 17px;
  font-weight: bold;
  color: ${colors.light};
`;

const WarningWrapper = styled.View`
  height: 23px;
  justify-content: center;
`;

const WarningText = styled.Text`
  margin-top: 10px;
  font-size: 13px;
  color: ${colors.negative};
`;

interface Props {
  showModal: boolean;
  cancel: () => void;
  setNotebookIndex?: (index: number, notebook: NotebookType) => void;
}

function EditCollectionModal(props: Props): ReactElement {
  const { showModal, cancel, setNotebookIndex } = props;
  const { notebooks, addNotebook } = useNotebooksProvider();
  const { user } = useUserProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<string>();
  const [vocaListTitle, setVocaListTitle] = useState<string>('');

  const pressCancel = (): void => {
    cancel();
    setVocaListTitle('');
    setWarning('');
    setLoading(false);
  };

  const pressComplete = async (): Promise<void> => {
    try {
      if (user.userUID) {
        if (!vocaListTitle) {
          setWarning('제목을 입력해주세요');
          return;
        }

        setLoading(true);

        const insertResult = await insertNotebook(user.userUID, vocaListTitle);

        if (insertResult) {
          addNotebook(insertResult.rtnNotebook);
          if (setNotebookIndex) {
            setNotebookIndex(notebooks.length, insertResult.rtnNotebook);
          }
        }

        setLoading(false);
        pressCancel();
        setVocaListTitle('');
        setWarning('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isVisible={showModal}
      onBackdropPress={cancel}
      style={{
        margin: 0,
        padding: 20,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <TouchableWithoutFeedback onPress={(): void => Keyboard.dismiss()}>
          <Container>
            <Header>
              <CloseButton onPress={pressCancel}>
                <SvgClose />
              </CloseButton>
              <HeaderTitle>단어장 추가</HeaderTitle>
            </Header>
            <Wrapper>
              <Title>단어장 이름</Title>
              <InputWrapper>
                <Input
                  multiline={true}
                  value={vocaListTitle}
                  onChangeText={(text) => setVocaListTitle(text)}
                  placeholder={'추가할 단어장 이름을 입력해주세요 :)'}
                  placeholderTextColor={colors.lightGray5}
                />
              </InputWrapper>
              <WarningWrapper>
                {warning ? <WarningText>{warning}</WarningText> : null}
              </WarningWrapper>
            </Wrapper>
            <BottomWrapper>
              <BottomButton onPress={pressCancel}>
                <BottomButtonCancelText>취소</BottomButtonCancelText>
              </BottomButton>
              <BottomButton onPress={pressComplete}>
                {loading ? (
                  <ActivityIndicator size={14} color={colors.primary} />
                ) : (
                  <BottomButtonCompleteText>완료</BottomButtonCompleteText>
                )}
              </BottomButton>
            </BottomWrapper>
          </Container>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default EditCollectionModal;
