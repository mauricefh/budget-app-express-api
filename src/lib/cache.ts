import NodeCache from "node-cache";

const cache = new NodeCache({
  stdTTL: 300, // the standard ttl as number in seconds for every generated cache element.
  checkperiod: 60, // checks for expired keys every 60 seconds and cleans them up
});

export default cache;
