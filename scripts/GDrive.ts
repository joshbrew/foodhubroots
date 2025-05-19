
declare var window;
/// <reference types="gapi" />
/// <reference types="gapi.auth2" />
/// <reference types="gapi.client" />
/// <reference types="gapi.client.drive-v3" />
/// <reference types="gapi.client.calendar-v3" />
/// <reference types="gapi.client.sheets-v4" />


const nativeExportOptions: Record<string, { label: string; mime: string; ext: string }[]> = {
  'application/vnd.google-apps.spreadsheet': [
    { label: 'CSV', mime: 'text/csv', ext: '.csv' },
    { label: 'XLSX', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', ext: '.xlsx' },
    { label: 'PDF', mime: 'application/pdf', ext: '.pdf' },
    { label: 'ODS', mime: 'application/vnd.oasis.opendocument.spreadsheet', ext: '.ods' },
  ],
  'application/vnd.google-apps.document': [
    { label: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ext: '.docx' },
    { label: 'PDF', mime: 'application/pdf', ext: '.pdf' },
    { label: 'ODT', mime: 'application/vnd.oasis.opendocument.text', ext: '.odt' },
    { label: 'RTF', mime: 'application/rtf', ext: '.rtf' },
    { label: 'TXT', mime: 'text/plain', ext: '.txt' },
  ],
  'application/vnd.google-apps.presentation': [
    { label: 'PPTX', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', ext: '.pptx' },
    { label: 'PDF', mime: 'application/pdf', ext: '.pdf' },
    { label: 'ODP', mime: 'application/vnd.oasis.opendocument.presentation', ext: '.odp' },
    { label: 'JPG', mime: 'image/jpeg', ext: '.jpg' },
    { label: 'PNG', mime: 'image/png', ext: '.png' },
    { label: 'SVG', mime: 'image/svg+xml', ext: '.svg' },
  ],
};


//browser google drive utility

//some types
export type Calendar = {
  kind: string,
  etag: string,
  id: string,
  summary: string,
  description?: string,
  location?: string,
  timeZone?: string,
  conferenceProperties?: {
    allowedConferenceSolutionTypes: [
      string
    ]
  }
}

export type Role = 'reader' | 'writer' | 'owner';

export type User = {
  displayName: string,
  kind: string,
  me: boolean,
  permissionId: string,
  emailAddress: string,
  photoLink: string
}

export type Permission = {
  id: string,
  displayName: string,
  type: string,
  kind: string,
  permissionDetails: [
    {
      permissionType: string,
      inheritedFrom: string,
      role: string,
      inherited: boolean
    }
  ],
  photoLink: string,
  emailAddress: string,
  role: string,
  allowFileDiscovery: boolean,
  domain: string,
  expirationTime: string,
  teamDrivePermissionDetails: [
    {
      teamDrivePermissionType: string,
      inheritedFrom: string,
      role: string,
      inherited: boolean
    }
  ],
  deleted: boolean,
  view: string,
  pendingOwner: boolean
};

export type FileMetadata = {
  id: string;
  name: string;
  mimeType: string;
  parents?: string[];
  webViewLink?: string;
  iconLink?: string;
  thumbnailLink?: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  shared?: boolean;
  owners?: Array<User>;
  permissions?: Array<Permission>;
}

export type UploadFile = {
  name: string;
  mimeType: string;
  data: File;
};


export type SharingOptions = {
  emailMessage?: string;
  moveToNewOwnersRoot?: boolean;
  sendNotificationEmail?: boolean;
  supportsAllDrives?: boolean;
  transferOwnership?: boolean;
  useDomainAdminAccess?: boolean;
};

export type Attendee = {
  email: string;
  displayName?: string;
  organizer?: boolean;
  self?: boolean;
  resource?: boolean;
  optional?: boolean;
  responseStatus?: 'needsAction' | 'declined' | 'tentative' | 'accepted';
};

export type Event = {
  summary: string;
  location?: string;
  description?: string;
  colorId?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  recurrence?: string[];
  attendees?: Attendee[];
  reminders?: {
    useDefault: boolean,
    overrides: { method: 'email' | 'popup', minutes: number }[],
  };
  status?: 'confirmed' | 'tentative' | 'cancelled';
  visibility?: 'default' | 'public' | 'private' | 'confidential';
  supportsAttachments?: boolean;
  guestsCanSeeOtherGuests?: boolean;
  guestsCanModify?: boolean;
  guestsCanInviteOthers?: boolean;
  sendUpdates?: 'all' | 'externalOnly' | 'none';
  source?: {
    title: string;
    url: string;
  };
  id: string;
  [key: string]: any; // To support additional properties
};

// Type Definitions
type SheetName = string;
type Cell = `${string}${number}`; // Simple alias for cell notation, e.g., 'A1', 'B2'
export type Range = `${SheetName}!${Cell}:${Cell}` | `${Cell}:${Cell}` | `${Cell}`;


declare global {
  namespace google {
    namespace accounts {
      namespace oauth2 {
        interface TokenClient {
          callback: (resp: TokenResponse) => void;
          requestAccessToken(opts?: { prompt?: 'consent' | 'none' }): void;
        }
        interface TokenResponse { access_token?: string; error?: string }
        interface TokenClientConfig {
          client_id: string;
          scope: string;
          callback: (resp: TokenResponse) => void;
          use_fedcm_for_prompt?: boolean;
          use_fedcm_for_button?: boolean;
        }
        function initTokenClient(cfg: TokenClientConfig): TokenClient;
        /**
           * Revoke an OAuth2 access token.
           * @param token the access token string
           * @param callback optional callback when done
           */
        function revoke(
          token: string,
          callback?: () => void
        ): void;
      }
    }
  }
}

export class GDrive {
  //------------------------
  //-GOOGLE DRIVE FUNCTIONS-
  //------------------------

  google: typeof google = (window as any).google;
  gapi: typeof gapi = (window as any).gapi;
  private tokenClient: google.accounts.oauth2.TokenClient = (window as any).tokenClient;

  private accessToken: string;

  gapiInited = this.gapi !== undefined;
  gsiInited = this.google !== undefined;
  isLoggedIn = false;
  container: any;

  userId: string;

  fedcmEnabled = true;

  directory = "AppData"; //our directory of choice
  directoryId: string; //the unique google id
  //fs = fs;

  // Toggle: if true we’ll stash to localStorage under storageKey
  persistToken = true;
  storageKey = '_gdr_tok_25v1';  // obscure but consistent
  tokenExpiresAt?: number;

  constructor(googleClientId?: string, opts?: {
    directory?: string, discoverydocs?: string[], scope?: string, persistToken?: boolean, storageKey?: string
  }) {

    if (opts?.directory) this.directory = opts.directory;
    if (opts?.persistToken) this.persistToken = opts.persistToken;
    if (opts?.storageKey) this.storageKey = opts.storageKey;
    if (googleClientId)
      this.initGapi(googleClientId, opts?.discoverydocs, opts?.scope);
  }

  /**
   * Initialize GAPI + GIS token client.
   * @param googleClientID Your OAuth2 client ID
   * @param DISCOVERY_DOCS List of discoveryDoc URLs for any APIs you want to load up front
   * @param SCOPE Space-delimited list of OAuth2 scopes
   */
  initGapi = async (
    googleClientID: string,
    DISCOVERY_DOCS: string[] = [
      // OAuth2 profile & email lookup
      'https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest',
      // Drive v3 for file operations
      'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
      // Calendar v3 if you're doing calendar CRUD
      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
      // Sheets v4 for spreadsheet reads/writes
      'https://www.googleapis.com/discovery/v1/apis/sheets/v4/rest'
    ],
    SCOPE: string = [
      // Drive file access
      'https://www.googleapis.com/auth/drive',
      // Calendar read/write
      'https://www.googleapis.com/auth/calendar',
      // Sheets read/write
      'https://www.googleapis.com/auth/spreadsheets',
      // Basic profile & email
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ].join(' ')
  ): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      // 1) Sanity check: client ID is required
      if (!googleClientID) {
        return reject(new Error('googleClientID is required for initGapi'));
      }

      // 2) Load the core gapi.js
      const CLIENT_SCRIPT_ID = 'gapi-client-script';
      if (!document.getElementById(CLIENT_SCRIPT_ID)) {
        this.loadScript(
          CLIENT_SCRIPT_ID,
          'https://apis.google.com/js/api.js',
          () => {
            if (!window.gapi) {
              return reject(new Error('gapi not available after script load'));
            }
            this.gapi = window.gapi;
            // 3) Load the GAPI client
            this.gapi.load('client', async () => {
              try {
                // Initialize with any discovery docs
                await this.gapi.client.init({ discoveryDocs: DISCOVERY_DOCS });
              } catch (err) {
                return reject(err);
              }
              // 4) Now load the GIS (Google Identity Services) library
              this._loadGis(googleClientID, SCOPE)
                .then(() => resolve(true))
                .catch(reject);
            });
          }
        );
      } else {
        // If script already exists, skip right to loading client + GIS
        try {
          await this.gapi.client.init({ discoveryDocs: DISCOVERY_DOCS });
          await this._loadGis(googleClientID, SCOPE);
          resolve(true);
        } catch (err) {
          reject(err);
        }
      }
    });
  };

  /**
   * @private
   * Load Google Identity Services and set up tokenClient
   */
  private _loadGis = async (clientId: string, scope: string) => {
    return new Promise<void>((resolve, reject) => {
      const GSI_SCRIPT_ID = 'gsi-client-script';
      this.loadScript(
        GSI_SCRIPT_ID,
        'https://accounts.google.com/gsi/client',
        () => {
          if (!window.google || !window.google.accounts) {
            return reject(new Error('GIS client not available after load'));
          }
          this.google = window.google;
          this.tokenClient = this.google.accounts.oauth2.initTokenClient({
            client_id: clientId,
            scope,
            callback: (resp) => { }, // placeholder, set in sign-in
            use_fedcm_for_prompt: this.fedcmEnabled,
            use_fedcm_for_button: this.fedcmEnabled,
          });
          resolve();
        }
      );
    });
  };

  static parseFileId(url:string) {
    // Extract fileId from common URL patterns
    const patterns = [
      /\/d\/([A-Za-z0-9_-]+)/,          // /d/<id>/
      /\/file\/d\/([A-Za-z0-9_-]+)/,    // /file/d/<id>/
      /open\?id=([A-Za-z0-9_-]+)/,      // open?id=<id>
      /id=([A-Za-z0-9_-]+)/             // uc?export=download&id=<id>
    ];
    let fileId: string | null = null;
    for (const re of patterns) {
      const m = url.match(re);
      if (m) { fileId = m[1]; break; }
    }
    return fileId;
  }

  /**
   * Fetches a publicly-shared Google Sheets CSV (or any public Drive file) via fetch,
   * returning both its body (text or Blob) and simple metadata (from headers).
   * Supports multiple Drive/Docs/Sheets URL formats. No OAuth required.
   * Static method does not require gapi or user sign-in
   * 
   * @param urlOrId       Full URL to the file (Drive, Docs, Sheets) or raw fileId
   * @param opts.exportMime  If provided (e.g. 'text/csv'), exports a Sheet tab as CSV
   * @param opts.gid         (Sheets only) the GID of the tab to export (default: 0)
   */
  static async fetchPublicFile(
    urlOrId: string,
    opts: { exportMime?: string; gid?: number } = {}
  ): Promise<{
    data: string | Blob;
    metadata: { contentType: string; fileName?: string; size?: number };
  }> {
    // 1) Extract fileId from common URL patterns
    let fileId: string | null = GDrive.parseFileId(urlOrId);
    if (!fileId) {
      // assume the string is already a raw fileId
      fileId = urlOrId;
    }

    // 2) Build fetch URL
    let fetchUrl: string;
    if (opts.exportMime === 'text/csv') {
      const gid = opts.gid ?? 0;
      fetchUrl = `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv&gid=${gid}`;
    } else {
      // direct download via Drive endpoint
      fetchUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    // 3) Fetch the resource
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      throw new Error(`fetchPublicFile failed: ${res.status} ${res.statusText}`);
    }

    // 4) Parse metadata from headers
    const contentType = res.headers.get('Content-Type') || '';
    const disposition = res.headers.get('Content-Disposition') || '';
    const fnMatch = disposition.match(
      /filename\*=UTF-8''([^;]+)|filename="([^"]+)"/
    );
    const fileName = fnMatch
      ? decodeURIComponent(fnMatch[1] || fnMatch[2])
      : undefined;
    const sizeHeader = res.headers.get('Content-Length');
    const size = sizeHeader ? parseInt(sizeHeader, 10) : undefined;

    // 5) Choose body parser
    let data: string | Blob;
    if (
      opts.exportMime === 'text/csv' ||
      contentType.startsWith('text/') ||
      contentType === 'application/json'
    ) {
      data = await res.text();
    } else {
      data = await res.blob();
    }

    return { data, metadata: { contentType, fileName, size } };
  }

  // -----------------------------------------------------------
  // Example usage in index.js (after importing GDrive):
  //
  // const { data, metadata } = await GDrive.fetchPublicFile(
  //   'https://docs.google.com/spreadsheets/d/1gZaAM2l9JVF3TqK_-euYdhe9FHNX8cZcEfnDIG6AOsQ/edit',
  //   { exportMime: 'text/csv', gid: 0 }
  // );
  // console.log(metadata);       // { contentType, fileName?, size? }
  // console.log(data);           // CSV string
  // 
  // // then you can parse CSV and render as before…
  // -----------------------------------------------------------


  /**
     * Dynamically load any Google API you need at runtime.
     *
     * Usage examples:
     *   await gdrive.loadApi('drive', 'v3');     // load Drive v3
     *   await gdrive.loadApi('calendar', 'v3');  // load Calendar v3
     *   await gdrive.loadApi('sheets', 'v4');    // load Sheets v4
     *   await gdrive.loadApi('gmail', 'v1');     // load Gmail v1
     *
     * If you need discovery-doc URLs instead, pass them as third arg.
     */
  loadApi = async (
    apiName: string,
    apiVersion: string,
    discoveryUrl?: string
  ): Promise<void> => {
    // Safety: ensure gapi.client is ready
    if (!this.gapi || !this.gapi.client) {
      throw new Error(
        'gapi.client not initialized. Did you forget to call initGapi()?'
      );
    }

    // If you have the discovery URL for a custom API:
    if (discoveryUrl) {
      await this.gapi.client.load(discoveryUrl);
      return;
    }

    // Default: load by API name + version
    return new Promise((resolve, reject) => {
      this.gapi.client
        .load(apiName, apiVersion)
        .then(() => resolve())
        .catch((err: any) =>
          reject(
            new Error(
              `Failed to load API ${apiName}/${apiVersion}: ${err.message || err}`
            )
          )
        );
    });
  };


  // Updated sign-in using GIS implicit flow.
  // This function triggers a popup for user consent and obtains an access token.
  handleUserSignIn = () => {
    return new Promise((resolve, reject) => {
      if (!this.tokenClient) {
        console.error("Token client not initialized");
        return reject("Token client not initialized");
      }
      // Set the callback to handle the token response.
      this.tokenClient.callback = (tokenResponse) => {
        if (tokenResponse.error) {
          console.error("Token request error:", tokenResponse.error);
          reject(tokenResponse.error);
        } else if (tokenResponse.access_token) {
          this.accessToken = tokenResponse.access_token;
          this.isLoggedIn = true;

          if (this.persistToken) {
            // compute expiry timestamp
            const expiresInMs = ((tokenResponse as any).expires_in || 3600) * 1000;
            const expiresAt = Date.now() + expiresInMs;

            localStorage.setItem(
              this.storageKey,
              JSON.stringify({ accessToken: tokenResponse.access_token, expiresAt })
            );
          }


          // Optionally check for your app-specific folder.
          if (this.directory && !this.directoryId) {
            this.checkFolder(this.directory)
              .then(() => resolve(tokenResponse))
              .catch(reject);
          } else {
            resolve(tokenResponse);
          }
        } else {
          console.error("Sign-in incomplete.");
          reject("Sign-in incomplete");
        }
      };
      // Request an access token (this will open the consent popup).
      this.tokenClient.requestAccessToken({ prompt: 'consent' });
    });
  };

  /**
   * Attempt to restore a prior sign-in.  If you pass in an explicit tokenResponse
   * it will use that; otherwise it will fall back to reading localStorage.
   */
  attemptRestoreSignIn = async (
    tokenResponse?: { access_token: string; expires_in?: number }
  ): Promise<google.accounts.oauth2.TokenResponse> => {
    // 1) explicit tokenResponse from a prior call?
    if (tokenResponse?.access_token) {
      // mirror handleUserSignIn’s logic without prompting
      this.accessToken = tokenResponse.access_token;
      this.tokenExpiresAt = Date.now() + (tokenResponse.expires_in || 3600) * 1000;
      this.isLoggedIn = true;
    }
    // 2) else, if persistToken enabled, try localStorage
    else if (this.persistToken) {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) throw new Error('no stored token');
      const { accessToken, expiresAt } = JSON.parse(raw);
      if (Date.now() > expiresAt - 60000) {
        localStorage.removeItem(this.storageKey);
        throw new Error('stored token expired');
      }
      this.accessToken = accessToken;
      this.tokenExpiresAt = expiresAt;
      this.isLoggedIn = true;
    } else {
      throw new Error('no token to restore');
    }

    // 3) if needed, ensure your AppData folder exists
    if (this.directory && !this.directoryId) {
      await this.checkFolder(this.directory);
    }

    return { access_token: this.accessToken! };
  };

  // Updated sign-out procedure: revokes the access token via the GIS library.
  async signOut() {
    if (!this.accessToken) {
      return false;
    }
    await this.google.accounts.oauth2.revoke(this.accessToken, () => {
      console.log("Access token revoked");
    });
    this.accessToken = '';
    this.isLoggedIn = false;
    return true;
  };

  // Helper to load external scripts.
  loadScript = (scriptId, src, onload) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.type = "text/javascript";
      script.src = src;
      script.async = true;
      script.defer = true;
      script.id = scriptId;
      script.onload = () => {
        onload();
        resolve(true);
      };
      document.head.appendChild(script);
    });
  };

  // Cleanup: Remove loaded scripts and reset state.
  deinit = () => {
    // Optionally revoke token or perform other cleanup here.
    this.google = undefined as any;
    this.gapi = undefined as any;
    this.tokenClient = undefined as any;
    this.isLoggedIn = false;
    this.accessToken = '';

    const removeScript = (scriptId) => {
      const script = document.getElementById(scriptId);
      if (script) {
        document.head.removeChild(script);
      }
    };
    removeScript('gapi-client-script');
    removeScript('gsi-client-script');
  };

  async searchDrive(query: string, pageSize = 100, pageToken: string | undefined = undefined, parentFolderId?: string, trashed = false) {
    try {
      let q = `name contains '${query}' and trashed=${trashed}`;
      if (parentFolderId) {
        q += ` and '${parentFolderId}' in parents`;
      }

      const response = await this.gapi.client.drive.files.list({
        q,
        pageSize,
        fields: 'nextPageToken, files(id, name, mimeType)',
        pageToken,
      });

      return {
        files: response.result.files,
        nextPageToken: response.result.nextPageToken,
      };
    } catch (error) {
      console.error('Error searching Drive:', error);
      throw error;
    }
  }

  //check folder found or create if not
  checkFolder = (
    nameOrId = this.directory,
    onResponse = (result) => { },
    useId = false,
    parentFolderId?: string
  ) => {
    return new Promise((res, rej) => {
      let q;
      if (useId) {
        // If querying by ID, check within the specified parentFolderId or don't specify parent
        q = `'${nameOrId}' in parents and mimeType='application/vnd.google-apps.folder'` + (parentFolderId ? ` and '${parentFolderId}' in parents` : '');
      } else {
        // If querying by name, include parentFolderId in query if provided
        // Query by name, potentially within a specific parent folder
        q = `name='${nameOrId}' and mimeType='application/vnd.google-apps.folder'`;
        if (parentFolderId) {
          // Add parentFolderId to the query if provided
          q += ` and '${parentFolderId}' in parents`;
        }
      }
      this.gapi.client.drive.files.list({
        q,
      }).then(async (response) => {
        //console.log(response);
        if (response.result.files) {
          if (response.result.files?.length === 0) {
            const result = await this.createDriveFolder(nameOrId, parentFolderId); if (typeof result !== 'object') throw new Error(`${result}`);
            if (onResponse) onResponse(result);
            if (!this.directoryId) this.directoryId = (result as any).id; // Make sure this is correctly set
            res(result);
          } else {
            if (onResponse) onResponse(response.result);
            if (!this.directoryId) this.directoryId = response.result.files[0].id as string; // Set the directory ID from the response
            res(response.result);
          }
        }
      }).catch(error => {
        console.error('Error checking folder:', error);
        rej(error);
      });
    });
  }

  createDriveFolder = (
    name = this.directory,
    parentFolderId?: string
  ) => {
    return new Promise((res, rej) => {
      if (this.isLoggedIn) {
        let data = {} as any;
        data.name = name;
        data.mimeType = "application/vnd.google-apps.folder";
        if (parentFolderId) data.parents = [parentFolderId];
        this.gapi.client.drive.files.create({ 'resource': data }).then((response) => {
          //console.log("Created Folder:",response.result);
          res(response.result as any);
        });
      } else {
        console.error("Sign in with Google first!");
        this.handleUserSignIn().then(async (resp) => {
          if (this.isLoggedIn) {
            res(await this.createDriveFolder(name, parentFolderId)); //rerun
          }
        });
      }
    });
  }

  async listFolders(folderId = this.directoryId, parent: string | string[] = 'parents') {
    try {
      const response = await this.gapi.client.drive.files.list({
        q: `'${folderId}' in ${parent} and mimeType='application/vnd.google-apps.folder'`,
        fields: 'nextPageToken, files(id, name, mimeType)'
      });
      return response.result.files || [];
    } catch (error) {
      console.error('Error listing folders:', error);
      throw error;
    }
  }

  async getSharableLink(fileId: string): Promise<string | undefined> {
    try {
      // Check existing permissions
      const permissionsResponse = await this.gapi.client.drive.permissions.list({
        fileId,
        fields: 'permissions(id, role, type)',
      });

      const permissions = permissionsResponse.result.permissions;
      if (!permissions) throw new Error("No permissions!");
      const anyonePermission = permissions.find(permission => permission.type === 'anyone' && permission.role === 'reader');

      // If 'anyone' permission doesn't exist, create it
      if (!anyonePermission) {
        await this.gapi.client.drive.permissions.create({
          fileId,
          resource: {
            role: 'reader',
            type: 'anyone',
          },
        });
      }

      // Fetch the file metadata to get the webViewLink
      const fileMetadata = await this.getFileMetadata(fileId);
      return fileMetadata.webViewLink;
    } catch (error) {
      console.error('Error getting sharable link:', error);
      throw error;
    }
  }

  async getFileMetadata(fileId: string): Promise<gapi.client.drive.File | FileMetadata> {
    try {
      const response = await this.gapi.client.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, parents, webViewLink, iconLink, exportLinks, thumbnailLink, size, createdTime, modifiedTime, shared, owners, permissions',
      });
      return response.result;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }

  async getFolderId(folderName, parentFolder = 'root') {
    try {
      const query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' ${parentFolder ? `and '${parentFolder}' ` : ``}in parents and trashed=false`;
      const response = await this.gapi.client.drive.files.list({
        q: query,
        fields: 'files(id, name)',
        pageSize: 1
      });

      const folder = response.result.files && response.result.files[0];
      if (folder) {
        return folder.id;
      } else {
        //console.error('Folder not found');
        return undefined;
      }
    } catch (error) {
      console.error('Error getting folder ID:', error);
      throw error;
    }
  }


  /**
   * Look up a file by name and then download/export it, returning the Blob.
   * @param fileName The name of the file to find in Drive.
   * @param exportMimeType Optional MIME type to export native Google files (e.g. 'text/csv').
   * @param downloadAs Optional override for the download filename (without extension).
   * @param saveToDisk Whether to trigger a save-to-disk download. Defaults to true.
   * @param parentFolder The Drive folder ID to search in. Defaults to this.directoryId.
   */
  async downloadFileByName(
    fileName: string,
    exportMimeType?: string,
    downloadAs?: string,
    saveToDisk: boolean = true,
    parentFolder: string = this.directoryId
  ): Promise<Blob> {
    // 1) find the file by name
    const meta = await this.getFileMetadataByName(fileName, parentFolder);
    if (!meta?.id) {
      throw new Error(`No file named "${fileName}" found in folder ${parentFolder}`);
    }

    // 2) delegate to downloadFile, propagating saveToDisk
    return this.downloadFile(
      meta.id,
      exportMimeType,
      downloadAs ?? meta.name,
      saveToDisk
    );
  }

  /**
   * Download or export a file by its ID, returning the Blob.
   * @param fileId The Drive file ID.
   * @param exportMimeType Optional export MIME for native Google files.
   * @param fileNameOverride Optional override for downloaded filename (without extension).
   * @param saveToDisk Whether to trigger a save-to-disk download. Defaults to true.
   */
  async downloadFile(
    fileId: string,
    exportMimeType?: string,
    fileNameOverride?: string,
    saveToDisk: boolean = true
  ): Promise<Blob> {
    // 1) fetch file metadata (including exportLinks for native types)
    const metaResp = await this.gapi.client.drive.files.get({
      fileId,
      fields: 'id,name,mimeType,exportLinks'
    });
    const meta = metaResp.result as {
      id: string;
      name: string;
      mimeType: string;
      exportLinks?: Record<string, string>;
    };

    const driveMime = meta.mimeType;
    const baseName = fileNameOverride || meta.name;

    // 2) determine if it's a native Google file and pick target/export MIME + ext
    const options = nativeExportOptions[driveMime] ?? [];
    const isNative = options.length > 0;

    let targetMime: string | undefined = exportMimeType && options.find(o => o.mime === exportMimeType)?.mime;
    let ext = '';

    if (isNative) {
      if (!targetMime) {
        // default to first supported export if none requested
        targetMime = options[0].mime;
      }
      ext = options.find(o => o.mime === targetMime)?.ext ?? '';
    }

    // 3) actually fetch the data as a Blob
    let blob: Blob;

    if (isNative && targetMime) {
      // a) try direct exportLink if available
      const exportUrl = meta.exportLinks?.[targetMime];
      if (exportUrl) {
        const token = this.gapi.auth.getToken().access_token!;
        const res = await fetch(exportUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error(`Export failed: ${res.status}`);
        blob = await res.blob();
      } else {
        // b) fallback to Drive API export endpoint
        const resp = await this.gapi.client.drive.files.export({
          fileId,
          mimeType: targetMime
        });
        // @ts-ignore: resp.body may be string or ArrayBuffer
        blob = new Blob([resp.body!], { type: targetMime });
      }
    } else {
      // raw binary download for non-native files
      const token = this.gapi.auth.getToken().access_token;
      if (!token) throw new Error('Not signed in');
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`Download failed: ${res.status}`);
      blob = await res.blob();
    }

    // 4) optionally save to disk via anchor click
    if (saveToDisk) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = baseName + ext;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    }

    // 5) return the raw Blob regardless of saveToDisk setting
    return blob;
  }

  //https://developers.google.com/drive/api/guides/manage-sharing todo: more perms
  async uploadFileToGoogleDrive(
    data: Blob | string = 'a,b,c,1,2,3\nd,e,f,4,5,6\n',
    fileName: string = `${new Date().toISOString()}.csv`,
    mimeType: string | undefined = 'application/vnd.google-apps.spreadsheet',
    parentFolder: string | string[] | undefined = this.directoryId,
    onProgress: ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any) | undefined,
    overwrite: boolean = false
  ) {
    if (typeof data === 'string') {
      const type = fileName.endsWith('.csv') ? 'text/csv' : 'text/plain';
      data = new Blob([data], { type });
    }

    const metadata = {
      'name': fileName,
      'mimeType': mimeType,
      'parents': Array.isArray(parentFolder) ? parentFolder : [parentFolder], // upload to the current directory
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', data);

    const token = this.gapi.auth.getToken().access_token;
    let xhr = new XMLHttpRequest();

    if (overwrite) {
      const existingFile = await this.getFileMetadataByName(fileName, Array.isArray(parentFolder) ? parentFolder[0] : parentFolder);
      if (existingFile) {
        // Update the existing file
        xhr.open('PATCH', `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`);
      } else {
        // Create a new file
        xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
      }
    } else {
      xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
    }

    xhr.setRequestHeader('Authorization', 'Bearer ' + token);

    if (onProgress) xhr.upload.onprogress = onProgress;

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.responseText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(form);
    });
  }

  // Add this method to your GDrive class
  async uploadFiles(
    files: { name: string, mimeType: string, data: Blob | string, parents?: string }[],
    folderId = this.directoryId,
    uploadProgress?: HTMLProgressElement | HTMLMeterElement | string,
    overwrite: boolean = false
  ) {
    if (typeof uploadProgress === 'string') {
      uploadProgress = document.getElementById('upload-progress') as HTMLProgressElement;
    }
    if (uploadProgress) uploadProgress.style.display = 'block';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        let existingFileId: string | undefined = undefined;

        if (overwrite) {
          const existingFile = await this.getFileMetadataByName(file.name, folderId);
          if (existingFile) {
            existingFileId = existingFile.id;
          }
        }

        if (existingFileId) {
          await this.updateFile(existingFileId, file.data, file.mimeType, (progressEvent) => {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            if (uploadProgress) (uploadProgress as HTMLProgressElement).value = progress;
            else console.log("Upload progress: ", progress);
          });
        } else {
          await this.uploadFileToGoogleDrive(
            file.data,
            file.name,
            file.mimeType,
            file.parents || folderId,
            (progressEvent) => {
              const progress = (progressEvent.loaded / progressEvent.total) * 100;
              if (uploadProgress) (uploadProgress as HTMLProgressElement).value = progress;
              else console.log("Upload progress: ", progress);
            }
          );
        }

        if (uploadProgress) uploadProgress.value = 0; // Reset the progress bar after each file is uploaded
      } catch (error) {
        console.error('Error uploading file:', (file as any).name, error);
      }
    }

    if (uploadProgress) uploadProgress.style.display = 'none'; // Hide the progress bar after all files are uploaded
  }

  async updateFile(
    fileId: string,
    data: Blob | string,
    mimeType: string,
    onProgress?: (this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => any
  ) {
    if (typeof data === 'string') {
      const type = mimeType === 'text/csv' ? 'text/csv' : 'text/plain';
      data = new Blob([data], { type });
    }

    const metadata = {
      mimeType,
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', data);

    const xhr = new XMLHttpRequest();
    xhr.open('PATCH', `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`);

    const token = this.gapi.auth.getToken().access_token;
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);

    if (onProgress) xhr.upload.onprogress = onProgress;

    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.responseText);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(form);
    });
  }


  async listDriveFiles(
    folderId = this.directoryId,
    pageSize = 100,
    onload?: (files) => {},
    pageToken: string | undefined = undefined,
    parentFolder?: string
  ) {

    if (this.isLoggedIn) {
      try {
        const response = await this.gapi.client.drive.files.list({
          q: `'${folderId}' ${parentFolder ? `and '${parentFolder}' ` : ``}in parents and trashed=false`,
          pageSize,
          fields: 'nextPageToken, files(id, name, mimeType)',
          pageToken,
        });

        if (response.result?.files && response.result.files.length > 0) {
          if (onload) onload(response.result.files);
        }

        return {
          files: response.result.files,
          nextPageToken: response.result.nextPageToken,
        };

      } catch (error) {
        console.error('Error listing Drive files:', error);
        throw error;
      }

    } else {
      console.error("Sign in with Google first!");
      this.handleUserSignIn().then(async () => {
        if (this.isLoggedIn) {
          return await this.listDriveFiles(
            folderId,
            pageSize,
            onload, //rerun
            pageToken,
            parentFolder
          )
        }
      });
    }
  }

  deleteFile(fileId: string) {
    // Make sure you have initialized and authenticated your Google Drive API client
    // This is just a basic example. You'll need to handle errors and API responses appropriately.

    if (this.gapi && this.gapi.client && this.gapi.client.drive) {
      this.gapi.client.drive.files.delete({
        fileId: fileId
      }).then(response => {
        console.log('File successfully deleted', response);
        // Here you can update your UI accordingly
      }).catch(error => {
        console.error('Error deleting file:', error);
      });
    } else {
      console.error('Google Drive API client is not initialized.');
    }
  }

  async getFileMetadataByName(fileName: string, parentFolder = this.directoryId): Promise<gapi.client.drive.File | FileMetadata | undefined> {
    try {
      const query = `name='${fileName}' and '${parentFolder}' in parents and trashed=false`;
      const response = await this.gapi.client.drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, parents, webViewLink, iconLink, exportLinks, thumbnailLink, size, createdTime, modifiedTime, shared, owners, permissions)',
        pageSize: 1
      });

      const file = response.result.files && response.result.files[0];
      if (file) {
        return file;
      } else {
        console.error('File not found');
        return undefined;
      }
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw error;
    }
  }


  // Add this function to share a Google Drive file by name
  async shareFileByName(fileName: string, email: string, role: Role = 'reader', options: SharingOptions = {}): Promise<Permission> {
    try {
      const file = await this.getFileMetadataByName(fileName);
      if (!file?.id) {
        throw new Error(`File named "${fileName}" not found`);
      }
      return this.shareFile(file.id, email, role, options);
    } catch (error) {
      console.error('Error sharing file by name:', error);
      throw error;
    }
  }

  // Share a file by its ID
  async shareFile(fileId: string, email: string, role: Role = 'reader', options: SharingOptions = {}): Promise<Permission> {
    try {
      const response = await this.gapi.client.drive.permissions.create({
        fileId: fileId,
        resource: {
          role: role,
          type: 'user',
          emailAddress: email,
        },
        ...options
      });
      console.log('File shared:', response.result);
      return response.result as Permission;
    } catch (error) {
      console.error('Error sharing file:', error);
      throw error;
    }
  }

  // Revoke file access by its ID and email
  async revokeFileAccess(fileId: string, email: string): Promise<void> {
    try {
      const permissions = await this.gapi.client.drive.permissions.list({ fileId });
      if (!permissions.result.permissions) throw new Error(`No permissions on ${fileId}`);
      const permission = permissions.result.permissions.find(p => p.emailAddress === email);
      if (permission?.id) {
        await this.gapi.client.drive.permissions.delete({
          fileId: fileId,
          permissionId: permission.id,
        });
        console.log('File access revoked for:', email);
      } else {
        throw new Error(`No permission found for email: ${email}`);
      }
    } catch (error) {
      console.error('Error revoking file access:', error);
      throw error;
    }
  }




  //google sheets api

  async createSpreadsheet(fileName, parentFolder=this.directoryId, accessToken=this.accessToken) {
    // const driveFilesUrl = 'https://www.googleapis.com/drive/v3/files';
    const createSheetUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    const createBody = {
      properties: {
        title: fileName
      },
      parents: [parentFolder]
    };

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', createSheetUrl, true);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.responseText);
        }
      };

      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(JSON.stringify(createBody));
    });
  }

  async findSpreadsheet(fileName, parentFolder=this.directoryId, accessToken=this.accessToken): Promise<any> {
    const driveFilesUrl = 'https://www.googleapis.com/drive/v3/files';
    // const createSheetUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
    const query = `name='${fileName}' and '${parentFolder}' in parents and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;
    const url = `${driveFilesUrl}?q=${encodeURIComponent(query)}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve(response.files[0]);
        } else {
          reject(xhr.responseText);
        }
      };

      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }


  async createTab(spreadsheetId, sheetName, accessToken=this.accessToken) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`;

    const createTabBody = {
      requests: [{
        addSheet: {
          properties: {
            title: sheetName
          }
        }
      }]
    };

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.responseText);
        }
      };

      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(JSON.stringify(createTabBody));
    });
  }

  /**
   * Fetches sheet data from a spreadsheet.
   * 
   * @param spreadsheetId  The ID of the spreadsheet to read from.
   * @param range          An A1-notation range (e.g. "Sheet1!A1:D100"); 
   *                       if omitted or empty, returns the entire sheet with grid data.
   * @param accessToken    A valid OAuth2 access token.
   * @returns              Promise resolving to the parsed JSON response.
   */
  async getSheetData(
    spreadsheetId: string,
    range: string = '',
    accessToken: string
  ): Promise<any> {
    let url: string;

    if (!range) {
      // No range → fetch entire sheet with grid data
      url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?includeGridData=true`;
    } else {
      // Specific A1 range → fetch only those values
      url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?majorDimension=ROWS`;
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(`Error ${xhr.status}: ${xhr.responseText}`);
        }
      };
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }


  async setSheetData(
    spreadsheetId: string,
    sheetName: string,
    accessToken=this.accessToken,
    range: Range,
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'RAW',
    body: { values: (string | number)[][] }
  ): Promise<any> {
    const sheetAppendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName + '!' + range)}:append?valueInputOption=${valueInputOption}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', sheetAppendUrl, true);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.responseText);
        }
      };

      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(JSON.stringify(body));
    });
  }

  async appendData(
    spreadsheetId: string,
    sheetName: string,
    accessToken=this.accessToken,
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'RAW',
    data: { values: (string | number)[][] }
  ) {
    const sheetAppendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetName)}:append?valueInputOption=${valueInputOption}&insertDataOption=INSERT_ROWS`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', sheetAppendUrl, true);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.responseText);
        }
      };

      xhr.onerror = () => reject(xhr.statusText);
      xhr.send(JSON.stringify(data));
    });
  }

  async appendToGoogleSheetOrCreateTab(
    fileName: string,
    sheetName: string, //tab
    values: (string | number)[][],
    valueInputOption: 'RAW' | 'USER_ENTERED' = 'RAW',
    parentFolder: string = this.directoryId,
  ) {
    // const driveFilesUrl = 'https://www.googleapis.com/drive/v3/files';
    // const createSheetUrl = 'https://sheets.googleapis.com/v4/spreadsheets';

    const accessToken = this.gapi.auth.getToken().access_token;

    const body = {
      values: values
    };

    try {
      let spreadsheet = await this.findSpreadsheet(fileName, parentFolder, accessToken);

      if (!spreadsheet) {
        spreadsheet = await this.createSpreadsheet(fileName, parentFolder, accessToken);
      }

      try {
        await this.appendData(spreadsheet.id, sheetName, accessToken, valueInputOption, body);
      } catch (error) {
        if (error.includes('Unable to parse range')) {
          await this.createTab(spreadsheet.id, sheetName, accessToken);
          await this.appendData(spreadsheet.id, sheetName, accessToken, valueInputOption, body);
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }

    /**
     * 
     *   // Usage example:
    const fileName = 'MySpreadsheet';
    const parentFolder = 'your-parent-folder-id';
    const sheetName = 'Sheet1';
    const values = [
        ['a', 'b', 'c', 1, 2, 3],
        ['d', 'e', 'f', 4, 5, 6]
    ];
    const accessToken = 'your-access-token';
    
    appendToGoogleSheetOrCreateTab(fileName, parentFolder, sheetName, values, accessToken)
        .then(response => console.log('Data appended successfully:', response))
        .catch(error => console.error('Error appending data:', error));
 
     */
  }




  //google calendar api


  // Create a calendar by name
  async createCalendar(calendarName: string): Promise<Calendar> {
    try {
      const response = await this.gapi.client.calendar.calendars.insert({
        resource: {
          summary: calendarName,
        },
      });
      console.log('Calendar created:', response.result);
      return response.result as Calendar;
    } catch (error) {
      console.error('Error creating calendar:', error);
      throw error;
    }
  }

  // Helper method to find a calendar by name
  async findCalendarByName(calendarName: string): Promise<Calendar | gapi.client.calendar.CalendarListEntry | undefined> {
    try {
      const response = await this.gapi.client.calendar.calendarList.list();
      const calendars = response.result.items;
      if (calendars) {
        const calendar = calendars.find(cal => cal.summary === calendarName);
        return calendar || undefined;
      }
      return undefined;
    } catch (error) {
      console.error('Error finding calendar by name:', error);
      throw error;
    }
  }

  // Helper method to find an event by name in a calendar
  async findEventByName(calendarId: string, eventName: string): Promise<gapi.client.calendar.Event | Event | undefined> {
    try {
      const response = await this.gapi.client.calendar.events.list({
        calendarId: calendarId,
        q: eventName,
      });
      const events = response.result.items;
      if (events) {
        const event = events.find(ev => ev.summary === eventName);
        return event || undefined;
      }
      return undefined;
    } catch (error) {
      console.error('Error finding event by name:', error);
      throw error;
    }
  }
  // List all calendars
  async listAllCalendars(): Promise<Calendar[] | gapi.client.calendar.CalendarListEntry[]> {
    try {
      const response = await this.gapi.client.calendar.calendarList.list();
      return response.result.items as Calendar[];
    } catch (error) {
      console.error('Error listing all calendars:', error);
      throw error;
    }
  }

  // List events by calendar name within a date range
  async listEventsByCalendarName(calendarName: string, timeMin: string, timeMax: string): Promise<Event[]> {
    try {
      const calendar = await this.findCalendarByName(calendarName);
      if (!calendar?.id) {
        throw new Error(`Calendar named "${calendarName}" not found`);
      }
      return this.listEvents(calendar.id, timeMin, timeMax);
    } catch (error) {
      console.error('Error listing events by calendar name:', error);
      throw error;
    }
  }

  // List events by calendar ID within a date range
  async listEvents(calendarId: string, timeMin: string, timeMax: string): Promise<Event[]> {
    try {
      const response = await this.gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime'
      });
      return response.result.items as Event[];
    } catch (error) {
      console.error('Error listing events:', error);
      throw error;
    }
  }


  // Delete a calendar by name
  async deleteCalendarByName(calendarName: string): Promise<gapi.client.Response<void>> {
    try {
      const calendar = await this.findCalendarByName(calendarName);
      if (!calendar?.id) {
        throw new Error(`Calendar named "${calendarName}" not found`);
      }
      return this.deleteCalendar(calendar.id);
    } catch (error) {
      console.error('Error deleting calendar by name:', error);
      throw error;
    }
  }

  // Delete a calendar by its ID
  async deleteCalendar(calendarId: string): Promise<gapi.client.Response<void>> {
    try {
      const response = await this.gapi.client.calendar.calendars.delete({
        calendarId: calendarId,
      });
      console.log('Calendar deleted:', response);
      return response;
    } catch (error) {
      console.error('Error deleting calendar:', error);
      throw error;
    }
  }

  // Share a calendar by name
  async shareCalendarByName(calendarName: string, email: string, role: Role = 'reader', options: SharingOptions = {}): Promise<Permission> {
    try {
      const calendar = await this.findCalendarByName(calendarName);
      if (!calendar?.id) {
        throw new Error(`Calendar named "${calendarName}" not found`);
      }
      return this.shareCalendar(calendar.id, email, role, options);
    } catch (error) {
      console.error('Error sharing calendar by name:', error);
      throw error;
    }
  }

  // Share a calendar by its ID
  async shareCalendar(calendarId: string, email: string, role: Role = 'reader', options: SharingOptions = {}): Promise<Permission> {
    try {
      const response = await this.gapi.client.calendar.acl.insert({
        calendarId: calendarId,
        resource: {
          role: role,
          scope: {
            type: 'user',
            value: email,
          },
        },
        ...options
      });
      console.log('Calendar shared:', response.result);
      return response.result as Permission;
    } catch (error) {
      console.error('Error sharing calendar:', error);
      throw error;
    }
  }

  async createEventByCalendarName(calendarName: string, event: Event): Promise<Event> {
    try {
      const calendar = await this.findCalendarByName(calendarName);
      if (!calendar?.id) {
        throw new Error(`Calendar named "${calendarName}" not found`);
      }
      return this.createEvent(calendar.id, event);
    } catch (error) {
      console.error('Error creating event by calendar name:', error);
      throw error;
    }
  }

  async createEvent(calendarId: string, event: Event): Promise<Event> {
    try {
      const response = await this.gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: event,
        sendUpdates: event.sendUpdates || 'none'
      });
      console.log('Event created:', response.result);
      return response.result as Event;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Delete an event by calendar and event names
  async deleteEventByCalendarAndEventNames(calendarName: string, eventName: string): Promise<gapi.client.Response<void>> {
    try {
      const calendar = await this.findCalendarByName(calendarName);
      if (!calendar?.id) {
        throw new Error(`Calendar named "${calendarName}" not found`);
      }
      const event = await this.findEventByName(calendar.id, eventName);
      if (!event?.id) {
        throw new Error(`Event named "${eventName}" not found`);
      }
      return this.deleteEvent(calendar.id, event.id);
    } catch (error) {
      console.error('Error deleting event by calendar and event names:', error);
      throw error;
    }
  }

  // Delete an event by calendar and event IDs
  async deleteEvent(calendarId: string, eventId: string): Promise<gapi.client.Response<void>> {
    try {
      const response = await this.gapi.client.calendar.events.delete({
        calendarId: calendarId,
        eventId: eventId,
      });
      console.log('Event deleted:', response);
      return response;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Create a recurring event by calendar name
  async createRecurringEventByCalendarName(calendarName: string, event: Event): Promise<Event> {
    try {
      const calendar = await this.findCalendarByName(calendarName);
      if (!calendar?.id) {
        throw new Error(`Calendar named "${calendarName}" not found`);
      }
      return this.createRecurringEvent(calendar.id, event);
    } catch (error) {
      console.error('Error creating recurring event by calendar name:', error);
      throw error;
    }
  }

  // Create a recurring event by calendar ID
  async createRecurringEvent(calendarId: string, event: Event): Promise<Event> {
    try {
      const response = await this.gapi.client.calendar.events.insert({
        calendarId: calendarId,
        resource: event,
      });
      console.log('Recurring event created:', response.result);
      return response.result as Event;
    } catch (error) {
      console.error('Error creating recurring event:', error);
      throw error;
    }
  }

  async updateEventByCalendarAndEventNames(calendarName: string, eventName: string, updatedEvent: Event): Promise<Event> {
    try {
      const calendar = await this.findCalendarByName(calendarName);
      if (!calendar?.id) {
        throw new Error(`Calendar named "${calendarName}" not found`);
      }
      const event = await this.findEventByName(calendar.id, eventName);
      if (!event?.id) {
        throw new Error(`Event named "${eventName}" not found`);
      }
      return this.updateEvent(calendar.id, event.id, updatedEvent);
    } catch (error) {
      console.error('Error updating event by calendar and event names:', error);
      throw error;
    }
  }

  async updateEvent(calendarId: string, eventId: string, updatedEvent: Event): Promise<Event> {
    try {
      const response = await this.gapi.client.calendar.events.update({
        calendarId: calendarId,
        eventId: eventId,
        resource: updatedEvent,
        sendUpdates: updatedEvent.sendUpdates || 'none',
      });
      console.log('Event updated:', response.result);
      return response.result as Event;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }



  // Revoke calendar access by its ID and email
  async revokeCalendarAccess(calendarId: string, email: string): Promise<void> {
    try {
      const acl = await this.gapi.client.calendar.acl.list({ calendarId });
      if (!acl.result.items) throw new Error(`No ACL rules found for calendar ${calendarId}`);
      const rule = acl.result.items.find(r => r.scope?.value === email);
      if (rule?.id) {
        await this.gapi.client.calendar.acl.delete({
          calendarId: calendarId,
          ruleId: rule.id,
        });
        console.log('Calendar access revoked for:', email);
      } else {
        throw new Error(`No ACL rule found for email: ${email}`);
      }
    } catch (error) {
      console.error('Error revoking calendar access:', error);
      throw error;
    }
  }

  // Revoke event attendee
  async revokeEventAttendee(calendarId: string, eventId: string, email: string, sendUpdates: 'all' | 'externalOnly' | 'none' = 'none'): Promise<gapi.client.calendar.Event | Event> {
    try {
      const event = await this.gapi.client.calendar.events.get({
        calendarId: calendarId,
        eventId: eventId,
      });
      if (event.result.attendees) {
        event.result.attendees = event.result.attendees.filter(attendee => attendee.email !== email);

        const updatedEvent = await this.gapi.client.calendar.events.update({
          calendarId: calendarId,
          eventId: eventId,
          resource: event.result,
          sendUpdates: sendUpdates,
        });

        console.log('Event attendee revoked for:', email);
        return updatedEvent.result;
      } else throw new Error('event.result.attendees undefined');
    } catch (error) {
      console.error('Error revoking event attendee:', error);
      throw error;
    }
  }

}


type FileBrowserOptions = {
  onFileClick?: (fileData: gapi.client.drive.File | FileMetadata) => void;
};

//mock file browsing features
export class GFileBrowser extends GDrive {
  previousPageToken?: string;
  nextPageToken?: string;
  options: FileBrowserOptions;
  overwrite: boolean = false;

  currentFolderId: string;
  currentFolderMetadata?: gapi.client.drive.File | FileMetadata;
  files: gapi.client.drive.File[] | FileMetadata[] | undefined = [];

  /**
 * Renders the full file browser UI into `container`, then
 * resolves or creates `folderName` and lists its contents.
 */
  async createFileBrowser(
    container: HTMLElement | string,
    folderName = this.directory,
    nextPageToken = this.nextPageToken,
    parentFolder?: string,
    options: FileBrowserOptions = {}
  ): Promise<void> {
    if (options) this.options = options;

    // Resolve container
    let root: HTMLElement;
    if (typeof container === 'string') {
      const el = document.getElementById(container);
      if (!el) {
        console.error(`Container '${container}' not found`);
        return;
      }
      root = el;
    } else {
      root = container;
    }
    this.container = root;

    // Inject browser HTML
    root.innerHTML += `
    <div id="file-browser">
      <div id="file-upload">
        <button id="upload-button">Upload Files</button>
        <input type="file" id="file-input" multiple style="display:none"/>
        <label><input type="checkbox" id="overwrite-checkbox"> Overwrite existing files</label>
      </div>
      <div id="search-bar">
        <input type="text" id="search-input" placeholder="Search files and folders"/>
        <button id="search-button">Search</button>
      </div>
      <div id="drop-zone">Drop files here to upload</div>
      <progress id="upload-progress" max="100" value="0" style="width:100%; display:none;"></progress>
      <div id="folder-path"></div>
      <div id="file-list"></div>
      <button id="previous-page" style="display:none">Previous</button>
      <button id="next-page" style="display:none">Next</button>
    </div>`;

    // Wire overwrite checkbox
    const overwriteCheckbox = root.querySelector('#overwrite-checkbox') as HTMLInputElement;
    overwriteCheckbox.checked = this.overwrite;
    overwriteCheckbox.addEventListener('change', () => {
      this.overwrite = overwriteCheckbox.checked;
    });

    // Wire search
    const searchButton = root.querySelector('#search-button') as HTMLButtonElement;
    const searchInput = root.querySelector('#search-input') as HTMLInputElement;
    searchButton.addEventListener('click', () => {
      this.searchFiles(searchInput.value, root);
    });

    // Ensure folder exists (list or create)
    const folderData = await this.checkFolder(folderName) as any;
    if (!folderData) throw new Error("Folder Not Found");

    // Extract the folder ID whether list result or create result
    let fileId: string;
    if (Array.isArray(folderData.files) && folderData.files.length > 0) {
      fileId = folderData.files[0].id;
    } else if (folderData.id) {
      fileId = folderData.id;
    } else {
      throw new Error("Unexpected folderData format");
    }
    this.directoryId ||= fileId;

    // Populate and wire the rest of the UI
    await this.updateFileList(fileId, nextPageToken, parentFolder, root);
    this.setupDragAndDrop(fileId, nextPageToken, parentFolder, root);
    this.setupUploadButton(fileId, nextPageToken, parentFolder, root);
    this.setupPaginationButtons(fileId, parentFolder, root);

    document.addEventListener('click', (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el.closest('.export-menu')) {
        this.removeExportMenus();
      }
    });
  }

  async createFileUploader(
    container: HTMLElement | string,
    folderId: string | undefined = this.directoryId,
    nextPageToken?: string | undefined,
    parentFolder?: string | undefined
  ): Promise<void> {
    if (typeof container === 'string') {
      container = document.getElementById(container) as HTMLElement;
    }

    if (!container) {
      console.error('Container element not found');
      return;
    }

    container.innerHTML += `<div id="file-upload">
            <button id="upload-button">Upload Files</button>
            <input type="file" id="file-input" multiple style="display:none"/>
            <label><input type="checkbox" id="foverwrite-checkbox"> Overwrite existing files</label>
            <button id="create-folder-button">Create Folder</button>
        </div>
        <div id="drop-zone">Drop files here to upload</div>
        <progress id="upload-progress" max="100" value="0" style="width:100%; display:none;"></progress>`;

    const overwriteCheckbox = container.querySelector('#foverwrite-checkbox') as HTMLInputElement;
    overwriteCheckbox.checked = this.overwrite;
    overwriteCheckbox.addEventListener('change', () => {
      this.overwrite = overwriteCheckbox.checked;
    });

    this.setupUploadButton(folderId, nextPageToken, parentFolder, container);
    this.setupDragAndDrop(folderId, nextPageToken, parentFolder, container);
    this.setupCreateFolderButton(folderId, container);
  }

  setupCreateFolderButton(folderId: string, container: HTMLElement): void {
    const createFolderButton = container.querySelector('#create-folder-button') as HTMLButtonElement;

    if (!createFolderButton) {
      console.error('Create folder button not found');
      return;
    }

    createFolderButton.addEventListener('click', async () => {
      const folderName = prompt('Enter folder name:');
      if (folderName) {
        try {
          const newFolder = await this.createDriveFolder(folderName, folderId);
          console.log('Created folder:', newFolder);
          this.updateFileList(folderId, undefined, undefined, container);
        } catch (error) {
          console.error('Error creating folder:', error);
          alert('Error creating folder. Please try again.');
        }
      }
    });
  }

  setupUploadButton(
    folderId = this.directoryId,
    nextPageToken: string | undefined,
    parentFolder: string | undefined,
    container: HTMLElement
  ): void {
    const uploadButton = container.querySelector('#upload-button') as HTMLButtonElement;
    const fileInput = container.querySelector('#file-input') as HTMLInputElement;

    if (!uploadButton || !fileInput) {
      console.error('Upload button or file input not found');
      return;
    }

    uploadButton.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', async () => {
      const files = fileInput.files as FileList;
      if (files.length > 0) {
        const uploadFiles: UploadFile[] = Array.from(files).map(file => ({
          name: file.name,
          mimeType: file.type,
          data: file,
        }));

        const uploadProgress = container.querySelector('#upload-progress') as HTMLProgressElement;
        await this.uploadFiles(uploadFiles, folderId, uploadProgress, this.overwrite);
        this.updateFileList(folderId, nextPageToken, parentFolder, container);
        fileInput.value = ''; // Clear the file input
      }
    });
  }

  setupDragAndDrop(
    currentFolderId: string,
    nextPageToken: string | undefined,
    parentFolder: string | undefined,
    container: HTMLElement
  ): void {
    const dropZone = container.querySelector('#drop-zone') as HTMLElement;
    if (!dropZone) {
      console.error('Drop zone element not found');
      return;
    }

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('highlight');
    });

    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('highlight');
    });

    dropZone.addEventListener('drop', async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('highlight');

      const files = e.dataTransfer?.files as FileList;
      if (files.length > 0) {
        const uploadFiles: UploadFile[] = Array.from(files).map(file => ({
          name: file.name,
          mimeType: file.type,
          data: file,
        }));

        const uploadProgress = container.querySelector('#upload-progress') as HTMLProgressElement;
        await this.uploadFiles(uploadFiles, this.directory, uploadProgress, this.overwrite);
        this.updateFileList(currentFolderId, nextPageToken, parentFolder, container);
      }
    });
  }

  async updateFileList(
    currentFolderId = this.directory,
    pageToken: string | undefined = undefined,
    parentFolder: string | undefined,
    container: HTMLElement
  ): Promise<void> {
    try {
      const { files, nextPageToken } = await this.listDriveFiles(currentFolderId, 100, undefined, pageToken, parentFolder) as any;
      this.files = files;

      // Fetch and store current folder metadata
      this.currentFolderMetadata = await this.getFileMetadata(currentFolderId);

      this.renderFileList(files, currentFolderId, parentFolder, container);

      // Update the previous page token when navigating forward.
      if (pageToken !== undefined && pageToken !== null) {
        this.previousPageToken = pageToken;
      }
      // Update the next page token.
      this.nextPageToken = nextPageToken;
      // Update the visibility of the pagination buttons.
      (container.querySelector('#previous-page') as HTMLButtonElement).style.display = this.previousPageToken ? 'block' : 'none';
      (container.querySelector('#next-page') as HTMLButtonElement).style.display = this.nextPageToken ? 'block' : 'none';
    } catch (error) {
      console.error('Error updating file list:', error);
    }
  }

  async searchFiles(query: string, container: HTMLElement): Promise<void> {
    try {
      const { files } = await this.searchDrive(query, 100, undefined, this.currentFolderId);
      this.files = files;
      if (files) this.renderFileList(files, this.currentFolderId, this.currentFolderId, container);
    } catch (error) {
      console.error('Error searching files:', error);
    }
  }

  renderFileList(
    files: gapi.client.drive.File[] | FileMetadata[],
    currentFolderId: string = this.directoryId,
    parentFolder: string | undefined,
    container: HTMLElement
  ): void {
    const fileListContainer = container.querySelector('#file-list') as HTMLElement;
    const folderPathContainer = container.querySelector('#folder-path') as HTMLElement;

    if (!fileListContainer || !folderPathContainer) {
      console.error('File browser elements not found');
      return;
    }

    let html = '';
    files.forEach((file, index) => {
      const icon = this.getFileTypeIcon(file);
      html += `<div class="file-item" data-index="${index}">
            ${icon} ${file.name} 
            <span class="share-btn" data-index="${index}">🔗</span>
            <span class="delete-btn" data-id="${file.id}">🗑️</span>
          </div>`;
    });
    fileListContainer.innerHTML = html;

    this.setupFileItemClick(parentFolder, container);
    this.setupDeleteFileClick(container);
    this.setupShareFileClick(container);

    if (currentFolderId !== this.directory) {
      folderPathContainer.innerHTML = `<button id="parent-folder">Go to Parent Folder</button>`;
      (container.querySelector('#parent-folder') as HTMLButtonElement).addEventListener('click', () => {
        this.goBackToParentFolder(container);
      });
    } else {
      folderPathContainer.innerHTML = '';
    }
  }

  setupShareFileClick(container: HTMLElement): void {
    const shareButtons = container.querySelectorAll('.share-btn');
    shareButtons.forEach((btn: any) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation(); // Prevent triggering file item click
        const index = parseInt(btn.getAttribute('data-index') as string);
        if (!this.files) return;
        const fileData = this.files[index];

        try {
          const sharableLink = await this.getSharableLink(fileData.id as string);
          alert(`Sharable link for ${fileData.name}: ${sharableLink}`);
        } catch (error) {
          console.error('Error generating sharable link:', error);
          alert('Error generating sharable link. Please try again.');
        }
      });
    });
  }

  setupDeleteFileClick(container: HTMLElement): void {
    const deleteButtons = container.querySelectorAll('.delete-btn');
    deleteButtons.forEach((btn: any) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent triggering file item click
        const fileId = btn.getAttribute('data-id') as string;

        if (!btn.isConfirming) {
          // First click - show confirmation tooltip
          btn.textContent = '❌?';
          btn.isConfirming = true;
        } else {
          // Second click - perform deletion
          this.deleteFile(fileId);
          (btn.closest('.file-item') as HTMLElement).remove(); // Remove the file item from the list
        }
      });
    });

    // Reset delete confirmation if clicking anywhere else
    document.addEventListener('click', () => {
      deleteButtons.forEach((btn: any) => {
        btn.textContent = '🗑️'; // Reset to original icon
        btn.isConfirming = false;
      });
    }, { once: true }); // Listen once and auto-remove
  }

  getFileTypeIcon(file: FileMetadata): string {
    if (file?.thumbnailLink) {
      return `<img src="${file.thumbnailLink}" alt="${file.name}" class="file-icon" />`;
    } else if (file?.iconLink) {
      return `<img src="${file?.iconLink}" alt="${file.name}" class="file-icon" />`;
    } else if (file?.mimeType === 'application/vnd.google-apps.folder') {
      return '📁'; // Folder emoji
    } else if (file?.mimeType.startsWith('image/')) {
      return '🖼️'; // Image emoji
    } else if (file?.mimeType === 'text/csv' || file.mimeType === 'application/vnd.ms-excel') {
      return '📊'; // Chart (CSV) emoji
    } else {
      return '📄'; // Generic file emoji
    }
  }


  /** Remove any open export menus */
  private removeExportMenus() {
    document.querySelectorAll('.export-menu').forEach(m => m.remove());
  }

  /** Show the menu */
  private showExportMenu(
    anchor: HTMLElement,
    fileData: FileMetadata,
    opts: { label: string; mime: string }[]
  ) {
    // kill any existing
    this.removeExportMenus();

    const menu = document.createElement('div');
    menu.className = 'export-menu';

    opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.textContent = opt.label;
      btn.addEventListener('click', async e => {
        e.preventDefault();      // 🔒 stop any default
        e.stopPropagation();     // 🔒 prevent the document listener
        await this.downloadFile( // ← your unified downloadFile
          fileData.id,
          opt.mime,
          fileData.name
        );
        this.removeExportMenus();
      });
      menu.appendChild(btn);
    });

    anchor.appendChild(menu);
  }

  setupFileItemClick(parentFolder: string | undefined, container: HTMLElement): void {
    container.querySelectorAll('.file-item').forEach(item => {
      item.addEventListener('click', async e => {
        e.stopPropagation();      // prevent constructor’s document listener
        this.removeExportMenus(); // clear any old menu

        const idx = Number(item.getAttribute('data-index'));
        const fileData = this.files?.[idx];
        if (!fileData) return;

        // ── folder navigation ──
        if (fileData.mimeType === 'application/vnd.google-apps.folder') {
          await this.updateFileList(
            fileData.id as string,
            undefined,
            parentFolder,
            container
          );
          this.currentFolderId = fileData.id as string;
          return;
        }

        // ── custom callback? ──
        if (this.options.onFileClick) {
          this.options.onFileClick(fileData as FileMetadata);
          return;
        }

        // ── lookup your class’s single source of truth ──
        const opts = nativeExportOptions[fileData.mimeType!] ?? [];
        if (opts.length > 1) {
          // multiple → show buttons
          this.showExportMenu(item as HTMLElement, fileData as FileMetadata, opts);
        } else {
          // zero or one → straight download
          try {
            const mime = opts[0]?.mime;
            await this.downloadFile(fileData.id as string, mime, fileData.name);
            console.log('Downloaded:', fileData.name);
          } catch (err) {
            console.error('Download failed:', err);
          }
        }
      });
    });
  }

  setupPaginationButtons(folderId: string, parentFolder: string | undefined, container: HTMLElement): void {
    (container.querySelector('#previous-page') as HTMLButtonElement).addEventListener('click', () => {
      if (this.previousPageToken !== undefined) {
        this.updateFileList(folderId, this.previousPageToken, parentFolder, container);
        // Clear the previous page token since we've navigated back.
        this.previousPageToken = undefined;
      }
    });

    (container.querySelector('#next-page') as HTMLButtonElement).addEventListener('click', () => {
      if (this.nextPageToken) {
        this.updateFileList(folderId, this.nextPageToken, parentFolder, container);
      }
    });
  }

  async goBackToParentFolder(container: HTMLElement): Promise<void> {
    try {
      if (this.currentFolderMetadata && this.currentFolderMetadata.parents && this.currentFolderMetadata.parents.length > 0) {
        const parentFolderId = this.currentFolderMetadata.parents[0];

        // Check if the current folder ID matches the directory ID (if specified)
        if (this.currentFolderId === this.directoryId) {
          console.log('Reached the main directory.');
          return;
        }

        this.currentFolderId = parentFolderId;
        await this.updateFileList(parentFolderId, undefined, undefined, container);
      } else {
        console.error('This folder does not have a parent.');
      }
    } catch (error) {
      console.error('Error going back to parent folder:', error);
    }
  }
}