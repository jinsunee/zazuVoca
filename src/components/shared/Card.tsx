import { Animated, PanResponder, Pressable } from 'react-native';
import React, { ReactElement, useMemo, useState } from 'react';

import { ItemType } from '../../types';
import { colors } from '../../theme';
import { screenWidth } from '../../utils/common';
import styled from 'styled-components/native';

const CardWrapper = styled(Pressable)`
  width: ${screenWidth}px;
  height: 100%;
  background-color: ${colors.backgroundColorDark};
  align-items: center;
  padding: 150px 20px 45px 20px;
`;

const CardVocaText = styled.Text`
  font-weight: bold;
  font-size: 50px;
  color: ${colors.light};
`;

const CardMeaningText = styled.Text`
  font-weight: 300;
  font-size: 45px;
  color: ${colors.light};
  margin-bottom: 20px;
`;

interface Props {
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;
  data: ItemType[] | undefined;
  handleSave: (index: number) => void;
  handleUnsave: (index: number) => void;
  isPress: boolean;
  setIsPress: (isPress: boolean) => void;
}

const SWIPE_THRESHOLD = 0.2 * screenWidth;
// const SWIPE_OUT_DURATION = 250;

// enum SwipeType {
//   LEFT = 'left',
//   RIGHT = 'right',
//   TOP = 'top',
//   BOTTOM = 'bottom',
// }

function Card(props: Props): ReactElement {
  const {
    data,
    isPress,
    setIsPress,
    currentCardIndex,
    setCurrentCardIndex,
  } = props;

  const _panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderRelease: (evt, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD) {
            setIsPress(false);
            setCurrentCardIndex((prev: number): number => {
              if (prev === 0) {
                return 0;
              }

              return prev - 1;
            });
          } else if (gesture.dx < -SWIPE_THRESHOLD) {
            setIsPress(false);
            setCurrentCardIndex((prev: number): number => {
              if (prev >= (data?.length || 0) - 1) {
                return (data?.length || 0) - 1;
              }

              return prev + 1;
            });
          }
        },
      }),
    [],
  );

  const renderCard = (item: ItemType, index: number): ReactElement => {
    if (isPress) {
      return (
        <CardWrapper onTouchEnd={(): void => setIsPress(false)}>
          {item.back.map(
            (i, ind): ReactElement => (
              <CardMeaningText key={`item__${ind}`}>{`${i}`}</CardMeaningText>
            ),
          )}
        </CardWrapper>
      );
    }

    return (
      <CardWrapper onPress={(): void => setIsPress(true)}>
        <CardVocaText>{item.front}</CardVocaText>
      </CardWrapper>
    );
  };

  return (
    <Animated.View
      {..._panResponder.panHandlers}
      key={`item__${currentCardIndex}`}
    >
      {data ? renderCard(data[currentCardIndex], 0) : null}
    </Animated.View>
  );
}

export default Card;
