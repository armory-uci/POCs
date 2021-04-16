Steps to build image and run container

1. docker image  build -t <image_name> .
2. docker container run --rm -p 5000:5000 -p 3001:3001 <image_name>
