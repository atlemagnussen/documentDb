# User

## Just some EF commands

### the cli

dotnet tool install --global dotnet-ef
or
dotnet tool update --global dotnet-ef

### manage

dotnet ef migrations add InitialCreatePostgres
dotnet ef migrations add AddDocumentCreatedMetadata

dotnet ef database update