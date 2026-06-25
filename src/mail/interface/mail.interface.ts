export interface MailjetResponse {
  Messages: {
    Status: string;
    To: {
      Email: string;
      MessageUUID: string;
      MessageID: number;
    }[];
  }[];
}
