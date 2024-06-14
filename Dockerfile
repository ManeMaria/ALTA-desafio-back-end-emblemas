# -------------->
FROM node:18.20.3-alpine3.19 as installer

USER node

WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN yarn --frozen-lockfile --non-interactive

COPY --chown=node:node src/libs/prisma/schema.prisma ./prisma/


RUN npx prisma generate


# -------------->
FROM node:18.20.3-alpine3.19 as builder

USER node

WORKDIR /home/node

COPY --chown=node:node --from=installer /home/node/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

# -------------->
FROM node:18.20.3-alpine3.19 as runner

RUN apk add dumb-init

ENV NODE_ENV 'production'

USER node

WORKDIR /home/node

COPY --chown=node:node --from=installer /home/node/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/dist ./dist
COPY --chown=node:node src/libs/prisma/migrations ./migrations
COPY --chown=node:node src/libs/prisma/schema.prisma ./
COPY --chown=node:node package.json ./
COPY --chown=node:node wait-for.sh ./

CMD ["dumb-init", "node", "dist/src/main.js"]
