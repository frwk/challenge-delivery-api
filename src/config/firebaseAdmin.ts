import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { Messaging, getMessaging } from 'firebase-admin/messaging';

class FirebaseAdmin {
  private static instance: FirebaseAdmin;
  private messagingService;

  private constructor() {
    const app = initializeApp({
      credential: applicationDefault(),
    });
    this.messagingService = getMessaging(app);
  }

  public static getInstance(): FirebaseAdmin {
    if (!this.instance) {
      this.instance = new FirebaseAdmin();
    }
    return this.instance;
  }

  public getMessaging(): Messaging {
    return this.messagingService;
  }
}

export default FirebaseAdmin;
