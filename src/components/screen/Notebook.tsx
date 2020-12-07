import { FlatList, Keyboard, Pressable, View } from 'react-native';
import React, { ReactElement, useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import {
  SvgBack,
  SvgChangeLayout,
  SvgMore,
  SvgPlusVocaListButton,
} from '../../utils/Icons';

import { ActivityIndicator } from 'react-native-paper';
import Card from '../shared/Card';
import { ItemType } from '../../types';
import { StackParamList } from '../navigation/MainStackNavigator';
import UpdateVocaListModal from '../shared/UpdateVocaListModal';
import { colors } from '../../theme';
import { fetchItems } from '../../apis/fetch';
import styled from 'styled-components/native';
import useNotebooksProvider from '../../providers/notebooksProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useUserProvider from '../../providers/userProvider';

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
  padding: 20px 15px;
  justify-content: center;
  align-items: center;
`;

const MoreButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  padding: 20px 15px;
  justify-content: center;
  align-items: center;
`;

const TitleWrapper = styled.View`
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const TitleText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${colors.lightGray6};
`;

const PlainVerticalWrapper = styled(Pressable)`
  width: 100%;
  padding: 15px 0;
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightGray5};
`;

const PlainVerticalVocaTextWrapper = styled.View`
  width: 150px;
  height: 100%;
`;

const PlainVerticalVocaText = styled.Text`
  font-weight: bold;
  font-size: 20px;
  color: ${colors.light};
`;

const PlainVerticalMeaningTextWrapper = styled.View`
  flex: 1;
  height: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  /* background-color: blue; */
`;

const PlainVerticalMeaningText = styled.Text`
  font-size: 20px;
  color: ${colors.light};
  margin-top: 4px;
  margin-left: 5px;
`;

const BottomButtonWrapper = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  flex-direction: row;
  background-color: ${colors.backgroundColorDark};
`;

const BottomButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const BottomButtonText = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-left: 5px;
  color: ${colors.lightGray6};
`;

const LoadingWrapper = styled.View`
  flex: 1;
  margin-top: 200px;
  align-items: center;
`;

const EmptyWrapper = styled.View`
  flex: 1;
  padding-top: 100px;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${colors.lightGray6};
`;

enum LayoutOption {
  SIDE_SLIDE_CARD = 0,
  PLAIN_LIST_VERTICAL = 1,
}

function Notebook(): ReactElement {
  const { user } = useUserProvider();
  const { notebooks, addItems } = useNotebooksProvider();

  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<StackParamList, 'Notebook'>>();

  const {
    params: {
      notebook: { notebookUID, title },
    },
  } = route;

  const [notebookTitle, setNotebookTitle] = useState<string>(title);

  const [loading, setLoading] = useState<boolean>(true);
  const [items, setItems] = useState<ItemType[]>();

  const [isPress, setIsPress] = useState<boolean>(false);
  const [layout, setLayout] = useState<LayoutOption>(
    LayoutOption.PLAIN_LIST_VERTICAL,
  );
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [shownUpdateVocaList, setShownUpdateVocaList] = useState<boolean>(
    false,
  );

  const requestItems = async () => {
    if (user) {
      const itemResult = await fetchItems(user.userUID, notebookUID);

      if (itemResult) {
        setItems(itemResult);
        addItems(notebookUID, itemResult);
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    const index = notebooks.findIndex((n) => n.notebookUID === notebookUID);

    if (index === -1) {
      goToBack();
      return;
    }

    setNotebookTitle(notebooks[index].title);

    if (index !== -1 && !notebooks[index].items) {
      requestItems();
      return;
    }

    setItems(notebooks[index].items);
    setLoading(false);
    setCurrentCardIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebooks]);

  const goToAddItem = (): void => {
    if (navigation) {
      navigation.navigate('AddItem', { notebookUID });
    }
  };

  const goToUpdateItem = (inputItem: ItemType) => {
    if (navigation) {
      navigation.navigate('UpdateItem', { notebookUID, item: inputItem });
    }
  };

  const goToBack = (): void => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const _handleSave = (index: number): void => {
    setCurrentCardIndex(index);
  };

  const _handleUnsave = (index: number): void => {
    setCurrentCardIndex(index);
  };

  const pressCancel = (): void => {
    Keyboard.dismiss();
    setShownUpdateVocaList(false);
  };

  const pressMore = (): void => {
    setShownUpdateVocaList(true);
  };

  const getTitle = (titleString: string): string => {
    if (titleString?.length > 20) {
      return `${titleString.substring(0, 20)} ...`;
    }

    return titleString;
  };

  const changeLayout = (): void => {
    if (layout === LayoutOption.PLAIN_LIST_VERTICAL) {
      setLayout(LayoutOption.SIDE_SLIDE_CARD);
    } else {
      setLayout(LayoutOption.PLAIN_LIST_VERTICAL);
    }
  };

  const renderLayoutElement = (): ReactElement => {
    if (loading) {
      return (
        <LoadingWrapper>
          <ActivityIndicator color={colors.primary} />
        </LoadingWrapper>
      );
    }

    if (!items || items.length === 0) {
      return (
        <EmptyWrapper>
          <EmptyText>단어를 추가해보세요 :)</EmptyText>
        </EmptyWrapper>
      );
    }

    if (layout === LayoutOption.PLAIN_LIST_VERTICAL) {
      return (
        <View>
          <FlatList
            data={items}
            keyExtractor={(item, index): string => index.toString()}
            renderItem={({ item, index }): ReactElement => {
              return (
                <PlainVerticalWrapper
                  key={`item__${item.itemUID}${index}`}
                  onPress={() => goToUpdateItem(item)}
                >
                  <PlainVerticalVocaTextWrapper>
                    <PlainVerticalVocaText>{item.front}</PlainVerticalVocaText>
                  </PlainVerticalVocaTextWrapper>
                  <PlainVerticalMeaningTextWrapper>
                    {item.back.map((i, ind) => (
                      <PlainVerticalMeaningText key={`item__${ind}`}>
                        {i}
                      </PlainVerticalMeaningText>
                    ))}
                  </PlainVerticalMeaningTextWrapper>
                </PlainVerticalWrapper>
              );
            }}
            contentContainerStyle={{
              padding: 15,
              paddingBottom: insets.bottom + 160,
            }}
          />
        </View>
      );
    }

    return (
      <View>
        <Card
          data={items}
          currentCardIndex={currentCardIndex}
          setCurrentCardIndex={setCurrentCardIndex}
          isPress={isPress}
          setIsPress={setIsPress}
          handleSave={_handleSave}
          handleUnsave={_handleUnsave}
        />
      </View>
    );
  };

  return (
    <Container style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <Header>
        <BackButton onPress={goToBack}>
          <SvgBack fill={colors.light} />
        </BackButton>
        <TitleWrapper>
          <TitleText>{getTitle(notebookTitle)}</TitleText>
        </TitleWrapper>
        <MoreButton onPress={pressMore}>
          <SvgMore />
        </MoreButton>
      </Header>
      {renderLayoutElement()}
      <BottomButtonWrapper>
        <BottomButton
          onPress={changeLayout}
          style={{ paddingTop: 10, paddingBottom: insets.bottom + 20 }}
        >
          <SvgChangeLayout />
          <BottomButtonText>리스트로 보기</BottomButtonText>
        </BottomButton>
        <BottomButton
          onPress={goToAddItem}
          style={{ paddingTop: 10, paddingBottom: insets.bottom + 20 }}
        >
          <SvgPlusVocaListButton />
          <BottomButtonText>단어 추가</BottomButtonText>
        </BottomButton>
      </BottomButtonWrapper>
      <UpdateVocaListModal
        notebookUID={notebookUID}
        title={title}
        showModal={shownUpdateVocaList}
        setShowModal={setShownUpdateVocaList}
        cancel={pressCancel}
      />
    </Container>
  );
}

export default Notebook;
