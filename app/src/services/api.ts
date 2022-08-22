export const api = {
  connect: (host: string) => `http://${host}/connect`,
  info: (host: string) => `http://${host}/info`,
  peers: (host: string) => `http://${host}/peers`,
  peer: (host: string) => `http://${host}/peer`,
  peerByUid: (host: string, uid: string) => `http://${host}/peer/${uid}`,
  upload: (host: string) => `http://${host}/upload`,
  download: (host: string) => `http://${host}/download`,
  file: (host: string, fileName: string) => `http://${host}/file/${fileName}`,
  chain: (host: string) => `http://${host}/chain`
};
