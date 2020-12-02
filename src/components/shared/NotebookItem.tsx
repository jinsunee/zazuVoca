import React, { ReactElement } from 'react';

import { NotebookType } from '../../types';
import { SvgRectangle } from '../../utils/Icons';
import { ViewStyle } from 'react-native';
import { colors } from '../../theme';
import { screenWidth } from '../../utils/common';
import styled from 'styled-components/native';

const Container = styled.View`
  width: ${screenWidth / 2}px;
`;

const VocaListItem = styled.TouchableOpacity`
  border-width: 2px;
  border-color: ${colors.lightGray5};
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
  height: 105px;
`;

const VocaListTitle = styled.View`
  flex: 1;
  flex-wrap: nowrap;
  height: 70px;
`;

const VocaListTitleText = styled.Text`
  font-weight: 500;
  font-size: 13px;
  color: ${colors.lightGray6};
`;

const VocaListDate = styled.View``;

const VocaListDateText = styled.Text`
  font-size: 12px;
  color: ${colors.lightGray6};
`;

const RectangleWrapper = styled.View`
  position: absolute;
  right: -3px;
  bottom: -6px;
`;

interface Props {
  containerStyle?: ViewStyle;
  itemContainerStyle?: ViewStyle;
  item: NotebookType;
  pressItem: () => void;
}

function Shared(props: Props): ReactElement {
  const { containerStyle, itemContainerStyle, item, pressItem } = props;
  return (
    <Container style={containerStyle}>
      <VocaListItem style={itemContainerStyle} onPress={pressItem}>
        <VocaListTitle>
          <VocaListTitleText>{item.title}</VocaListTitleText>
        </VocaListTitle>
        <VocaListDate>
          <VocaListDateText>{item.date}</VocaListDateText>
        </VocaListDate>
        <RectangleWrapper>
          <SvgRectangle />
        </RectangleWrapper>
      </VocaListItem>
    </Container>
  );
}

export default Shared;
