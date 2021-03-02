import { ActivityIndicator, FlatList, Keyboard } from 'react-native';
import React, { ReactElement, useEffect, useState } from 'react';
import { SvgLogo, SvgMenu, SvgPlusMain, SvgSearch } from '../../utils/Icons';

import AddNotebookModal from '../shared/AddNotebookModal';
import AsyncStorage from '@react-native-community/async-storage';
import NotebookItem from '../shared/NotebookItem';
import { NotebookType } from '../../types';
import { Pressable } from 'react-native';
import { colors } from '../../theme';
import { fetchNotebooks } from '../../apis/fetch';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import useNotebooksProvider from '../../providers/notebooksProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useUser from '../../providers/userProvider';

function Main(): ReactElement {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, setUser } = useUser();

  const { notebooks, setNotebooks } = useNotebooksProvider();

  const [shownModal, setShownModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      fetchNotebooksInFirebase(user.userUID);
    } else {
      fetchNotebooksInAsyncStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchNotebooksInAsyncStorage = async () => {
    try {
      setLoading(true);
      const result = await AsyncStorage.getItem('notebooks');

      if (result) {
        const tmp = JSON.parse(result);

        setNotebooks([
          {
            notebookUID: tmp.notebookUID,
            title: tmp.title,
            date: new Date(tmp.date),
          },
        ]);
        setLoading(false);
        return;
      }

      const nowDate = new Date();

      const tmpNotebook: NotebookType = {
        notebookUID: '임시단어장',
        title: '임시 단어장이에요. 제목을 수정해보세요 :)',
        date: nowDate,
      };
      setNotebooks([tmpNotebook]);
      AsyncStorage.setItem('notebooks', JSON.stringify(tmpNotebook));

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNotebooksInFirebase = async (userUID: string) => {
    setLoading(true);
    const result = await fetchNotebooks(userUID);

    if (result) {
      setNotebooks(result);
    }
    setLoading(false);
  };

  const pressSetting = (): void => {
    goToOther('Auth');
  };

  const pressAddNotebook = () => {
    if (!user) {
      goToOther('Auth');
      return;
    }

    setShownModal(true);
  };

  const goToOther = (where: string, item?: Object): void => {
    if (navigation) {
      if (item) {
        navigation.navigate(where, item);
        return;
      }

      navigation.navigate(where);
    }
  };

  const pressCancel = (): void => {
    Keyboard.dismiss();
    setShownModal(false);
  };

  if (loading) {
    return (
      <Container style={{ paddingTop: insets.top }}>
        <Header>
          <HeaderLogoWrapper>
            <SvgLogo width={100} height={20} />
          </HeaderLogoWrapper>
          <UserButton onPress={pressSetting}>
            <SvgMenu fill={colors.light} />
          </UserButton>
        </Header>
        <ActivityIndicator color={colors.light} size={16} />
      </Container>
    );
  }

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <HeaderLogoWrapper>
          <SvgLogo width={100} height={20} />
        </HeaderLogoWrapper>
        <UserButton onPress={pressSetting}>
          <SvgMenu fill={colors.light} />
        </UserButton>
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
              pressItem={(): void => goToOther('Notebook', { notebook: item })}
            />
          );
        }}
        ListHeaderComponent={(): ReactElement => {
          return (
            <>
              <GoToAddVocaButton onPress={(): void => goToOther('SearchVoca')}>
                <SvgSearch />
                <GoToAddVocaText>단어 검색하고 저장하기</GoToAddVocaText>
              </GoToAddVocaButton>
              <FlatListHeader>
                <FlatListHeaderButton onPress={pressAddNotebook}>
                  <SvgPlusMain />
                  <FlatLIstHeaderAddButtonText>
                    단어장 추가
                  </FlatLIstHeaderAddButtonText>
                </FlatListHeaderButton>
              </FlatListHeader>
            </>
          );
        }}
        ListEmptyComponent={(): ReactElement => {
          return (
            <EmptyElement>
              <EmptyText>단어장을 추가해보세요!</EmptyText>
            </EmptyElement>
          );
        }}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
      />
      <AddNotebookModal showModal={shownModal} cancel={pressCancel} />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColorDark};
`;

const Header = styled.View`
  width: 100%;
  padding: 20px 0;
`;

const UserButton = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const HeaderLogoWrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

const GoToAddVocaButton = styled(Pressable)`
  border-width: 1px;
  border-color: ${colors.primary};
  margin: 0 20px;
  flex-direction: row;
  padding: 15px;
`;

const GoToAddVocaText = styled.Text`
  font-weight: 500;
  font-size: 17px;
  margin-left: 20px;
  color: ${colors.lightGray6};
`;

const FlatListHeader = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const FlatListHeaderButton = styled.TouchableOpacity`
  flex-direction: row;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const FlatLIstHeaderAddButtonText = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${colors.primary};
  margin-left: 5px;
`;

const EmptyElement = styled.View`
  flex: 1;
  padding-top: 100px;
  align-items: center;
`;

const EmptyText = styled.Text`
  font-weight: 700;
  font-size: 20px;
  color: ${colors.lightGray5};
`;

export default Main;
