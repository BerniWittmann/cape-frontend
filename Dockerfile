FROM cypress/base

MAINTAINER Bernhard Wittmann <bernhard.wittmann@uni-ulm.de>

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install vue cli
RUN npm install --quiet --global @vue/cli

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .