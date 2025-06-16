import { Injectable, OnModuleInit } from '@nestjs/common';
import { Hocuspocus, Configuration } from '@hocuspocus/server';
import { SQLite } from '@hocuspocus/extension-sqlite';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CollaborationGateway implements OnModuleInit {
  private hocuspocus: Hocuspocus;

  // constructor(private jwtService: JwtService) { }

  onModuleInit() {
    this.hocuspocus = new Hocuspocus({
      port: 1235, // 使用不同端口
      extensions: [
        new SQLite({
          database: 'collaboration.db',
        }),
      ],
      // async onAuthenticate(data) {
      //   try {
      //     // 使用与聊天相同的JWT验证
      //     const payload = this.jwtService.verify(data.token);
      //     return { user: payload };
      //   } catch (e) {
      //     return false;
      //   }
      // },
      onListen: () => console.log('服务器已启动'),
      onConnect: (conn) => console.log(`客户端连接: ${conn.id}`),
      onDisconnect: (conn) => console.log(`客户端断开: ${conn.id}`),
      onError: (error) => console.error('服务器错误:', error)
    } as unknown as Configuration);
  }
}