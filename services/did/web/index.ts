import axios from "axios";

export const resolve = async (did: string) => {
  const url = convertDidToEndpoint(did);
  const resp = await axios({
    method: "get",
    url,
    headers: {
      // Authorization: `Bearer ${token}`,
      accept: "application/json"
    }
  });
  return resp.data;
};

export const convertDidToEndpoint = (did: string) => {
  const regex = new RegExp(
    `did:web:(?<host>[a-zA-Z0-9/.\\-_]+)(?:%3A(?<port>[0-9]+))?(:*)(?<path>[a-zA-Z0-9/.:\\-_]*)`
  );
  const match: any = did.match(regex);
  if (!match) {
    throw new Error("DID is not a valid did:web");
  }
  const { host, port, path } = match.groups;
  const origin = port ? `${host}:${port}` : `${host}`;
  const protocol = host.includes("localhost") ? "http" : "https";
  const decodedPartialPath = path.split(":").join("/");
  const endpoint = path
    ? `${protocol}://${origin}/${decodedPartialPath}/did.json`
    : `${protocol}://${origin}/.well-known/did.json`;
  return endpoint;
};

export const convertEndpointToDid = (endpoint: string): string => {
  const url = new URL(endpoint);
  const { pathname } = url;
  let { host } = url;
  if (host.includes(":")) {
    host = encodeURIComponent(host);
  }
  if (endpoint.includes(".well-known/did.json")) {
    return `did:web:${host}`;
  }
  return `did:web:${host}${pathname
    .replace(/\//g, ":")
    .replace(":did.json", "")}`;
};

const web = { resolve, convertDidToEndpoint, convertEndpointToDid }

export default web