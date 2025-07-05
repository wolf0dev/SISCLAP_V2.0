# Android Keystore Setup Guide

## Step 1: Install Java JDK on Windows

Since `keytool` is not found, you need to install Java JDK first.

### Option A: Install via Chocolatey (Recommended)
If you have Chocolatey installed:
```powershell
choco install openjdk11
```

### Option B: Manual Installation
1. Download OpenJDK 11 or later from: https://adoptium.net/
2. Choose "Windows x64" and download the MSI installer
3. Run the installer and follow the setup wizard
4. Make sure to check "Add to PATH" during installation

### Option C: Install via Winget (Windows Package Manager)
```powershell
winget install Microsoft.OpenJDK.11
```

## Step 2: Verify Java Installation

After installation, restart your PowerShell/Command Prompt and verify:
```powershell
java -version
keytool -help
```

## Step 3: Generate Android Keystore

Once Java is installed, run this command:
```powershell
keytool -genkey -v -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

You'll be prompted to enter:
- Keystore password (remember this!)
- Your name and organization details
- Key password (can be the same as keystore password)

## Step 4: Configure EAS to Use Local Keystore

After generating the keystore, configure EAS:
```powershell
npx eas credentials
```

Select:
1. Android
2. production (or preview)
3. Keystore: Set up a new keystore
4. Select "I want to upload my own file"
5. Provide the path to your `my-upload-key.keystore` file

## Alternative: Use EAS Cloud Keystore (Retry)

If you prefer not to install Java locally, you can retry the cloud keystore generation:
```powershell
npx eas build --platform android --profile preview --clear-cache
```

The 500 error you encountered earlier was likely temporary.

## Security Notes

- Keep your keystore file safe and backed up
- Never commit keystore files to version control
- Store passwords securely (consider using a password manager)
- The same keystore must be used for all future app updates

## Troubleshooting

If you still encounter issues:
1. Restart your terminal after Java installation
2. Check that Java is in your PATH: `echo $env:PATH`
3. Try using the full path to keytool if needed
4. Ensure you're running PowerShell as Administrator if needed