import { W as WebPlugin, C as ConsentStatus, a as ConsentType, g as getAnalytics, s as setUserId, b as setUserProperties, l as logEvent, c as setAnalyticsCollectionEnabled, d as setConsent } from "./index-DNoM2Oyr.js";
class FirebaseAnalyticsWeb extends WebPlugin {
  async getAppInstanceId() {
    throw this.unimplemented("Not implemented on web.");
  }
  async setConsent(options) {
    const status = options.status === ConsentStatus.Granted ? "granted" : "denied";
    const consentSettings = {};
    switch (options.type) {
      case ConsentType.AdPersonalization:
        consentSettings.ad_personalization = status;
        break;
      case ConsentType.AdStorage:
        consentSettings.ad_storage = status;
        break;
      case ConsentType.AdUserData:
        consentSettings.ad_user_data = status;
        break;
      case ConsentType.AnalyticsStorage:
        consentSettings.analytics_storage = status;
        break;
      case ConsentType.FunctionalityStorage:
        consentSettings.functionality_storage = status;
        break;
      case ConsentType.PersonalizationStorage:
        consentSettings.personalization_storage = status;
        break;
    }
    setConsent(consentSettings);
  }
  async setUserId(options) {
    const analytics = getAnalytics();
    setUserId(analytics, options.userId);
  }
  async setUserProperty(options) {
    const analytics = getAnalytics();
    setUserProperties(analytics, {
      [options.key]: options.value
    });
  }
  async setCurrentScreen(options) {
    const analytics = getAnalytics();
    logEvent(analytics, "screen_view", {
      firebase_screen: options.screenName || void 0,
      firebase_screen_class: options.screenClassOverride || void 0
    });
  }
  async logEvent(options) {
    const analytics = getAnalytics();
    logEvent(analytics, options.name, options.params);
  }
  async setSessionTimeoutDuration(_options) {
    throw this.unimplemented("Not implemented on web.");
  }
  async setEnabled(_options) {
    const analytics = getAnalytics();
    setAnalyticsCollectionEnabled(analytics, _options.enabled);
  }
  async isEnabled() {
    const enabled = window["ga-disable-analyticsId"] === true;
    return {
      enabled
    };
  }
  async resetAnalyticsData() {
    throw this.unimplemented("Not implemented on web.");
  }
  async initiateOnDeviceConversionMeasurementWithEmailAddress(_options) {
    throw this.unimplemented("Not implemented on web.");
  }
  async initiateOnDeviceConversionMeasurementWithPhoneNumber(_options) {
    throw this.unimplemented("Not implemented on web.");
  }
  async initiateOnDeviceConversionMeasurementWithHashedEmailAddress(_options) {
    throw this.unimplemented("Not implemented on web.");
  }
  async initiateOnDeviceConversionMeasurementWithHashedPhoneNumber(_options) {
    throw this.unimplemented("Not implemented on web.");
  }
}
export {
  FirebaseAnalyticsWeb
};
//# sourceMappingURL=web-hSmmZ7tz.js.map
