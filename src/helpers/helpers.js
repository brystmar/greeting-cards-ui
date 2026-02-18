export function normalizeNulls(input) {
    // Replaces any incoming null values with empty strings, as a burnt offering to the React gods
    return input == null ? "" : input
}
