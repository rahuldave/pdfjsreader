docker buildx build --load -t pdfjsreader:latest .
docker tag pdfjsreader:latest public.ecr.aws/t0a9q9b2/pdfjsreader:latest
docker push public.ecr.aws/t0a9q9b2/pdfjsreader:latest