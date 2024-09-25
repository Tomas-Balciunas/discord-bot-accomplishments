export interface Messages {
  gif: string;
  id: number | null;
  sprintId: number;
  templateId: number;
}

export interface Sprints {
  fullTitle: string;
  id: number | null;
  title: string;
}

export interface Templates {
  id: number | null;
  message: string;
}

export interface UserMessage {
  id: number | null;
  messageId: number;
  userId: number;
}

export interface Users {
  id: number | null;
  name: string;
  username: string;
}

export interface DB {
  messages: Messages;
  sprints: Sprints;
  templates: Templates;
  userMessage: UserMessage;
  users: Users;
}
