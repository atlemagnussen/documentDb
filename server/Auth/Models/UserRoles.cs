using System.Text.Json.Serialization;

namespace DocumentSys.Auth.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum UserRoles
{
    Admin
}