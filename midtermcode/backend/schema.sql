
-- create enum type once
CREATE TYPE user_role AS ENUM ('DEVELOPER', 'LEAD');

-- use it in your table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL
);

-- create enum types
CREATE TYPE environment_t AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');
CREATE TYPE service_status_t AS ENUM ('HEALTHY', 'DEGRADED', 'DOWN');

-- table
CREATE TABLE microservices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  environment environment_t NOT NULL,
  status service_status_t NOT NULL,
  version TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, environment)
);

INSERT INTO users (email, password_hash)
VALUES ('admin@pulsedesk.com', '$2b$10$cNW75jErgSgjMU5kz3L8S..cJqdmZiHu2ZICuF3T5KE7v0rMuUOxS');
