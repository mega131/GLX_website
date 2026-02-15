# Google Sheets Database Setup Guide

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Blank" to create a new spreadsheet
3. Name it "GLX Registration Database"

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code in the editor
3. Paste this code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // If this is the first entry, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 
        'Name', 
        'Email', 
        'Phone', 
        'Country',
        'Competition', 
        'Additional Info',
        'Dynamic Fields (JSON)'
      ]);
    }
    
    // Separate basic and dynamic fields
    const basicFields = ['name', 'email', 'phone', 'country', 'Competition', 'message'];
    const dynamicData = {};
    
    // Collect dynamic fields
    Object.keys(data).forEach(key => {
      if (!basicFields.includes(key)) {
        dynamicData[key] = data[key];
      }
    });
    
    // Add the data
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.email || '',
      data.phone || '',
      data.country || '',
      data.Competition || '',
      data.message || '',
      JSON.stringify(dynamicData)
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Registration successful!'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click the **Save** icon (💾) or press `Ctrl+S`
5. Name your project "GLX Registration Handler"

## Step 3: Deploy as Web App

1. Click **Deploy** → **New deployment**
2. Click the gear icon (⚙️) next to "Select type"
3. Choose **Web app**
4. Configure the deployment:
   - **Description**: GLX Registration Form
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
5. Click **Deploy**
6. You may need to authorize the script:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to GLX Registration Handler (unsafe)"
   - Click "Allow"
7. **COPY THE WEB APP URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycbx.../exec
   ```

## Step 4: Update Your Website Code

1. Open `script.js` in your project
2. Find this line near the top:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_GOOGLE_SCRIPT_URL_HERE'` with your actual Web App URL:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx.../exec';
   ```
4. Save the file

## Step 5: Test Your Form

1. Open your website in a browser
2. Fill out the registration form
3. Click "Submit Registration"
4. Check your Google Sheet - you should see the data appear!

## What Gets Stored

Your Google Sheet will automatically capture:
- **Timestamp** - When the form was submitted
- **Name** - Full name of the registrant
- **Email** - Email address
- **Phone** - Phone number
- **Country** - Country of the participant
- **Competition** - Selected competition (Dance, E Sports, Music, or Sports)
- **Additional Info** - Optional message from the user
- **Dynamic Fields (JSON)** - All competition-specific fields in JSON format

### Competition-Specific Fields:

**Dance:**
- Participation Type (Solo/Duo/Crew)
- Crew/Team Name
- Dance Style
- Years of Experience
- Previous Competitions

**E Sports:**
- Gamertag/Username
- Game Title
- Participation Type
- Team Name
- Current Rank/Level
- Gaming Platform

**Music:**
- Participation Type (Solo/Band/DJ)
- Artist/Band Name
- Music Genre
- Primary Instrument/Skill
- Years of Experience
- Social Media/Portfolio Link

**Sports:**
- Sport Type
- Participation Type
- Team Name
- Age Category
- Years of Experience
- Notable Achievements

## Troubleshooting

### Form not submitting?
- Make sure you copied the ENTIRE Web App URL (including `/exec` at the end)
- Check that the deployment is set to "Anyone" can access
- Open browser console (F12) to see any error messages

### Data not appearing in sheet?
- Verify the Apps Script code is saved
- Make sure you deployed the LATEST version
- Check that you authorized the script properly

### Need to update the script?
1. Make changes in Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click the edit icon (✏️)
4. Change version to "New version"
5. Click **Deploy**

## Security Note

The form uses `mode: 'no-cors'` which is standard for Google Apps Script web apps. Your data is securely stored in your Google account and only you can access the spreadsheet.

---

**Need help?** Make sure you're logged into the Google account where you want the data stored!
