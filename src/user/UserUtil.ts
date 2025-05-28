export function parseTags(tags?: string | null): string[] {
    if (!tags || tags.trim() === '') return [];
    try {
        return JSON.parse(tags);
    } catch (e) {
        console.error('Error parsing tags:', e);
        return [];
    }
}