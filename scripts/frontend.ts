
let _tokenValue: string | null = null;
let _tokenPromise: Promise<string> | null = null;

export const protocol = "https"; //todo: automate but we need https
export const host = "localhost";
export const port = "3000"
export const clientUrl = `${protocol}://${host}:${port}`


export function obtainClientToken(): Promise<string> {
  if (_tokenValue) return Promise.resolve(_tokenValue);   // cached
  if (_tokenPromise) return _tokenPromise;                  // in-flight

  _tokenPromise = fetch(`${clientUrl}/client-token`)
    .then(r => r.json())
    .then(({ clientToken }) => {
      _tokenValue = clientToken;     // cache for everyone else
      _tokenPromise = null;
      return clientToken;
    });

  return _tokenPromise;
}


export interface GlobalSharedKeys {
  /* …existing keys… */
  currentCustomerId:    string | null;
  currentSubMerchantId: string | null;
  /** NEW — active/selected transaction */
  currentTransactionId: string | null;
}
