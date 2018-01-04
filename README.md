# cordova-plugin-build-increment

Increment version tags using cordova build flags.

Tested up to cordova@8.0.0

## Install
Install the following package below inside of your app's root folder.
```bash
$ cordova plugin install cordova-plugin-build-increment
```

Script is designed to increment the `android-versionCode`, `ios-CFBundleVersion`, `osx-CFBundleVersion` and `windows-packageVersion` fields for additional versioning or simply the version tag in the config.xml file.

## Usage

Version incrementing is disabled by default.

Use the following option flags when executing `cordova build`:

`--inc` - increments are processed for this build

`--inc-version` - the version tag will be incremented for this build

`--no-platform-inc` - platform specific version tags will not be incremented for this build


### Version Format


##### Android:

`X`

 - Cordova will throw an error if `android-versionCode` is not an integer value


##### iOS and OS X:

`X` 

`X.X`

`X.X.X`


##### Windows:

`X.X.X.X`


** Leading zeros not removed

** The hook will not currently increment any build versions without the formats above (i.e., non numeric version tags)