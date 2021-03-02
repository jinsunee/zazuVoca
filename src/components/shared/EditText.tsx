import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { ViewStyle } from 'react-native';
import { colors } from '../../theme';
import styled from 'styled-components/native';

interface Props {
  title?: string;
  value: string;
  onChangeValue: (input: string) => void;
  warning: string;
  containerStyle?: ViewStyle;
  placeHolderText?: string;
  placeholderTextColor?: string;
  secret?: boolean;
}

function EditText(props: Props) {
  const {
    title = '제목',
    value,
    onChangeValue,
    warning = '',
    containerStyle,
    placeHolderText = '입력해주세요.',
    placeholderTextColor = colors.lightGray5,
    secret = false,
  } = props;

  return (
    <>
      <Container style={containerStyle}>
        <Wrapper>
          {renderTitle(title)}
          <Input
            value={value}
            onChangeText={onChangeValue}
            placeholder={placeHolderText}
            placeholderTextColor={placeholderTextColor}
            secureTextEntry={secret}
          />
        </Wrapper>
        <Warning>{warning}</Warning>
      </Container>
    </>
  );
}

const renderTitle = (inputText?: string): React.ReactElement | null => {
  if (inputText) {
    return <Title>{inputText}</Title>;
  }

  return null;
};

const Container = styled.View`
  margin: 0 20px;
`;

const Wrapper = styled.View`
  padding: 10px 0;
  border-bottom-width: 2px;
  border-bottom-color: ${colors.lightGray5};
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${colors.lightGray6};
  margin-bottom: 20px;
`;

const Input = styled.TextInput`
  font-weight: bold;
  font-size: 18px;
  color: ${colors.light};
`;

const Warning = styled.Text`
  font-size: 14px;
  color: ${colors.negative};
  height: 18px;
  margin-top: 5px;
`;

export default EditText;
