// By Joshua Brewster (MIT License)

/**
 * CSV Utility: all methods are static. 
 * Attach behaviors via attach helpers or call directly.
 */
export class CSV {
    /** Order comments by data index { idx, text } */
    private static notes: Array<{ idx: number; text: string }> = [];

    /** Add a note to include at row index when processing arrays */
    public static addNote(idx: number, text: string): void {
        CSV.notes.push({ idx, text });
        CSV.notes.sort((a, b) => a.idx - b.idx);
    }

    /** Clear all stored notes */
    public static clearNotes(): void {
        CSV.notes = [];
    }

    /**
     * Build a CSV string from array-of-strings or array-of-arrays.
     * @param data - e.g. ["1|2|3", [3,2,1]]
     * @param delimiter - input delimiter for data parsing (default "|")
     * @param header - CSV header row as array or comma string
     * @param saveNotes - include notes as extra column
     */
    public static processArraysForCSV(
        data: Array<string | any[]>,
        delimiter: string = "|",
        header: string[] = [],
        saveNotes: boolean = false
    ): string {
        const delim = delimiter;
        let out = '';
        if (header.length) {
            out += CSV.quoteRow(header, ',') + '\n';
        }
        let noteIdx = 0;

        data.forEach((lineRaw, i) => {
            let row: string[];
            if (typeof lineRaw === 'string') {
                row = lineRaw.split(delim).map(String);
            } else {
                row = lineRaw.map(String);
            }

            if (saveNotes && CSV.notes[noteIdx]?.idx === i) {
                row.push(CSV.notes[noteIdx].text);
                noteIdx++;
            }

            out += CSV.quoteRow(row, ',') + '\n';
        });

        return out;
    }

