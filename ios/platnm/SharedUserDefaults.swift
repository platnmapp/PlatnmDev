import Foundation
import React

@objc(SharedUserDefaults)
class SharedUserDefaults: NSObject {
  
  private let appGroupId = "group.com.platnm.5a1fixcuqweopqweopqwieopwqieopqwieoiqwopieopqiwopeiqwpoeioqwiepoqiwjdnaskncklnsdlfnlkas9635.app"
  
  @objc
  func setSessionData(_ data: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
      rejecter("NO_APP_GROUP", "Could not access App Group UserDefaults", nil)
      return
    }
    
    sharedDefaults.set(data, forKey: "sessionData")
    sharedDefaults.synchronize()
    resolver(true)
  }
  
  @objc
  func getSessionData(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
      rejecter("NO_APP_GROUP", "Could not access App Group UserDefaults", nil)
      return
    }
    
    if let data = sharedDefaults.string(forKey: "sessionData") {
      resolver(data)
    } else {
      resolver(nil)
    }
  }
  
  @objc
  func clearSessionData(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
      rejecter("NO_APP_GROUP", "Could not access App Group UserDefaults", nil)
      return
    }
    
    sharedDefaults.removeObject(forKey: "sessionData")
    sharedDefaults.synchronize()
    resolver(true)
  }
  
  @objc
  func getSharedMusicURL(_ resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    NSLog("PLATNM_SHARE_DEBUG_2024: SharedUserDefaults.getSharedMusicURL called")
    NSLog("PLATNM_SHARE_DEBUG_2024: App Group ID: \(appGroupId)")
    
    guard let sharedDefaults = UserDefaults(suiteName: appGroupId) else {
      NSLog("PLATNM_SHARE_DEBUG_2024: ERROR - Could not access App Group UserDefaults")
      rejecter("NO_APP_GROUP", "Could not access App Group UserDefaults", nil)
      return
    }
    
    NSLog("PLATNM_SHARE_DEBUG_2024: Successfully accessed App Group UserDefaults")
    
    if let url = sharedDefaults.string(forKey: "sharedMusicURL") {
      NSLog("PLATNM_SHARE_DEBUG_2024: Found sharedMusicURL in App Group: \(url)")
      // Clear it after reading
      sharedDefaults.removeObject(forKey: "sharedMusicURL")
      let syncResult = sharedDefaults.synchronize()
      NSLog("PLATNM_SHARE_DEBUG_2024: Cleared sharedMusicURL, synchronize result: \(syncResult)")
      resolver(url)
    } else {
      NSLog("PLATNM_SHARE_DEBUG_2024: No sharedMusicURL found in App Group")
      // Check all keys for debugging
      let allKeys = sharedDefaults.dictionaryRepresentation().keys
      NSLog("PLATNM_SHARE_DEBUG_2024: All keys in App Group UserDefaults: \(Array(allKeys))")
      resolver(nil)
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

