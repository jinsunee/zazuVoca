import React, { ReactElement } from 'react';

import { SvgBack } from '../../utils/Icons';
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
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const BackButton = styled.TouchableOpacity`
  position: absolute;
  left: 0;
  padding: 15px;
  justify-content: center;
`;

const VocaTitleText = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: ${colors.light};
  margin-right: 5px;
`;

const Wrapper = styled.View`
  flex: 1;
  padding-top: 100px;
  align-items: center;
`;

const TitleText = styled.Text`
  font-weight: bold;
  font-size: 25px;
  color: ${colors.light};
  margin-bottom: 10px;
`;

const ContentText = styled.Text`
  font-weight: 500;
  font-size: 20px;
  color: ${colors.light};
`;

function Page(): ReactElement {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const renderHeader = (): ReactElement => {
    return (
      <Header>
        <BackButton onPress={goToBack}>
          <SvgBack fill={colors.light} />
        </BackButton>
        <>
          <VocaTitleText>로그인</VocaTitleText>
        </>
      </Header>
    );
  };

  const goToBack = (): void => {
    if (navigation) {
      navigation.goBack();
    }
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      {renderHeader()}
      <Wrapper>
        <>
          <TitleText>게스트 로그인</TitleText>
          <ContentText>로그인 기능이 추가 될 예정입니다 :)</ContentText>
        </>
      </Wrapper>
    </Container>
  );
}

export default Page;
