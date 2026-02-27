using DocumentSys.Auth.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace DocumentSys.Auth;

public static class AuthenticationStartup
{
    public static void AddAuthentication(this WebApplicationBuilder builder, string authServer)
    {
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(o =>
        {
            o.MapInboundClaims = false;
            o.Authority = authServer;
            o.Audience = "documentDb";
            o.RequireHttpsMetadata = true;
            o.SaveToken = true;
            o.TokenValidationParameters = new TokenValidationParameters
            {
                NameClaimType = "name",
                RoleClaimType = "role",
                ValidateIssuer = true,
                ValidateAudience = true
            };
        });

        builder.Services.AddAuthorization(options =>
        {
            options.AddPolicy(Policies.RequiresAdmin, policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("role", UserRoles.Admin.ToString());
            });
        });
    }
}