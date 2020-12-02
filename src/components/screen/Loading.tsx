import React, { ReactElement } from 'react';

import { ActivityIndicator } from 'react-native-paper';
import { colors } from '../../theme';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: ${colors.backgroundColorDark};
  align-items: center;
  padding-top: 200px;
`;

function Page(): ReactElement {
  return (
    <Container>
      <ActivityIndicator color={colors.lightGray6} />
    </Container>
  );
}

export default Page;
