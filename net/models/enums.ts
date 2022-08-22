export enum RequestMethod {
  Post = 'POST',
  Get = 'GET',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Options = 'OPTIONS'
}

export enum MessageType {
  HandShake = 'HAND_SHAKE',
  NewName = 'NEW_NAME',
  NewFile = 'NEW_FILE',
  SyncChain = 'SYNC_CHAIN'
}

export enum ConnectionStatus {
  Online = 'ONLINE',
  Offline = 'OFFLINE'
}
