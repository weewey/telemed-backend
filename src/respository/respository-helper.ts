export function getQueryOps<T>(findAllAttrs: T): any[] {
  const queryOps = Object.keys(findAllAttrs).map((key) => {
    // @ts-ignore
    return { [key]: findAllAttrs[key] };
  });
  return queryOps;
}
