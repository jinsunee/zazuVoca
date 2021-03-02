import {
  Alert,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { ReactElement, useState } from 'react';

import Button from '../shared/Button';
import EditText from '../shared/EditText';
import { SvgBack } from '../../utils/Icons';
import auth from '@react-native-firebase/auth';
import { colors } from '../../theme';
import { confirmUserForEmail } from '../../apis/fetch';
import { signInEmail } from '../../apis/fetch';
import { signUpForEmail } from '../../apis/insert';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useUser from '../../providers/userProvider';
import { validateEmail } from '../../utils/common';

enum ScreenType {
  INSERT_EMAIL,
  SIGN_IN,
  SIGN_UP,
}

function Page(): ReactElement {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { user, setUser } = useUser();

  const [screenType, setScreenType] = useState<ScreenType>(
    ScreenType.INSERT_EMAIL,
  );

  const [loading, setLoading] = useState<boolean>(false);

  const [email, setEmail] = useState<string>('');
  const [warningEmail, setWarningEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [warningPassword, setWarningPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [warningConfirmPassword, setWarningConfirmPassword] = useState<string>(
    '',
  );

  const currentUser = auth().currentUser;

  const goBack = () => {
    navigation.goBack();
  };

  const renderView = (): ReactElement => {
    switch (screenType) {
      case ScreenType.INSERT_EMAIL: {
        const pressNextButton = async () => {
          if (currentUser) {
            setLoading(true);

            if (!email || !validateEmail(email)) {
              setWarningEmail('올바른 이메일 형식으로 입력해주세요.');
              setLoading(false);
              return;
            }

            if (currentUser.emailVerified) {
              setLoading(false);
              setScreenType(ScreenType.SIGN_IN);
              return;
            }

            const result = await confirmUserForEmail(email);

            if (result || currentUser.email) {
              setLoading(false);
              setScreenType(ScreenType.SIGN_IN);
            } else {
              setLoading(false);
              setScreenType(ScreenType.SIGN_UP);
            }

            return;
          }

          Alert.alert('앱 종료 후, 다시 시도해주세겠어요?? :(');
        };

        return (
          <>
            <EditText
              title="이메일"
              value={email}
              onChangeValue={(text: string) => setEmail(text)}
              placeHolderText="이메일을 입력해주세요."
              warning={warningEmail}
            />
            <Button
              text="다음"
              pressButton={pressNextButton}
              loading={loading}
            />
          </>
        );
      }
      case ScreenType.SIGN_UP: {
        const pressSignUp = async () => {
          if (currentUser) {
            setLoading(true);
            if (!password) {
              setWarningPassword('비밀번호를 입력해주세요.');
              setWarningConfirmPassword('');
              setLoading(false);
              return;
            }

            if (password !== confirmPassword) {
              setWarningConfirmPassword('같은 비밀번호를 입력해주세요.');
              setWarningPassword('');
              setLoading(false);
              return;
            }

            const result = await signUpForEmail(email, password);

            if (!result) {
              setLoading(false);
              Alert.alert('앱 종료 후, 다시 시도해주세겠어요?? :(');
            }

            // 성공하면
            setUser({
              ...user,
              email,
              emailVerified: false,
            });
            Alert.alert(
              `${email}로 이메일인증 메일을 전송했습니다. 완료해주세요`,
            );
            goBack();

            return;
          }

          Alert.alert('앱 종료 후, 다시 시도해주세겠어요?? :(');
        };

        return (
          <>
            <EditText
              title="비밀번호"
              value={password}
              onChangeValue={(text: string) => setPassword(text)}
              placeHolderText="비밀번호를 입력해주세요."
              warning={warningPassword}
              secret={true}
            />
            <EditText
              title="비밀번호 확인"
              value={confirmPassword}
              onChangeValue={(text: string) => setConfirmPassword(text)}
              placeHolderText="비밀번호를 다시 입력해주세요."
              warning={warningConfirmPassword}
              secret={true}
            />
            <Button
              text="회원가입"
              pressButton={pressSignUp}
              loading={loading}
            />
          </>
        );
      }
      case ScreenType.SIGN_IN:
      default: {
        const pressSignIn = async () => {
          if (currentUser) {
            setLoading(true);
            if (!password) {
              setWarningPassword('비밀번호를 입력해주세요.');
              setLoading(false);
              return;
            }

            const result = await signInEmail(email, password);

            if (!result) {
              setWarningPassword('');
              setLoading(false);
              Alert.alert('앱 종료 후, 다시 시도해주세겠어요?? :(');
              return;
            }

            if (result === 'emailVerifiedFalse') {
              setWarningPassword(`${email}의 이메일 인증메일을 확인해주세요.`);
              setLoading(false);
              return;
            }

            // 로그인 성공
            setUser({
              ...user,
              userUID: result,
              email,
              emailVerified: true,
            });

            return;
          }
          Alert.alert('앱 종료 후, 다시 시도해주세겠어요?? :(');
        };

        return (
          <>
            <EditText
              title="비밀번호"
              value={password}
              onChangeValue={(text: string) => setPassword(text)}
              placeHolderText="비밀번호를 입력해주세요."
              warning={warningPassword}
              secret={true}
            />
            <Button text="로그인" pressButton={pressSignIn} loading={loading} />
          </>
        );
      }
    }
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <KeyboardAvoiding behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableWithoutFeedback onPress={(): void => Keyboard.dismiss()}>
          <Container>
            <Header>
              <CloseButton onPress={goBack}>
                <SvgBack />
              </CloseButton>
              <HeaderTitle>이메일로 계속하기</HeaderTitle>
            </Header>
            {renderView()}
          </Container>
        </TouchableWithoutFeedback>
      </KeyboardAvoiding>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColorDark};
`;

const KeyboardAvoiding = styled.KeyboardAvoidingView`
  flex: 1;
  justify-content: center;
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

export default Page;
