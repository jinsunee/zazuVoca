import { ItemType, NotebookType } from '../types';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../providers';
import { useCallback } from 'react';

const SET_NOTEBOOKS = 'notebook/SET_NOTEBOOKS' as const;
const UPDATE_NOTEBOOK = 'notebook/UPDATE_NOTEBOOK' as const;
const REMOVE_NOTEBOOK = 'notebook/REMOVE_NOTEBOOK' as const;
const ADD_NOTEBOOK = 'notebook/ADD_NOTEBOOK' as const;

const ADD_ITEM = 'items/ADD_ITEM' as const;
const ADD_ITEMS = 'items/ADD_ITEMS' as const;
const UPDATE_ITEM = 'items/UPDATE_ITEM' as const;
const REMOVE_ITEM = 'items/REMOVE_ITEM' as const;

export const setNotebooksAction = (notebooks: NotebookType[]) => ({
  type: SET_NOTEBOOKS,
  payload: notebooks,
});

export const updateNotebookAction = (notebookUID: string, title: string) => ({
  type: UPDATE_NOTEBOOK,
  payload: {
    notebookUID,
    title,
  },
});

export const removeNotebookAction = (notebookUID: string) => ({
  type: REMOVE_NOTEBOOK,
  payload: notebookUID,
});

export const addNotebookAction = (notebook: NotebookType) => ({
  type: ADD_NOTEBOOK,
  payload: notebook,
});

export const addItemAction = (
  inputNotebookUID: string,
  inputItem: ItemType,
) => ({
  type: ADD_ITEM,
  payload: {
    inputNotebookUID,
    inputItem,
  },
});

export const addItemsAction = (
  inputNotebookUID: string,
  inputItems: ItemType[],
) => ({
  type: ADD_ITEMS,
  payload: {
    inputNotebookUID,
    inputItems,
  },
});

export const updateItemAction = (
  inputNotebookUID: string,
  inputItem: ItemType,
) => ({
  type: UPDATE_ITEM,
  payload: {
    inputNotebookUID,
    inputItem,
  },
});

export const removeItemAction = (
  inputNotebookUID: string,
  inputItemUID: string,
) => ({
  type: REMOVE_ITEM,
  payload: {
    inputNotebookUID,
    inputItemUID,
  },
});

type NotebooksAction =
  | ReturnType<typeof setNotebooksAction>
  | ReturnType<typeof updateNotebookAction>
  | ReturnType<typeof removeNotebookAction>
  | ReturnType<typeof addNotebookAction>
  | ReturnType<typeof addItemAction>
  | ReturnType<typeof addItemsAction>
  | ReturnType<typeof updateItemAction>
  | ReturnType<typeof removeItemAction>;

// const intialState: NotebookType[] = [
//   {
//     notebookUID: '123',
//     title: '임시 단어장이에요. 제목을 수정해보세요 :)',
//     date: '20.11.14',
//   },
// ];

const intialState: NotebookType[] | null = null;

