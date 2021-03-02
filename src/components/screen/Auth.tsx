import { ActivityIndicator, Pressable, View } from 'react-native';
import React, { ReactElement, useEffect, useState } from 'react';
import { SvgApple, SvgClose, SvgSmile } from '../../utils/Icons';
import { appleAuth, pressAppleButton } from '../../apis/insert';

import { colors } from '../../theme';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Page(): ReactElement {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // const currentUser = auth().currentUser;
  const [loadingApple, setLoadingApple] = useState<boolean>(false);

  useEffect(() => {
    if (appleAuth.isSupported) {
      return appleAuth.onCredentialRevoked(async () => {
        console.warn(
          'If this function executes, User Credentials have been Revoked',
        );
      });
    }
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const pressApple = async () => {
    setLoadingApple(true);
    await pressAppleButton();
    setLoadingApple(false);
  };

  const renderAppleButton = (): ReactElement | null => {
    if (!appleAuth.isSupported) {
      return null;
    }

    if (loadingApple) {
      return (
        <SocialButton style={{ backgroundColor: colors.light }}>
          <ActivityIndicator color={colors.dark} size={16} />
        </SocialButton>
      );
    }
    return (
      <SocialButton
        style={{ backgroundColor: colors.light }}
        onPress={pressApple}
      >
        <SvgApple fill={colors.dark} />
        <ButtonText>Apple로 계속하기</ButtonText>
      </SocialButton>
    );
  };

  const renderEmailButton = (): ReactElement => {
    const pressButton = () => {
      navigation.navigate('AuthMail');
    };

    return (
      <EmailButton onPress={pressButton}>
        <ButtonText style={{ color: colors.light }}>
          이메일로 계속하기
        </ButtonText>
      </EmailButton>
    );
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Container>
        <Header>
          <CloseButton onPress={goBack}>
            <SvgClose />
          </CloseButton>
          <HeaderTitle>로그인 및 회원가입</HeaderTitle>
        </Header>
        <RowWrapper>
          <View>
            <InfoText>단어장을 추가하고</InfoText>
            <InfoText>안전하게 보관할 수 있어요! :)</InfoText>
          </View>
          <SvgSmile />
        </RowWrapper>
        {renderEmailButton()}
        {renderAppleButton()}
      </Container>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColorDark};
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

const RowWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 20px 20px;
  margin-bottom: 50px;
`;

const InfoText = styled.Text`
  color: ${colors.lightGray6};
  font-weight: 500;
  font-size: 20px;
`;

const SocialButton = styled(Pressable)`
  border-radius: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin: 0 20px 15px 20px;
  background-color: ${colors.light};
`;

const EmailButton = styled(Pressable)`
  border-radius: 10px;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin: 0 20px 15px 20px;
  border-width: 1px;
  border-color: ${colors.light};
  background-color: transparent;
`;

const ButtonText = styled.Text`
  color: ${colors.dark};
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

export default Page;
