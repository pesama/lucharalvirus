import Vue from 'vue';

export interface FrameworkData {
  alerts: FrameworkAlert[];
  subscriptions: FrameworkSubscription[];
  eventBus: Vue;
}

export interface FrameworkAlert {
  type: string,
  message: string,
  date: Date,

  /**
   * @default false
   */
  dismissed?: boolean
}

export interface FrameworkSubscription {
  topicRegex: RegExp,
  handler(topic: string, payload: { [key: string]: any }): void;
}

export default class FrameworkService {
  private static instance: FrameworkService;
  private readonly data: FrameworkData;

  constructor () {

    this.data = {
      alerts: [],
      subscriptions: [],
      eventBus: new Vue()
    }
  }

  get eventBus () {
    return this.data.eventBus;
  }

  getData () {
    return this.data;
  }

  addAlert (rawType: string, message: string) {
    const type = `${rawType}`;
    const date = new Date()
    this.data.alerts.push({ type, message, date });
  }

  addSubscription (subscription: FrameworkSubscription) {
    this.data.subscriptions.push(subscription);
  }

  async confirm (message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (confirm(message)) {
        resolve()
      } else {
        reject(new Error('User cancellation'));
      }
    })
  }

  async prompt (message: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const value = prompt(message);
      if (!value || !value.length) {
        reject(new Error('No value given'));
      }
      resolve(value!);
    })
  }

  private processMessage (topic: string, payload: { [key: string]: any }) {
    const subscriptions = this.data.subscriptions.filter(sub => topic.match(sub.topicRegex));
    subscriptions.forEach(async subscription => {
      await subscription.handler(topic, payload);
    })
  }

  static getInstance () {
    if (!FrameworkService.instance) FrameworkService.instance = new FrameworkService();
    return FrameworkService.instance;
  }
}
