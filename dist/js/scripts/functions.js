export function DateFormatter(date) {
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
}
export function generateElementRandomId() {
    const prefix = "element";
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${randomString}`;
}
