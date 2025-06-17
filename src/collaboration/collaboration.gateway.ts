import { Injectable, OnModuleInit } from '@nestjs/common';
import { Hocuspocus } from '@hocuspocus/server';
import { SQLite } from '@hocuspocus/extension-sqlite';
import { Server } from '@hocuspocus/server'
@Injectable()
export class CollaborationGateway implements OnModuleInit {
  private hocuspocus: Hocuspocus;

  onModuleInit() {

    let timeout;
    const server = new Server({
      port: 1235,
      timeout: 3000,
      debounce: 5000,
      // maxDebounce: 5000,
      async onConnect() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          console.log('New connection');
        }, 500); // 500ms内只执行最后一次
      },
      async onDisconnect() {
        console.log('Connection closed');
      },
      extensions: [
        new SQLite({
          database: 'db.sqlite'
        }),
      ],
    });

    server.listen()
  }
}