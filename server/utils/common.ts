import { H3Event } from "h3";

export function getHeader(
    event: H3Event,
    headerName: string
): string | undefined {
    const headerValue = getHeaderValue(event, headerName);
    return typeof headerValue === "string" ? headerValue : undefined;
}

export function getHeaderValue(
    event: H3Event,
    name: string
): string | string[] | undefined {
    return event.node.req.headers[name.toLowerCase()];
}
