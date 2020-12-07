import { Animated, PanResponder, Pressable, View } from 'react-native';
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

const SWIPE_THRESHOLD = 5;

function Card(props: Props): ReactElement {
  const {
    data,
    isPress,
    setIsPress,
    currentCardIndex,
    setCurrentCardIndex,
  } = props;

  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (
          gestureState.dx < SWIPE_THRESHOLD &&
          gestureState.dx > -SWIPE_THRESHOLD
        ) {
          setIsPress(true);
        } else if (gestureState.dx > SWIPE_THRESHOLD) {
          setIsPress(false);
          setCurrentCardIndex((prev: number): number => {
            if (prev === 0) {
              return 0;
            }

            return prev - 1;
          });
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          setIsPress(false);
          setCurrentCardIndex((prev: number): number => {
            if (prev >= (data?.length || 0) - 1) {
              return (data?.length || 0) - 1;
            }

            return prev + 1;
          });
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  ).current;

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
      <CardWrapper>
        <CardVocaText>{item.front}</CardVocaText>
      </CardWrapper>
    );
  };

  return (
    <View {...panResponder.panHandlers} key={`item__${currentCardIndex}`}>
      {data ? renderCard(data[currentCardIndex], 0) : null}
    </View>
  );
}

export default Card;
