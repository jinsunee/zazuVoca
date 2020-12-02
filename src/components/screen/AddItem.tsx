import { Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import React, { ReactElement, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SvgBack, SvgPlusVocaListButton } from '../../utils/Icons';

import { ActivityIndicator } from 'react-native-paper';
import { StackParamList } from '../navigation/MainStackNavigator';
import { colors } from '../../theme';
import { insertItem } from '../../apis/insert';
import styled from 'styled-components/native';
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

function AddVoca(): ReactElement {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const route = useRoute<RouteProp<StackParamList, 'AddItem'>>();
  const {
    params: { notebookUID },
  } = route;

  const { addItem } = useNotebooksProvider();

  const [loading, setLoading] = useState<boolean>(false);
  const [voca, setVoca] = useState<string>();
  const [meaning, setMeaning] = useState<string[]>(['']);

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
      if (!voca || !meaning) {
        Alert.alert('폼을 채워주세요');
        return;
      }

      setLoading(true);

      const insertResult = await insertItem(notebookUID, voca, meaning);

      if (insertResult) {
        addItem(notebookUID, {
          itemUID: insertResult,
          front: voca,
          back: meaning,
        });
      }

      setLoading(false);
      setVoca('');
      setMeaning(['']);
      // goToBack();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header>
        <BackButton onPress={goToBack}>
          <SvgBack fill={colors.light} />
        </BackButton>
        <TitleWrapper>
          <TitleText>단어 추가하기</TitleText>
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
              onChangeText={(text) => setVoca(text.toLowerCase())}
              placeholder={'입력해주세요 :)'}
              placeholderTextColor={colors.lightGray5}
            />
          </InputWrapper>
          <MeaningText>뜻</MeaningText>
          {meaning.map(
            (m, index): ReactElement => (
              <InputWrapper key={`item__${index}`}>
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
        </Wrapper>
      </TouchableWithoutFeedback>
    </Container>
  );
}

export default AddVoca;
