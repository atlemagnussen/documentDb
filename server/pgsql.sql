
INSERT INTO public."ApiResources" ("Enabled", "Name", "DisplayName", "Description", "ShowInDiscoveryDocument", "RequireResourceIndicator", "Created", "NonEditable")
values (true, 'documentDb', 'DocumentDb', 'Document Database', true, false, NOW(), false)

INSERT INTO public."ApiResourceScopes" ("Scope", "ApiResourceId")
VALUES ('doc', 2)

INSERT INTO public."ApiScopes" ("Enabled", "Name", "DisplayName", "Description", "Required", "Emphasize", "ShowInDiscoveryDocument", "Created", "NonEditable")
values (true, 'doc', 'DocumentDb', 'Document Database', true, false, true, NOW(), false)

INSERT INTO public."ClientScopes" ("Id", "Scope", "ClientId")
values (6, 'doc', 1)

insert Into public."ApiResourceClaims" ("ApiResourceId", "Type")
values (2, 'email')

insert Into public."ApiResourceClaims" ("ApiResourceId", "Type")
values (2, 'name')

insert into public."ApiScopeClaims" ("ScopeId", "Type")
values (2, 'role')