import { Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { ReactElement, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SvgBack, SvgPlusVocaListButton } from '../../utils/Icons';

import { ActivityIndicator } from 'react-native-paper';
import { ItemType } from '../../types';
import { StackParamList } from '../navigation/MainStackNavigator';
import { colors } from '../../theme';
import { deleteItem } from '../../apis/delete';
import styled from 'styled-components/native';
import { updateItem as updateItemApi } from '../../apis/update';
import useNotebooksProvider from '../../providers/notebooksProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColorDark};
`;

const Header = styled.View`
  width: 100%;
  align-items: center;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const TitleWrapper = styled.View`
  justify-content: center;
  align-items: center;
  padding: 18px;
`;

const TitleText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${colors.lightGray6};
`;

const Wrapper = styled.ScrollView`
  padding-top: 20px;
`;

const VocaText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.lightGray6};
  margin-left: 20px;
`;

const MeaningText = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.lightGray6};
  margin-left: 20px;
  margin-top: 20px;
`;

const InputWrapper = styled.View`
  padding: 10px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray5};
  margin: 10px 0;
`;

const Input = styled.TextInput`
  font-size: 14px;
  font-weight: bold;
  color: ${colors.light};
  margin-left: 20px;
`;

const AddMeaningButton = styled.TouchableOpacity`
  padding: 10px 0;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const AddMeaningButtonText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${colors.primary};
  margin-left: 5px;
`;

const CompleteButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const CompleteText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${colors.lightGray6};
`;

const DeleteButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  flex: 1;
`;

const DeleteButton = styled.TouchableOpacity`
  padding: 10px 20px;
  justify-content: center;
  align-items: center;
`;

const DeleteText = styled.Text`
  font-size: 13px;
  font-weight: 500;
  color: ${colors.negative};
`;

function UpdateItem(): ReactElement {
  const route = useRoute<RouteProp<StackParamList, 'UpdateItem'>>();

  const {
    params: { notebookUID, item },
  } = route;

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { updateItem, removeItem } = useNotebooksProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [voca, setVoca] = useState<string>(item.front);
  const [meaning, setMeaning] = useState<string[]>(item.back);

  const goToBack = (): void => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const addMeaningItem = (): void => {
    setMeaning((prev) => prev.concat(''));
  };

  const keyboardDismiss = (): void => {
    Keyboard.dismiss();
  };

  const pressComplete = async (): Promise<void> => {
    try {
      setLoading(true);

      const newItem: ItemType = {
        itemUID: item.itemUID,
        front: voca,
        back: meaning,
      };

      const updateResult = await updateItemApi(notebookUID, newItem);

      if (updateResult) {
        updateItem(notebookUID, newItem);
      }
      setLoading(false);
      goToBack();
    } catch (error) {
      console.log(error);
    }
  };

  const pressRemove = () => {
    Alert.alert(
      '단어장 삭제하기',
      '단어를 삭제하시겠습니까?',
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
    const deleteResult = await deleteItem(notebookUID, item.itemUID);

    if (deleteResult) {
      removeItem(notebookUID, item.itemUID);
      goToBack();
      return;
    }

    Alert.alert('다시 시도해주세요 :(');
  };

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header>
        <BackButton onPress={goToBack}>
          <SvgBack fill={colors.light} />
        </BackButton>
        <TitleWrapper>
          <TitleText>단어 수정하기</TitleText>
        </TitleWrapper>
        <CompleteButton onPress={pressComplete}>
          {loading ? (
            <ActivityIndicator size={16} color={colors.light} />
          ) : (
            <CompleteText>완료</CompleteText>
          )}
        </CompleteButton>
      </Header>
      <TouchableWithoutFeedback onPress={keyboardDismiss}>
        <Wrapper>
          <VocaText>단어</VocaText>
          <InputWrapper>
            <Input
              multiline={true}
              value={voca}
              onChangeText={(text) => setVoca(text)}
              placeholder={'입력해주세요 :)'}
              placeholderTextColor={colors.lightGray5}
            />
          </InputWrapper>
          <MeaningText>뜻</MeaningText>
          {meaning.map(
            (m, index): ReactElement => (
              <InputWrapper>
                <Input
                  multiline={true}
                  value={m}
                  onChangeText={(text) => {
                    setMeaning((prev) => {
                      return [
                        ...prev.slice(0, index),
                        text,
                        ...prev.slice(index + 1),
                      ];
                    });
                  }}
                  placeholder={'뜻을 입력해주세요 :)'}
                  placeholderTextColor={colors.lightGray5}
                />
              </InputWrapper>
            ),
          )}
          <AddMeaningButton onPress={addMeaningItem}>
            <SvgPlusVocaListButton />
            <AddMeaningButtonText>뜻 추가</AddMeaningButtonText>
          </AddMeaningButton>
          <DeleteButtonWrapper>
            <DeleteButton onPress={pressRemove}>
              <DeleteText>단어 삭제</DeleteText>
            </DeleteButton>
          </DeleteButtonWrapper>
        </Wrapper>
      </TouchableWithoutFeedback>
    </Container>
  );
}

export default UpdateItem;
