-- # add timescaledb extension to the current database
CREATE EXTENSION IF NOT EXISTS timescaledb;
-- # drop the table
DROP TABLE IF EXISTS success_logger;

--
-- # create logger table
--
CREATE TABLE success_logger (
    id uuid not null,
    data json,
    processed text default false,
    time timestamptz not null default now()
);
-- # create hypertable
SELECT create_hypertable('success_logger', 'time');

-- # drop the table
DROP TABLE IF EXISTS success_valid;
--
-- # create valid data table
--
CREATE TABLE success_valid (
    id uuid not null,
    data json,
    time timestamptz not null default now()
);

-- # create hypertable
SELECT create_hypertable('success_valid', 'time');

-- # drop the table
DROP TABLE IF EXISTS success_invalid;
--
-- # create valid data table
--
CREATE TABLE success_invalid (
   id uuid not null,
   data json,
   time timestamptz not null default now()
);

-- # create hypertable
SELECT create_hypertable('success_invalid', 'time');
