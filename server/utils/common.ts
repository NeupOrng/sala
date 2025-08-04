import { H3Event } from "h3";

export function getHeader(
    event: H3Event,
    headerName: string
): string | undefined {
    console.log("event", event);
    const headerValue = getHeaderValue(event, headerName);
    return typeof headerValue === "string" ? headerValue : undefined;
}

function getHeaderValue(
    event: H3Event,
    name: string
): string | string[] | undefined {
    console.log('headers', event.node.req.headers)
    return event.node.req.headers[name.toLowerCase()];
}
