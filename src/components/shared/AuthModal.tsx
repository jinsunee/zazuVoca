/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { ReactElement, useEffect, useState } from 'react';
import { SvgApple, SvgClose, SvgFacebook } from '../../utils/Icons';

import Modal from 'react-native-modal';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import { colors } from '../../theme';
import { confirmUserUID } from '../../apis/fetch';
import { screenHeight } from '../../utils/common';
import styled from 'styled-components/native';
import useUserProvider from '../../providers/userProvider';

const Container = styled.View`
  /* background-color: ${({ theme }): string => theme.background}; */
  background-color: ${colors.backgroundColorDark};
  border-radius: 20px;
  border-radius: 20px;
  align-items: center;
  max-height: ${screenHeight * 0.9}px;
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

const Wrapper = styled.View`
  width: 100%;
  padding: 20px;
`;

const StyledText = styled.Text`
  color: ${colors.lightGray6};
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 20px;
`;

const SocialButton = styled(Pressable)`
  border-radius: 10px;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 50px;
`;

const SocialButtonText = styled.Text`
  color: ${colors.light};
  font-size: 14px;
  font-weight: bold;
  margin-left: 10px;
`;

interface Props {
  showModal: boolean;
  cancel: () => void;
}

async function onAppleButtonPress() {
  // 1). start a apple sign-in request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });

  // 2). if the request was successful, extract the token and nonce
  const { identityToken, nonce } = appleAuthRequestResponse;
  // can be null in some scenarios
  if (identityToken) {
    // 3). create a Firebase `AppleAuthProvider` credential
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );

    // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
    //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
    //     to link the account to an existing user
    const currentUser = auth().currentUser;
    if (currentUser) {
      // confirm whether user is already signIn or not
      const confirmUserWhetherSignIn = await confirmUserUID(currentUser.uid);

      if (!confirmUserWhetherSignIn) {
        const userCredential = await currentUser.linkWithCredential(
          appleCredential,
        );

        return;
      }

      await auth().signInWithCredential(appleCredential);
    }
    //   const user = userCredential.user;
    //   console.log('Anonymous account successfully upgraded', user);
    // }

    // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
    // console.warn(
    //   `Firebase authenticated via Apple, UID: ${userCredential.user.uid}`,
    // );
  } else {
    // handle this - retry?
  }
}

function AuthModal(props: Props): ReactElement {
  const { showModal, cancel } = props;
  const { user } = useUserProvider();

  const [loadingApple, setLoadingApple] = useState<boolean>(false);
  const [loadingFacebook, setLoadingFacebook] = useState<boolean>(false);

  useEffect(() => {
    if (appleAuth.isSupported) {
      // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
      return appleAuth.onCredentialRevoked(async () => {
        console.warn(
          'If this function executes, User Credentials have been Revoked',
        );
      });
    }
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  const pressCancel = (): void => {
    cancel();
    setLoadingApple(false);
    setLoadingFacebook(false);
  };

  const pressApple = async () => {
    setLoadingApple(true);
    await onAppleButtonPress();
    setLoadingApple(false);
  };

  const pressFacebook = async () => {
    setLoadingFacebook(true);
  };

  const renderButton = (platform: string): ReactElement => {
    if (platform === 'apple') {
      if (loadingApple) {
        return (
          <SocialButton
            style={{ backgroundColor: colors.light, marginBottom: 10 }}
          >
            <ActivityIndicator color="#000000" size={16} />
          </SocialButton>
        );
      }
      return (
        <SocialButton
          style={{ backgroundColor: colors.light, marginBottom: 10 }}
          onPress={pressApple}
        >
          <SvgApple fill={'#000000'} />
          <SocialButtonText style={{ color: '#000000' }}>
            Apple로 계속하기
          </SocialButtonText>
        </SocialButton>
      );
    }

    if (loadingFacebook) {
      return (
        <SocialButton style={{ backgroundColor: '#395185' }}>
          <ActivityIndicator color={colors.light} size={16} />
        </SocialButton>
      );
    }
    return (
      <SocialButton
        style={{ backgroundColor: '#395185' }}
        onPress={pressFacebook}
      >
        <SvgFacebook />
        <SocialButtonText>Facebook으로 계속하기</SocialButtonText>
      </SocialButton>
    );
  };

  return (
    <Modal
      isVisible={showModal}
      onBackButtonPress={cancel}
      style={{
        margin: 0,
        padding: 20,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        <TouchableWithoutFeedback onPress={(): void => Keyboard.dismiss()}>
          <Container>
            <Header>
              <CloseButton onPress={pressCancel}>
                <SvgClose />
              </CloseButton>
              <HeaderTitle>로그인 또는 회원가입</HeaderTitle>
            </Header>
            <Wrapper>
              <StyledText>
                단어장을 추가하고 안전하게 보관할 수 있어요! :)
              </StyledText>
              {appleAuth.isSupported ? renderButton('apple') : null}
              {renderButton('facebook')}
            </Wrapper>
          </Container>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default AuthModal;