    /** Download CSV text by creating and clicking a hidden link */
    public static saveCSV(
        csvText: string = 'a,b,c\n1,2,3',
        name: string = ''
    ): void {
        const bom = '\uFEFF';
        const blob = new Blob([bom + csvText], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';

        let filename = name;
        if (!filename) filename = new Date().toISOString();
        if (!/\.(csv)$/i.test(filename)) filename += '.csv';
        a.download = filename;

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /** Prompt user to pick and open a CSV/TSV file, parse it, and callback */
    public static openCSV(
        delimiter: string = ',',
        onOpen: (data: string[][], header: string[], path: string) => void = CSV.defaultOnOpen
    ): Promise<{ data: string[][]; header: string[]; filename: string }> {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.tsv';
            input.onchange = (e: Event) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return reject(new Error('No file selected'));
                const reader = new FileReader();
                reader.onload = () => {
                    const raw = reader.result as string;
                    const delim = CSV.detectDelimiter(raw, delimiter);
                    const lines = CSV.splitLines(raw);
                    const header = CSV.parseLine(lines.shift()!, delim);
                    const data = lines.map((l) => CSV.parseLine(l, delim));
                    onOpen(data, header, file.name);
                    resolve({ data, header, filename: file.name });
                };
                reader.readAsText(file, CSV.detectEncoding(file.name));
            };
            input.click();
        });
    }

    /** Similar to openCSV but returns raw text */
    public static openCSVRaw(
        onOpen: (data: string, path: string) => void = CSV.defaultOnOpenRaw
    ): Promise<{ data: string; filename: string }> {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.csv,.tsv';
            input.onchange = (e: Event) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file) return reject(new Error('No file selected'));
                const reader = new FileReader();
                reader.onload = () => {
                    const raw = reader.result as string;
                    onOpen(raw, file.name);
                    resolve({ data: raw, filename: file.name });
                };
                reader.readAsText(file, CSV.detectEncoding(file.name));
            };
            input.click();
        });
    }

    /** Default no-op CSV open callback */
    private static defaultOnOpen(
        data: string[][],
        header: string[],
        path: string
    ): void {
        console.log('CSV opened:', header, data, path);
    }

    /** Default no-op raw CSV open callback */
    private static defaultOnOpenRaw(data: string, path: string): void {
        console.log('Raw CSV opened:', path, '\n', data);
    }

    /** Attach CSV save behavior to a button (ID or element) */
    public static attachSaveButton(
        element: string | HTMLElement,
        provider: () => string,
        nameProvider?: () => string
    ): void {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        el?.addEventListener('click', () => {
            const csv = provider();
            const name = nameProvider ? nameProvider() : '';
            CSV.saveCSV(csv, name);
        });
    }

    /** Attach CSV open behavior to a button */
    public static attachOpenButton(
        element: string | HTMLElement,
        delimiter: string = ',',
        onOpen?: (data: string[][], header: string[], path: string) => void
    ): void {
        const el = typeof element === 'string' ? document.getElementById(element) : element;
        el?.addEventListener('click', () => CSV.openCSV(delimiter, onOpen));
    }

    // -- Internal helpers --
    private static parseLine(line: string, delim: string): string[] {
        const fields: string[] = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
                else { inQuotes = !inQuotes; }
            } else if (ch === delim && !inQuotes) {
                fields.push(cur); cur = '';
            } else {
                cur += ch;
            }
        }
        fields.push(cur);
        return fields;
    }

    private static quoteRow(row: string[], delim: string): string {
        return row.map((f) => {
            if ([delim, '"', '\n', '\r'].some((c) => f.includes(c))) {
                return `"${f.replace(/"/g, '""')}"`;
            }
            return f;
        }).join(delim);
    }

    private static splitLines(raw: string): string[] {
        return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter((l) => l !== '');
    }

    private static detectDelimiter(raw: string, fallback: string): string {
        const sample = raw.slice(0, 1024);
        const counts: Record<string, number> = {
            ',': (sample.match(/,/g) || []).length,
            '\t': (sample.match(/\t/g) || []).length,
            ';': (sample.match(/;/g) || []).length,
        };
        return Object.entries(counts).reduce((best, [d, c]) => c > counts[best] ? d : best, fallback);
    }

    private static detectEncoding(filename: string): string {
        const ext = filename.split('.').pop()?.toLowerCase();
        return ext === 'csv' || ext === 'tsv' ? 'utf-8' : 'utf-8';
    }

    /**
     * Process structured data for CSV export; optionally save immediately.
     */
    public static processDataForCSV(
        options: { filename?: string; save?: boolean; dir?: string; header?: string[]; data: any[] }
    ): { filename?: string; header: string; body: string } | undefined {
        if (!options.data || !options.data.length) return undefined;
        const arr = Array.isArray(options.data) ? options.data : [options.data];
        const cols = options.header ?? Object.keys(arr[0]);
        if (cols.includes('timestamp')) {
            const idx = cols.indexOf('timestamp') + 1;
            cols.splice(idx, 0, 'localized');
        }
        const rows: string[] = [];
        arr.forEach((rec) => {
            const len = Array.isArray(rec[cols[0]]) ? (rec[cols[0]].length) : 1;
            for (let i = 0; i < len; i++) {
                const cells: string[] = [];
                cols.forEach((key) => {
                    let val = Array.isArray(rec[key]) ? rec[key][i] : rec[key];
                    if (key === 'timestamp') {
                        const d = new Date(val);
                        cells.push(d.toISOString(), d.toLocaleString());
                    } else {
                        cells.push(String(val ?? ''));
                    }
                });
                rows.push(CSV.quoteRow(cells, ','));
            }
        });
        const hdr = CSV.quoteRow(cols, ',') + '\n';
        const body = rows.join('\n');
        const result = { filename: options.filename, header: hdr, body };
        if (options.save) CSV.saveCSV(hdr + body, options.filename || '');
        return result;
    }

    /**
     * Generic CSV parser: converts raw CSV text into object arrays keyed by header.
     */
    public static parseCSVData = (
        data: string,
        filename: string,
        head?: string[] | string,
        hasend: boolean = true,
        parser: (lines: string[], filename: string, head: string[]) => any = (
            lines, fn, hd
        ) => {
            const result: any = { filename: fn, header: hd };
            lines.forEach((row) => {
                const parts = row.split(',');
                hd.forEach((col, j) => {
                    (result[col] ??= []).push(parts[j]);
                });
            });
            return result;
        }
    ): any => {
        let lines = data.includes('\r') ? data.split('\r\n') : data.split('\n');
        if (!head) head = lines[0];
        if (typeof head === 'string') head = head.split(',');
        lines.shift();
        if (!hasend) lines.pop();
        return parser(lines, filename, head as string[]);
    };

}

/**
 * Return an ISO-like timestamp in local timezone with UTC offset.
 */
export function toISOLocal(d: string | number | Date): string {
    const dt = new Date(d);
    const z = (n: number, w: number = 2) => n.toString().padStart(w, '0');
    const ms = dt.getMilliseconds().toString().padStart(3, '0');
    const off = -dt.getTimezoneOffset();
    const sign = off >= 0 ? '+' : '-';
    const oh = Math.floor(Math.abs(off) / 60);
    const om = Math.abs(off) % 60;
    return `${dt.getFullYear()}-${z(dt.getMonth() + 1)}-${z(dt.getDate())}T${z(dt.getHours())}:${z(dt.getMinutes())}:${z(dt.getSeconds())}.${ms}(UTC${sign}${z(oh)}:${z(om)})`;
}
