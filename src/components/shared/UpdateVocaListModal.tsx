/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { ReactElement, useState } from 'react';

import { ActivityIndicator } from 'react-native-paper';
import Modal from 'react-native-modal';
import { SvgClose } from '../../utils/Icons';
import { colors } from '../../theme';
import { deleteNotebook } from '../../apis/delete';
import { screenHeight } from '../../utils/common';
import styled from 'styled-components/native';
import { updateNotebook as updateNotebookApis } from '../../apis/update';
import useNotebooksProvider from '../../providers/notebooksProvider';

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

const RemoveVocaListButton = styled.TouchableOpacity`
  padding: 10px 0;
  width: 30%;
`;

const RemoveVocaListText = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.negative};
`;

interface Props {
  notebookUID: string;
  title: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  cancel: () => void;
}

function EditCollectionModal(props: Props): ReactElement {
  const { notebookUID, showModal, setShowModal, cancel, title } = props;
  const { updateNotebook, removeNotebook } = useNotebooksProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [vocaListTitle, setVocaListTitle] = useState<string>(title);

  const pressCancel = (): void => {
    cancel();
    setVocaListTitle('');
  };

  const pressComplete = async (): Promise<void> => {
    try {
      setLoading(true);

      const updateResult = await updateNotebookApis(notebookUID, vocaListTitle);

      if (updateResult) {
        updateNotebook(notebookUID, vocaListTitle);
      }

      setLoading(false);
      pressCancel();
      setVocaListTitle('');
    } catch (error) {
      console.log(error);
    }
  };

  const pressRemove = () => {
    Alert.alert(
      '단어장 삭제하기',
      `'${title}'를 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: '삭제', onPress: requestRemove },
      ],
      { cancelable: false },
    );
  };

  const requestRemove = async () => {
    const deleteResult = await deleteNotebook(notebookUID);

    if (deleteResult) {
      removeNotebook(deleteResult);
      setShowModal(false);
      return;
    }

    Alert.alert('다시 시도해주세요 :(');
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
              <HeaderTitle>단어장 수정</HeaderTitle>
            </Header>
            <Wrapper>
              <Title>단어장 이름</Title>
              <InputWrapper>
                <Input
                  multiline={true}
                  value={vocaListTitle}
                  onChangeText={(text) => setVocaListTitle(text)}
                  placeholder={'단어장 이름을 입력해주세요 :)'}
                  placeholderTextColor={colors.lightGray5}
                />
              </InputWrapper>
              <RemoveVocaListButton onPress={pressRemove}>
                <RemoveVocaListText>단어장 삭제</RemoveVocaListText>
              </RemoveVocaListButton>
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
