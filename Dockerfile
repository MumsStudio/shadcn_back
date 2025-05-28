FROM node:18

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm install

# 复制 Prisma 并生成客户端
COPY prisma ./prisma
RUN npx prisma generate

# 复制源码并构建
COPY . .
RUN npm run build

EXPOSE 7382

CMD ["npm", "run", "start:dev"]