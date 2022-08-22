# Mocca Net(work)

The network built from **Deno** (_from scratch_, without additional library) makes it possible to launch a **P2P** network node

## Process

Initialize a node:

```sh
deno run --import-map=importMap.json --allow-net --allow-read --allow-write server.ts --host 192.168.1.10 --port 8110
```

Initialize an another node:

```sh
deno run --import-map=importMap.json --allow-net --allow-read --allow-write server.ts --host 192.168.1.20 --port 8120
```

Launch tests:

```sh
deno test --import-map=importMap.json --allow-net --allow-read --allow-write
```

## Note

_That's possible to activate the **CORS** (for the launching of nodes from the same workstation) with the argument_ `--cors`

```sh
deno run --import-map=importMap.json --allow-net --allow-read --allow-write server.ts --cors
```

## Docs

- **Deno**: A modern runtime for JavaScript and TypeScript
  - [https://deno.land/](https://deno.land/)
  
- **WebSocket**: An advanced technology that makes it possible to open a two-way interactive communication...
  - [https://developer.mozilla.org/docs/Web/API/WebSockets_API/](https://developer.mozilla.org/docs/Web/API/WebSockets_API/)