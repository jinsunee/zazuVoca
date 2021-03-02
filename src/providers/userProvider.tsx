import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../providers';
import { User } from '../types';
import { useCallback } from 'react';

const SET_USER = 'user/SET_USER' as const;
const RESET_USER = 'user/RESET_USER' as const;

export const setUserAction = (user: User) => ({
  type: SET_USER,
  payload: user,
});

export const resetUserAction = () => ({
  type: RESET_USER,
});

type UserAction =
  | ReturnType<typeof setUserAction>
  | ReturnType<typeof resetUserAction>;

const initialState: User | null = null;

export function userReducer(
  state: User | null = initialState,
  action: UserAction,
) {
  switch (action.type) {
    case SET_USER: {
      return action.payload;
    }
    case RESET_USER: {
      return initialState;
    }
    default:
      return state;
  }
}

export default function useUserProvider() {
  const user = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();

  const setUser = useCallback((input: User) => dispatch(setUserAction(input)), [
    dispatch,
  ]);

  const resetUser = useCallback(() => dispatch(resetUserAction()), [dispatch]);

  return {
    user,
    setUser,
    resetUser,
  };
}
