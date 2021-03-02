import { ActivityIndicator, TextStyle, ViewStyle } from 'react-native';

import React from 'react';
import { colors } from '../../theme';
import styled from 'styled-components/native';

interface Props {
  text: string;
  textColor?: string;
  pressButton: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  loading: boolean;
}

function Button(props: Props) {
  const {
    text,
    textColor = colors.primary,
    pressButton,
    containerStyle,
    textStyle,
    loading,
  } = props;

  const renderView: React.ReactElement = loading ? (
    <ActivityIndicator size={16} color={textColor} />
  ) : (
    <StyledText style={textStyle} textColor={textColor}>
      {text}
    </StyledText>
  );

  return (
    <Container onPress={pressButton} style={containerStyle}>
      {renderView}
    </Container>
  );
}

type ContainerStyleProps = {
  border?: boolean;
  buttonColor?: string;
};

const Container = styled.TouchableOpacity<ContainerStyleProps>`
  justify-content: center;
  align-items: center;
  height: 50px;
  border-radius: 10px;
  border-width: 1px;
  border-color: ${colors.primary};
  margin: 20px;
`;

type TextStyleProps = {
  textColor: string;
};

const StyledText = styled.Text<TextStyleProps>`
  color: ${({ textColor }) => textColor};
  font-weight: bold;
  font-size: 16px;
`;

export default Button;
