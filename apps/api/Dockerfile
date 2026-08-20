FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY AromeraCommerce.sln ./
COPY Aromera.Api/Aromera.Api.csproj Aromera.Api/
COPY Aromera.Application/Aromera.Application.csproj Aromera.Application/
COPY Aromera.Domain/Aromera.Domain.csproj Aromera.Domain/
COPY Aromera.Infrastructure/Aromera.Infrastructure.csproj Aromera.Infrastructure/
RUN dotnet restore
COPY . .
RUN dotnet publish Aromera.Api/Aromera.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "Aromera.Api.dll"]
