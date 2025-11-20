
export const jsonToCsv = (jsonData: any[]): string => {
    if (!jsonData || jsonData.length === 0) {
        return '';
    }
    const keys = Object.keys(jsonData[0]);
    const csvRows = [
        keys.join(','), // Header row
        ...jsonData.map(row => 
            keys.map(key => {
                let value = row[key];
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`; // Quote values with commas
                }
                return value;
            }).join(',')
        )
    ];
    return csvRows.join('\n');
};

export const downloadCsv = (csvString: string, filename: string) => {
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

export const csvToJson = (csvString: string): any[] => {
    const lines = csvString.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const jsonData = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const entry: {[key: string]: any} = {};
        for (let j = 0; j < headers.length; j++) {
            entry[headers[j]] = values[j] ? values[j].trim() : '';
        }
        jsonData.push(entry);
    }
    return jsonData;
}
