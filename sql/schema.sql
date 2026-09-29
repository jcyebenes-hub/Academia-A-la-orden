-- GALÓN — Esquema PostgreSQL para producción
-- server.js usa JSON en data/ por defecto (funciona en cualquier hosting).
-- Cuando escales, migra con este esquema y sustituye jread/jsave por consultas
-- (los accesos a datos están aislados y la forma de los objetos no cambia).

CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  salt          TEXT NOT NULL,
  pass_hash     TEXT NOT NULL,
  founder       BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  verify_token  TEXT,
  reset_token   TEXT,
  reset_until   BIGINT,
  created_at    BIGINT NOT NULL,
  subscriptions JSONB DEFAULT '[]'
);

CREATE TABLE sessions (
  token    TEXT PRIMARY KEY,
  uid      TEXT REFERENCES users(id) ON DELETE CASCADE,
  created  BIGINT NOT NULL,
  expires  BIGINT NOT NULL
);

CREATE TABLE payments (
  id       TEXT PRIMARY KEY,
  uid      TEXT REFERENCES users(id) ON DELETE SET NULL,
  email    TEXT,
  plan     TEXT NOT NULL,
  cycle    TEXT NOT NULL,
  amount   NUMERIC(8,2),
  coupon   TEXT,
  last4    TEXT,
  provider TEXT,
  status   TEXT,
  created  BIGINT
);

CREATE TABLE checkouts (
  sid     TEXT PRIMARY KEY,
  uid     TEXT,
  plan    TEXT,
  cycle   TEXT,
  coupon  TEXT,
  amount  NUMERIC(8,2),
  status  TEXT,
  provider TEXT,
  created BIGINT
);

CREATE TABLE progress (
  uid        TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  state      JSONB NOT NULL,
  updated_at BIGINT
);

CREATE TABLE audit (
  t      BIGINT,
  action TEXT,
  ip     TEXT,
  uid    TEXT,
  extra  TEXT
);
CREATE INDEX idx_audit_t ON audit(t);
CREATE INDEX idx_payments_uid ON payments(uid);

-- Al mover a Postgres: reemplazar jread/jsave en server.js por pg.query,
-- los hashes scrypt y la lógica de negocio se conservan tal cual.
