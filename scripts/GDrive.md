## `GDrive` & `GFileBrowser` 
*(TypeScript / Browser – Google Drive, Sheets & Calendar helpers)*  

---

### 1. What lives where?

| Layer           | Purpose                                                                              | Key Public APIs                                                         |
|-----------------|--------------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **`GDrive`**    | Thin wrapper over Google Identity Services (GIS) + Drive v3 / Sheets v4 / Calendar v3 | `initGapi`, `handleUserSignIn`, `uploadFileToGoogleDrive`, `listDriveFiles`, `createSpreadsheet`, `appendToGoogleSheetOrCreateTab`, `createCalendar`, `createEvent`, … |
| **`GFileBrowser`** | UI mix-in that turns a `<div>` into a drag-and-drop file browser/uploader           | `createFileBrowser`, `createFileUploader`                                |
| **Types**       | Hand-rolled DTOs for common Drive/Calendar objects so TypeScript can help you        | `FileMetadata`, `Event`, `Calendar`, …                                  |

---

### 2. Quick-Start (ES Module / TS)

    import { GFileBrowser } from './GDrive';

    // 1 – instantiate with your OAuth client-ID & desired root folder name
    const drive = new GFileBrowser(
      /* googleClientId */ 'YOUR_CLIENT_ID.apps.googleusercontent.com',
      /* rootFolder    */ 'AppData'
    );

    // 2 – sign-in (implicit OAuth popup) ➜ resolves when access-token obtained
    await drive.handleUserSignIn();

    // 3 – mount a file-browser UI into any container
    await drive.createFileBrowser('#file-browser-container');

    // 4 – Drive helpers
    await drive.uploadFileToGoogleDrive(
      new Blob(['hello'], { type:'text/plain' }),
      'hello.txt',
      'text/plain'
    );

    // 5 – Sheets helpers
    await drive.appendToGoogleSheetOrCreateTab(
      'DemoSheet',          // spreadsheet title
      'Data',               // tab
      [['a','b','c',1,2,3]] // 2-D rows
    );

    // 6 – Calendar helpers
    await drive.createEventByCalendarName('My Cal', {
      summary:'Meet GPT',
      start:{ dateTime:new Date().toISOString(), timeZone:'UTC' },
      end:  { dateTime:new Date(Date.now()+3.6e6).toISOString(), timeZone:'UTC' },
    });

---

### 3. Authentication Lifecycle

| Method               | What it does                                                           | Notes                                                                 |
|----------------------|------------------------------------------------------------------------|-----------------------------------------------------------------------|
| `initGapi(clientId, discoveryDocs?, scope?)` | Lazily injects `api.js` & GIS scripts, then pre-loads discovery docs. | Called implicitly when you pass `googleClientId` to constructor.     |
| `handleUserSignIn()` | Opens GIS consent popup → resolves to token JSON. Sets `isLoggedIn`, caches `accessToken`, ensures root folder exists. |
| `restoreSignIn()`    | Re-hydrates session if you persisted `accessToken` somewhere.           |                                                                       |
| `signOut()`          | Revokes token via GIS and wipes local state.                           |                                                                       |

---

### 4. Google Drive Helpers (by task)

#### 4.1 Folders & IDs

| Method                          | Purpose                                                                     |
|---------------------------------|-----------------------------------------------------------------------------|
| `checkFolder(nameOrId, cb?, useId?, parentId?)` | Find or create a folder; caches `directoryId`.          |
| `createDriveFolder(name, parentId?)`           | Low-level “mkdir”.                                     |
| `getFolderId(name, parentId?)`                 | Lookup only; returns `null` if missing.                 |
| `listFolders(folderId?, parent='parents')`     | Enumerate child folders.                                |

#### 4.2 Files – CRUD & Queries

