export enum ThemeType {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface VocaType {
  vocaUID: string;
  vocaListUID: string;
  voca: string;
  meaning: string[];
}

export interface VocaListType {
  vocaListUID: string;
  title: string;
  date: string;
}

export interface User {
  userUID: string;
  userName: string;
  profileImage: string;
}

export interface NotebookType {
  notebookUID: string;
  title: string;
  // tag: string[]; // default: 'english'
  date: string; // 20.11.23
  items?: ItemType[];
}

export interface ItemType {
  itemUID: string;
  front: string; // 앞
  back: string[]; // 뒤
}