export function notebooksReducer(
  state: NotebookType[] | null = intialState,
  action: NotebooksAction,
) {
  switch (action.type) {
    case SET_NOTEBOOKS: {
      return action.payload;
    }
    case UPDATE_NOTEBOOK: {
      const index =
        state.findIndex((s) => s.notebookUID === action.payload.notebookUID) ||
        0;

      return [
        ...state.slice(0, index),
        {
          ...state[index],
          title: action.payload.title,
        },
        ...state.slice(index + 1),
      ];
    }
    case REMOVE_NOTEBOOK: {
      const index =
        state.findIndex((s) => s.notebookUID === action.payload) || 0;

      return [...state.slice(0, index), ...state.slice(index + 1)];
    }
    case ADD_NOTEBOOK: {
      return [action.payload].concat(state);
    }
    case ADD_ITEM: {
      const index =
        state.findIndex(
          (s) => s.notebookUID === action.payload.inputNotebookUID,
        ) || 0;

      if (state[index].items) {
        return [
          ...state.slice(0, index),
          {
            ...state[index],
            items: state[index].items?.concat([action.payload.inputItem]),
          },
          ...state.slice(index + 1),
        ];
      }

      return [
        ...state.slice(0, index),
        {
          ...state[index],
          items: [action.payload.inputItem],
        },
        ...state.slice(index + 1),
      ];
    }
    case ADD_ITEMS: {
      const index =
        state.findIndex(
          (s) => s.notebookUID === action.payload.inputNotebookUID,
        ) || 0;

      if (state[index].items) {
        return [
          ...state.slice(0, index),
          {
            ...state[index],
            items: state[index].items?.concat(action.payload.inputItems),
          },
          ...state.slice(index + 1),
        ];
      }

      return [
        ...state.slice(0, index),
        {
          ...state[index],
          items: action.payload.inputItems,
        },
        ...state.slice(index + 1),
      ];
    }
    case UPDATE_ITEM: {
      const notebookIndex =
        state.findIndex(
          (s) => s.notebookUID === action.payload.inputNotebookUID,
        ) || 0;

      const itemIndex =
        state[notebookIndex].items?.findIndex(
          (i) => i.itemUID === action.payload.inputItem.itemUID,
        ) || 0;

      return [
        ...state.slice(0, notebookIndex),
        {
          ...state[notebookIndex],
          items: [
            ...state[notebookIndex].items?.slice(0, itemIndex),
            action.payload.inputItem,
            ...state[notebookIndex].items?.slice(itemIndex + 1),
          ],
        },
        ...state.slice(notebookIndex + 1),
      ];
    }
    case REMOVE_ITEM: {
      const notebookIndex =
        state.findIndex(
          (s) => s.notebookUID === action.payload.inputNotebookUID,
        ) || 0;

      const itemIndex =
        state[notebookIndex].items?.findIndex(
          (i) => i.itemUID === action.payload.inputItemUID,
        ) || 0;

      return [
        ...state.slice(0, notebookIndex),
        {
          ...state[notebookIndex],
          items: [
            ...state[notebookIndex].items?.slice(0, itemIndex),
            ...state[notebookIndex].items?.slice(itemIndex + 1),
          ],
        },
        ...state.slice(notebookIndex + 1),
      ];
    }
    default:
      return state;
  }
}

export default function useNotebooksProvider() {
  const notebooks = useSelector((state: RootState) => state.notebooksReducer);
  const dispatch = useDispatch();

  const setNotebooks = useCallback(
    (input: NotebookType[]) => dispatch(setNotebooksAction(input)),
    [dispatch],
  );

  const updateNotebook = useCallback(
    (inputNotebookUID: string, inputTitle: string) =>
      dispatch(updateNotebookAction(inputNotebookUID, inputTitle)),
    [dispatch],
  );

  const removeNotebook = useCallback(
    (inputNotebookUID: string) =>
      dispatch(removeNotebookAction(inputNotebookUID)),
    [dispatch],
  );

  const addNotebook = useCallback(
    (input: NotebookType) => dispatch(addNotebookAction(input)),
    [dispatch],
  );

  const addItem = useCallback(
    (inputNotebookUID: string, inputItem: ItemType) =>
      dispatch(addItemAction(inputNotebookUID, inputItem)),
    [dispatch],
  );

  const addItems = useCallback(
    (inputNotebookUID: string, inputItems: ItemType[]) =>
      dispatch(addItemsAction(inputNotebookUID, inputItems)),
    [dispatch],
  );

  const updateItem = useCallback(
    (inputNotebookUID: string, inputItem: ItemType) =>
      dispatch(updateItemAction(inputNotebookUID, inputItem)),
    [dispatch],
  );

  const removeItem = useCallback(
    (inputNotebookUID: string, inputItemUID: string) =>
      dispatch(removeItemAction(inputNotebookUID, inputItemUID)),
    [dispatch],
  );

  return {
    notebooks,
    setNotebooks,
    updateNotebook,
    removeNotebook,
    addNotebook,
    addItem,
    addItems,
    updateItem,
    removeItem,
  };
}