| Method                                          | Purpose                                                           |
|-------------------------------------------------|-------------------------------------------------------------------|
| `searchDrive(query, pageSize?, token?, parentId?, trashed?)`    | Full-text search.                              |
| `listDriveFiles(folderId?, pageSize?, cb?, token?, parentFolder?)` | List children (files + folders).                 |
| `getFileMetadata(fileId)` / `getFileMetadataByName(name, parentId?)` | Fetch metadata.                          |
| `uploadFileToGoogleDrive(data, fileName, mimeType?, parent, onProgress?, overwrite?)` | Multipart upload; create or patch file. |
| `uploadFiles([{name,mimeType,data}], folderId?, progressElm?, overwrite?)` | Multi-file wrapper with progress.               |
| `updateFile(fileId, data, mimeType, onProgress?)`              | Patch file contents.                          |
| `downloadFile(fileId, mimeType, saveAs?)`                      | Fetch bytes & trigger browser download.       |
| `deleteFile(fileId)`                                            | Permanently deletes.                          |
| `getSharableLink(fileId)`                                       | Grants “anyone-with-link reader” if missing, returns link. |
| `shareFile(fileId, email, role?, options)`                       | Add explicit permission.                      |
| `revokeFileAccess(fileId, email)`                               | Remove permission.                            |

#### 4.3 Spreadsheet (Sheets v4)

| Method                                            | Purpose                                                      |
|---------------------------------------------------|--------------------------------------------------------------|
| `createSpreadsheet(title, parentId)`              | Drive “new” + Sheets meta.                                   |
| `findSpreadsheet(title, parentId)`                | Returns first match or `null`.                               |
| `createTab(spreadsheetId, tabName)`               | Adds a new sheet/tab.                                        |
| `setSheetData(spreadsheetId, tab!range, token, range, mode, {values})` | Write cell block (append API).      |
| `appendData(spreadsheetId, tab, token, mode, {values})`             | Append rows.                              |
| `appendToGoogleSheetOrCreateTab(title, tab, rows, mode?, parentId?)` | “Smart” helper: create if needed, then append. |

#### 4.4 Calendar (Calendar v3)

| Category     | Methods                                                                                      |
|--------------|----------------------------------------------------------------------------------------------|
| **Calendars**| `createCalendar`, `findCalendarByName`, `listAllCalendars`, `deleteCalendar`, `shareCalendar`, `revokeCalendarAccess` |
| **Events**   | `createEvent`, `updateEvent`, `deleteEvent`, `listEvents`, `createRecurringEvent`, `revokeEventAttendee`             |
| **Wrappers** | Suffix “…ByCalendarName” or “…ByCalendarAndEventNames” for human-friendly flows.            |

---

### 5. `GFileBrowser` — UI Glue

| Method                               | Renders                                                                                 |
|--------------------------------------|-----------------------------------------------------------------------------------------|
| `createFileBrowser(container, rootName?, pageToken?, parentId?, opts?)` | Full explorer (upload + search + pagination + breadcrumb + share + delete). |
| `createFileUploader(container, folderId?, token?, parentId?)`           | Stand-alone drag-and-drop uploader.                             |

**Options**

    type FileBrowserOptions = {
      onFileClick?: (meta: FileMetadata) => void;
    };

---

### 6. Error Handling & Auth Guard Pattern

Most methods start with:

    if (!this.isLoggedIn) {
      await this.handleUserSignIn();
    }
    try {
      // …
    } catch (error) {
      console.error('Error in X:', error);
      throw error;
    }

---

### 7. Extending / Patching Tips

- **Batch requests** – wrap with `gapi.client.newBatch()` for bulk operations.  
- **Field filtering** – narrow `fields` to reduce payload.  
- **Token refresh** – call `tokenClient.requestAccessToken({prompt:''})` before expiry.  
- **Retry/backoff** – implement exponential backoff on 429 responses.

---

### 8. Mental UML

    ┌────────────┐
    │  GDrive    │  «uses» window.gapi + window.google
    └─┬──────────┘
      │ (inherits)
    ┌─▼──────────┐
    │ GFileBrowser│
    └────────────┘

---

### 9. ChatGPT Prompt Seeds

| Task                   | Seed Phrase                                                              |
|------------------------|---------------------------------------------------------------------------|
| Append daily CSV       | “Use `appendToGoogleSheetOrCreateTab('Sales','Sheet1',rows)`.”            |
| Share PDF as editor    | “Call `shareFile(fileId,'alice@example.com','writer',{sendNotificationEmail:true})`.” |
| Next-7-day events view | “Group `listEvents(calId,todayIso,weekIso)` by date.”                     |

---

### 10. Version & Dependencies

- **Google APIs**: Drive v3, Sheets v4, Calendar v3  
- **GIS** implicit flow  
- **TypeScript** ≥ 4.6  
- No extra runtime dependencies beyond browser DOM & XHR.
