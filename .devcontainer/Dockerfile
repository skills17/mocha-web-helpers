FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:16

RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm alias 16 system"

# install cypress dependencies
RUN apt-get update && apt-get install --no-install-recommends --yes \
  libgtk2.0-0 \
  libgtk-3-0 \
  libgbm-dev \
  libnotify-dev \
  libgconf-2-4 \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb \
  && rm -rf /var/lib/apt/lists/*
