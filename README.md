
# BlockLab DSL
A blockchain-independent Domain-Specific Language (DSL) for Smart Contract Development.

This is the accompanying code repository for the following master thesis:<br/>
[BlockLab](MSE_BlockLab.pdf)

## Demo
The [BlockLab Development Environment](https://blocklab.greensoftware.ch/) is available for demonstration purposes.

## Build the project yourself
```
./gradlew clean build -x test
```

### Run locally
Running the BlockLab IDE locally on your machine:
```
./gradlew jettyRun
```

Once started, access the IDE on:
> http://localhost:8080/blocklabIDE/

### Deploy with Docker

#### Create the WAR
Create the WAR file to be used by Docker:
```
./gradlew war
```

#### Build Docker Container 
Build the docker container with:
```
docker build --tag blocklab-1_0_0 .
```

#### Run Docker Container
To run the container on port 8080, use:
```
docker run -p 8080:8080 blocklab-1_0_0
```

To run the container on a custom port, replace port and run:
```
docker run -p <port>:8080 blocklab-1_0_0
```

#### Run with Docker Compose
Change the port in ```docker-compose.yml``` if wanted.

Start server with
```
docker compose up -d 
```

### ATTENTION!!
If you do not use the internal port 8080 for the docker container, you have to specify the URL and port of the web server.

Locate the ```.env``` file in folder:
> org.zhaw.husmaret.mt.blocklab.web\src\main\webapp

Set the server URL in ```.env``` file:
```
REACT_APP_SERVER_URL=<Host>
REACT_APP_BLOCKLAB_PORT=<Port>
```
