export function storeMappings(nameMappings: NameMappings) {
    window.localStorage.setItem("nameMappings", JSON.stringify(nameMappings));
}

export function loadMappings(): NameMappings|null {
    const json = window.localStorage.getItem("nameMappings");
    if (!json) return null;
    return JSON.parse(json);
}
