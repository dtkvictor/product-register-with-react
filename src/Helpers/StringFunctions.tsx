type word = string|undefined|null;

export function uppercaseFirstLetter(word: word): string|null {
    if(!word) return null;
    return word.slice(0, 1).toUpperCase() + word.slice(1);
}

export function removeHtmlTags(word: word): string|null {
    if(!word) return null;
    return word.replace(/<[^>]*>/g, '');
}

export function sha1(word: word): null|Promise<string> {
    if(!word) return null;

    const encoder = new TextEncoder();
    const data = encoder.encode(word);

    return crypto.subtle.digest('SHA-1', data).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    });
}

export function slug(word: word): string
{
    if(!word) return '';
    return word.trim()
               .toLocaleLowerCase()
               .replace(/[\W_]+/g, '-')
               .replace(/^-+|-+$/g, '');
}