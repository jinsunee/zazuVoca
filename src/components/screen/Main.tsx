import { FlatList, Keyboard } from 'react-native';
import React, { ReactElement, useEffect, useState } from 'react';
import { SvgLogo, SvgMenu, SvgPlusMain, SvgSearch } from '../../utils/Icons';

import AddNotebookModal from '../shared/AddNotebookModal';
import AuthModal from '../shared/AuthModal';
import NotebookItem from '../shared/NotebookItem';
import { Pressable } from 'react-native';
import auth from '@react-native-firebase/auth';
import { colors } from '../../theme';
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
  color: ${colors.light};
`;

function Main(): ReactElement {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const currentUser = auth().currentUser;

  const { notebooks } = useNotebooksProvider();

  const [shownModal, setShownModal] = useState<boolean>(false);

  useEffect(() => {
    console.log(currentUser);
  }, []);

  const pressMenuButton = (): void => {
    console.log(currentUser);
    if (currentUser?.isAnonymous || !currentUser) {
      setShownModal(true);
      return;
    }

    goToOther('Auth');
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

  const renderModal = (): ReactElement => {
    if (currentUser?.isAnonymous || !currentUser) {
      return <AuthModal showModal={shownModal} cancel={pressCancel} />;
    }
    return <AddNotebookModal showModal={shownModal} cancel={pressCancel} />;
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <HeaderLogoWrapper>
          <SvgLogo width={100} height={20} />
        </HeaderLogoWrapper>
        <UserButton onPress={pressMenuButton}>
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
                <FlatListHeaderButton onPress={(): void => setShownModal(true)}>
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
      {renderModal()}
    </Container>
  );
}

export default Main;
