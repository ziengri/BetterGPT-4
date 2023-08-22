# Stage 1: Build
FROM node:alpine AS builder

RUN addgroup -S appgroup && \
  adduser -S appuser -G appgroup && \
  mkdir -p /home/appuser/app && \
  chown appuser:appgroup /home/appuser/app

USER appuser

RUN yarn config set prefix ~/.yarn && \
  yarn global add typescript serve vite

WORKDIR /home/appuser/app

COPY --chown=appuser:appgroup package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile

COPY --chown=appuser:appgroup . .

RUN /home/appuser/.yarn/bin/vite optimize && \
  /home/appuser/.yarn/bin/vite build --minify

# Stage 2: Run
FROM node:alpine

RUN addgroup -S appgroup && \
  adduser -S appuser -G appgroup && \
  mkdir -p /home/appuser/app && \
  chown appuser:appgroup /home/appuser/app

USER appuser

RUN yarn config set prefix ~/.yarn && \
  yarn global add serve

WORKDIR /home/appuser/app

COPY --chown=appuser:appgroup --from=builder /home/appuser/app/dist ./dist

EXPOSE 5001

CMD ["/home/appuser/.yarn/bin/serve", "-s", "dist", "-l", "5001"]


