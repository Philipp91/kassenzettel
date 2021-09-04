/**
 * @param purchases A list of purchases to be aggregated.
 * @param mappings Mappings to take into account when aggregating, to group purchases with different names together.
 * @returns Aggregated groups.
 */
export default function aggregate(purchases: Purchase[], mappings: NameMappings): ProductGroups {
    const groups: ProductGroups = {};
    for (const purchase of purchases) {
        const name = mappings[purchase.item] || purchase.item;
        let group = groups[name];
        if (!group) {
            groups[name] = group = {name, totalPrice: 0, purchases: []};
        }
        group.totalPrice += purchase.totalPrice;
        group.purchases.push(purchase);
    }
    return groups;
}

/**
 * @param source One token.
 * @param target Another token.
 * @return If they're the same (even if one is abbreviated), returns the token, otherwise null.
 */
function mergeTokens(source: string, target: string): string | null {
    if (source === target) return source;
    if (source.endsWith('.') && target.startsWith(source.slice(0, -1))) return target;
    if (target.endsWith('.') && source.startsWith(target.slice(0, -1))) return source;
    return null;
}

const blacklistedNames = new Set(['bio', 'le', 'the']);

/**
 * Attempts to find commonalities among the two names that would allow merging them to a common third name.
 * @param source The first product name.
 * @param target The second product name.
 * @return A common name, or null if there's no sufficient commonality.
 */
export function mergeNames(source: string, target: string): string | null {
    const sourceTokens = source.split(' ');
    const targetTokens = target.split(' ');
    let commonName = '';
    for (let i = 0; i < sourceTokens.length && i < targetTokens.length; ++i) {
        const mergedToken = mergeTokens(sourceTokens[i], targetTokens[i]);
        if (!mergedToken) {
            break;
        }
        commonName += (commonName && ' ') + mergedToken;
    }
    return (commonName && !blacklistedNames.has(commonName.toLowerCase())) ? commonName : null;
}

/**
 * @param sourceGroup A ProductGroup, or multiple.
 * @param targetName A group name.
 * @return A mapping from all purchases in the group to the given group name.
 */
export function mapGroupToName(sourceGroup: ProductGroup | ProductGroup[], targetName: string): NameMappings {
    const newMappings: NameMappings = {};
    for (const group of (Array.isArray(sourceGroup) ? sourceGroup : [sourceGroup])) {
        for (const purchase of group.purchases) {
            if (purchase.item !== targetName) {
                newMappings[purchase.item] = targetName;
            }
        }
    }
    return newMappings;
}

/**
 * Returns new mappings that (at least) result in the two groups being merged.
 * @param source The first product group (usually the one being dragged).
 * @param target The second product group (usually the one being dropped on).
 */
export function proposeNewMappings(source: ProductGroup, target: ProductGroup): NameMappings {
    const mergedName = mergeNames(source.name, target.name);
    if (mergedName) {
        return {...mapGroupToName(source, mergedName), ...mapGroupToName(target, mergedName)};
    }
    return mapGroupToName(source, target.name);
}
