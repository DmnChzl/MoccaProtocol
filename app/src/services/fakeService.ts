const BLOCKS = [
  {
    idx: 0,
    timestamp: 1662026400 * 1000,
    transactions: [],
    prevHash: '',
    hash: 'al7gixpaoma'
  },
  {
    idx: 1,
    timestamp: 1662112800 * 1000,
    transactions: [
      {
        timestamp: 1662026400 * 1000,
        from: '127.0.0.1:1271',
        to: '192.168.1.1:1234',
        value: {
          fileName: 'BelgraviaScandal.pdf',
          fileSize: 1024 * 1024
        }
      },
      {
        timestamp: 1662112800 * 1000,
        from: '192.168.1.1:1234',
        to: '172.16.0.254:2540',
        value: {
          fileName: 'final_problem.png',
          fileSize: 2048 * 2048
        }
      }
    ],
    prevHash: 'al7gixpaoma',
    hash: '7o9xwpoqbzc'
  },
  {
    idx: 2,
    timestamp: 1662199200 * 1000,
    transactions: [
      {
        timestamp: 1662112800 * 1000,
        from: '172.16.0.254:2540',
        to: '127.0.0.1:1271',
        value: {
          fileName: 'PinkStudy.txt',
          fileSize: 1024 * 1024
        }
      },
      {
        timestamp: 1662199200 * 1000,
        from: '127.0.0.1:1271',
        to: '192.168.1.1:1234',
        value: {
          fileName: 'reichenbach_fall.jpg',
          fileSize: 2048 * 2048
        }
      }
    ],
    prevHash: '7o9xwpoqbzc',
    hash: 'gl8f77g5nhv'
  }
];

const PRETTIER_CONFIG = new File(
  [
    `
{
  "arrowParens": "avoid",
  "bracketSameLine": true,
  "printWidth": 80,
  "singleQuote": true,
  "trailingComma": "none"
}
`
  ],
  'prettier.config.json',
  { type: 'application/json' }
);

const PEER = {
  uid: 'al7gixpaoma',
  ipAddress: '127.0.0.1:1271',
  explicitName: 'Sherlock Holmes',
  collection: [
    {
      name: 'BelgraviaScandal.json',
      size: 1024 * 1024
    },
    {
      name: 'baskervilleHounds.mkv',
      size: 4096 * 4096
    },
    {
      name: 'reichenbach_fall.jpg',
      size: 2048 * 2048
    }
  ]
};

const PEERS = [
  {
    uid: '7o9xwpoqbzc',
    ipAddress: '192.168.1.1:1234',
    explicitName: 'William Moriarty',
    collection: [
      {
        name: 'SixThatchers.pdf',
        size: 1024 * 1024
      },
      {
        name: 'lyingDetective.mp4',
        size: 4096 * 4096
      },
      {
        name: 'final_problem.png',
        size: 2048 * 2048
      }
    ],
    connectionStatus: 'ONLINE'
  },
  {
    uid: 'gl8f77g5nhv',
    ipAddress: '172.16.0.254:2540',
    explicitName: 'John Watson',
    collection: [
      {
        name: 'PinkStudy.txt',
        size: 1024 * 1024
      },
      {
        name: 'blindBanker.avi',
        size: 4096 * 4096
      },
      {
        name: 'great_game.svg',
        size: 2048 * 2048
      }
    ],
    connectionStatus: 'OFFLINE'
  }
];

export const getChain = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(BLOCKS);
    }, 1000);
  });
};

export const uploadFile = () => {
  const random = Math.floor(Math.random() * 5) + 1;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // There is a 20% chance of failing...
      if (Math.floor(Math.random() * 5) + 1 === 5) {
        reject({ response: { status: 409, statusText: 'Conflict' } });
      } else {
        resolve({
          message: "File Uploaded: 'unknown.md'"
        });
      }
    }, 1000);
  });
};

export const downloadFile = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(PRETTIER_CONFIG);
    }, 1000);
  });
};

export const openFile = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(PRETTIER_CONFIG);
    }, 1000);
  });
};

export const deleteFile = () => {
  const random = Math.floor(Math.random() * 5) + 1;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // There is a 20% chance of failing...
      if (Math.floor(Math.random() * 5) + 1 === 5) {
        reject({
          response: {
            status: 404,
            statusText: 'Not Found',
            data: { message: 'File Not Found' }
          }
        });
      } else {
        resolve({
          message: "File Deleted: 'prettier.config.js'"
        });
      }
    }, 1000);
  });
};

export const connect = (host: string, pswd: string) => {
  const upperPswd = pswd.toUpperCase();

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (upperPswd === 'AZERTY' || upperPswd === 'QWERTY') {
        resolve({ jwt: 'xxxxx.yyyyy.zzzzz' });
      } else {
        reject(new Error("Unauthorized: Try 'AZERTY' Or 'QWERTY' =)"));
      }
    }, 1000);
  });
};

export const getInfo = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(PEER);
    }, 1000);
  });
};

export const updatePeer = () => {
  const random = Math.floor(Math.random() * 5) + 1;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // There is a 20% chance of failing...
      if (Math.floor(Math.random() * 5) + 1 === 5) {
        reject({
          response: {
            status: 401,
            statusText: 'Unauthorized',
            data: { message: 'Expired Token' }
          }
        });
      } else {
        resolve({
          message: 'Peer Up To Date'
        });
      }
    }, 1000);
  });
};

export const getAllPeers = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(PEERS);
    }, 1000);
  });
};

export const createPeer = () => {
  const random = Math.floor(Math.random() * 5) + 1;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // There is a 20% chance of failing...
      if (Math.floor(Math.random() * 5) + 1 === 5) {
        reject({
          response: {
            status: 401,
            statusText: 'Unauthorized',
            data: { message: 'Expired Token' }
          }
        });
      } else {
        resolve({
          message: "Peer Connected: 'al7gixpaoma'"
        });
      }
    }, 1000);
  });
};

export const getPeer = (host: string, token: string, uid: string) => {
  const random = Math.floor(Math.random() * 5) + 1;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // There is a 20% chance of failing...
      if (Math.floor(Math.random() * 5) + 1 === 5) {
        reject({
          response: {
            status: 404,
            statusText: 'Not Found',
            data: { message: 'Peer Not Found' }
          }
        });
      } else {
        resolve(PEERS.find(p => p.uid === uid));
      }
    }, 1000);
  });
};

export const deletePeer = () => {
  const random = Math.floor(Math.random() * 5) + 1;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // There is a 20% chance of failing...
      if (Math.floor(Math.random() * 5) + 1 === 5) {
        reject({
          response: {
            status: 401,
            statusText: 'Unauthorized',
            data: { message: 'Expired Token' }
          }
        });
      } else {
        resolve({ message: "Peer Deleted: '7o9xwpoqbzc'" });
      }
    }, 1000);
  });
};
