/* eslint-disable react-native/no-inline-styles */
import { FlatList, Pressable, View } from 'react-native';
import React, { ReactElement } from 'react';
import { SvgClose, SvgModalBar, SvgPlusVocaList } from '../../utils/Icons';

import Modal from 'react-native-modal';
import NotebookItem from './NotebookItem';
import { colors } from '../../theme';
import { screenHeight } from '../../utils/common';
import styled from 'styled-components/native';
import useNotebooksProvider from '../../providers/notebooksProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Container = styled.View`
  /* background-color: ${({ theme }): string => theme.background}; */
  background-color: ${colors.backgroundColorDark};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  /* align-items: center; */
  max-height: ${screenHeight * 0.9}px;
`;

const SvgBarWrapper = styled(Pressable)`
  align-items: center;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 20px;
`;

const Header = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  left: 20px;
`;

const HeaderTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.lightGray6};
`;

const AddVocaListButton = styled(Pressable)`
  position: absolute;
  bottom: 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${colors.primary};
  width: 100%;
`;

const AddVocaListText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${colors.backgroundColorDark};
  margin-left: 5px;
`;

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  setNotebookIndex: (index: number) => void;
  addVocaList: () => void;
}

function EditCollectionModal(props: Props): ReactElement {
  const { showModal, setShowModal, setNotebookIndex, addVocaList } = props;
  const { notebooks } = useNotebooksProvider();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      isVisible={showModal}
      onBackdropPress={(): void => setShowModal(false)}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <Container>
        <SvgBarWrapper onPress={(): void => setShowModal(false)}>
          <SvgModalBar />
        </SvgBarWrapper>
        <Header>
          <CloseButton onPress={(): void => setShowModal(false)}>
            <SvgClose />
          </CloseButton>
          <HeaderTitle>단어장 선택</HeaderTitle>
        </Header>
        <FlatList
          data={notebooks}
          keyExtractor={(item, index): string => index.toString()}
          key={2}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }): ReactElement => {
            const m =
              index % 2 === 0
                ? { marginLeft: 20, marginRight: 5 }
                : { marginRight: 20, marginLeft: 5 };
            return (
              <NotebookItem
                itemContainerStyle={m}
                item={item}
                pressItem={(): void => setNotebookIndex(index)}
              />
            );
          }}
          contentContainerStyle={{
            marginTop: 10,
            paddingBottom: insets.bottom + 76,
          }}
        />
        <AddVocaListButton
          style={{ paddingTop: 20, paddingBottom: insets.bottom + 20 }}
          onPress={addVocaList}
        >
          <SvgPlusVocaList />
          <AddVocaListText>단어장 만들기</AddVocaListText>
        </AddVocaListButton>
      </Container>
    </Modal>
  );
}

export default EditCollectionModal;
