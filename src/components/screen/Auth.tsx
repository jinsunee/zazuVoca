import { ActivityIndicator, Pressable } from 'react-native';
import React, { ReactElement, useState } from 'react';
import { SvgApple, SvgBack } from '../../utils/Icons';

import auth from '@react-native-firebase/auth';
import { colors } from '../../theme';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColorDark};
`;

const Header = styled.View`
  width: 100%;
`;

const BackButton = styled.TouchableOpacity`
  padding: 15px;
  justify-content: center;
`;

const Wrapper = styled.View`
  flex: 1;
  padding: 15px;
`;

const UserWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const IDWrapper = styled.View`
  width: 230px;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
`;

const IDText = styled.Text`
  font-weight: 500;
  font-size: 14px;
  color: ${colors.light};
  padding: 0 10px;
`;

const SignOutButton = styled(Pressable)`
  width: 80px;
  height: 40px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${colors.light};
  justify-content: center;
  align-items: center;
`;

const SignOutButtonText = styled.Text`
  font-weight: 500;
  font-size: 16px;
  color: ${colors.light};
`;

function Page(): ReactElement {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const currentUser = auth().currentUser;

  const [loadingSignOut, setLoadingSignOut] = useState<boolean>(false);

  const goToBack = (): void => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const signOut = async () => {
    setLoadingSignOut(true);
    await auth().signOut();
    setTimeout(() => {
      goToBack();
    }, 2000);
  };

  const renderHeader = (): ReactElement => {
    return (
      <Header>
        <BackButton onPress={goToBack}>
          <SvgBack fill={colors.light} />
        </BackButton>
      </Header>
    );
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      {renderHeader()}
      <Wrapper>
        <UserWrapper>
          {/* <TitleText>게스트 로그인</TitleText> */}
          <IDWrapper>
            <SvgApple fill={colors.light} width={20} height={20} />
            <IDText>{currentUser?.email}</IDText>
          </IDWrapper>
          <SignOutButton onPress={signOut}>
            {loadingSignOut ? (
              <ActivityIndicator size={12} color={colors.light} />
            ) : (
              <SignOutButtonText>로그아웃</SignOutButtonText>
            )}
          </SignOutButton>
        </UserWrapper>
      </Wrapper>
    </Container>
  );
}

export default Page;
