import { INestApplicationContext } from '@nestjs/common';

export async function shutdown(app?: INestApplicationContext, _?: Error) {
  await app?.flushLogs();
  await app?.close();
}
