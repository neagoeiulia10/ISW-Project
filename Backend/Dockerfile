FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Backend/TravelApp.csproj", "Backend/"]
RUN dotnet restore "Backend/TravelApp.csproj"
COPY . .
WORKDIR "/src/Backend"
RUN dotnet build "TravelApp.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "TravelApp.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "TravelApp.dll"] 