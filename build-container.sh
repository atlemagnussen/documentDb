podman build -f Containerfile --tag dev.logout.work/empire/docstore:latest .

# example of action
name: Build Image

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: docker
    steps:
      - uses: actions/checkout@v4
      - run: docker version
      - run: echo "${{ secrets.REGISTRY_PASSWORD }}" | docker login dev.logout.work -u "${{ secrets.REGISTRY_USERNAME }}" --password-stdin
      - run: docker build -t dev.logout.work/empire/aspauth:${{ github.sha }} .
      - run: docker push dev.logout.work/empire/aspauth:${{ github.sha }}