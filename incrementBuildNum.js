module.exports = function (context) {

    var cliCommand = context.cmdLine,
        increment = cliCommand.indexOf('--inc') > -1;

    if (!increment) {
        console.log('--inc flag not detected. No build increment executed.');
        return;
    }

    var ConfigParser;

    try {
        // cordova-lib >= 5.3.4 doesn't contain ConfigParser and xml-helpers
        ConfigParser = context.requireCordovaModule("cordova-common").ConfigParser;
    } catch (e) {
        ConfigParser = context.requireCordovaModule("cordova-lib/src/configparser/ConfigParser");
    }

    var path = require('path'),
        projectConfigurationFile = path.join(context.opts.projectRoot, 'config.xml'),
        cordovaConfig = new ConfigParser(projectConfigurationFile);

    var platforms = context.opts.platforms,
        changeVersion,
        platformName,
        needRewrite = false,
        finishMessage = [];

    // hook configuration
    var platformVersion = !(cliCommand.indexOf('--no-platform-inc') > -1),
        incrementVersion = (cliCommand.indexOf('--inc-version') > -1);

    parseConfig();

    function parseConfig() {
        if (platformVersion) {
            platforms.forEach(function (platform) {
                if (setPlatformInfo(platform)){
                    handleResult();
                }
            });
        }
        if (incrementVersion) {
            changeVersion = 'version';
            platformName = 'App';
            handleResult();
        }

        if (needRewrite) {
            cordovaConfig.write();
        } else {
            console.log(projectConfigurationFile + ' build numbers not changed');
        }
    }

    function setPlatformInfo(platform) {
        switch (platform) {
            case 'android':
                changeVersion = 'android-versionCode';
                platformName = 'Android';
                break;
            case 'ios':
                changeVersion = 'ios-CFBundleVersion';
                platformName = 'iOS';
                break;
            case 'osx':
                changeVersion = 'osx-CFBundleVersion';
                platformName = 'OS X';
                break;
            case 'windows':
                changeVersion = 'windows-packageVersion';
                platformName = 'Windows';
                break;
            default:
                console.log('This hook supports Android, iOS, OS X, and Windows currently, ' + platform + ' not supported');
                return false;
        }
        return true;
    }

    function handleResult() {
        var newVersion = null;

        var configVersion = cordovaConfig.getAttribute(changeVersion);
        if (configVersion) {
            newVersion = processVersionCode(configVersion);
            if (newVersion) cordovaConfig.doc.getroot().attrib[changeVersion] = newVersion;
            else finishMessage.push(platformName + ' version code still "' + configVersion + '"');
        } else {
            finishMessage.push(platformName + ' version code not found');
        }
        if (newVersion) {
            needRewrite = true;
            finishMessage.push(platformName + ' build number incremented to "' + newVersion + '"');
        }
    }

    function processVersionCode(code) {
        if (!code) return null;
        var newCode = code.replace(/[0-9]+$/, newVersion);
        if (newCode === code) return null; //Version not changed, no match
        return newCode;
    }

    function newVersion(match, offset, original) {
        if (!match) return null;
        try {
            var l = match.length;
            match = parseInt(match) + 1;
            return pad(match, l);
        } catch (e) {
            return null;
        }
    }

    function pad(code, origLen) {
        code = code.toString();
        if (code.length >= origLen) return code;
        while (code.length < origLen) {
            code = '0' + code;
        }
        return code;
    }
};