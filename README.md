# JupiterOne Integration

Learn about the data ingested, benefits of this integration, and how to use it
with JupiterOne in the [integration documentation](docs/jupiterone.md).

## Development

### Prerequisites

1. Install [Node.js](https://nodejs.org/) using the
   [installer](https://nodejs.org/en/download/) or a version manager such as
   [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm).
2. Install [`yarn`](https://yarnpkg.com/getting-started/install) or
   [`npm`](https://github.com/npm/cli#installation) to install dependencies.
3. Install dependencies with `yarn install`.
4. Register an account in the system this integration targets for ingestion and
   obtain API credentials.
5. `cp .env.example .env` and add necessary values for runtime configuration.

   When an integration executes, it needs API credentials and any other
   configuration parameters necessary for its work (provider API credentials,
   data ingestion parameters, etc.). The names of these parameters are defined
   by the `IntegrationInstanceConfigFieldMap`in `src/config.ts`. When the
   integration is executed outside the JupiterOne managed environment (local
   development or on-prem), values for these parameters are read from Node's
   `process.env` by converting config field names to constant case. For example,
   `clientId` is read from `process.env.CLIENT_ID`.

   The `.env` file is loaded into `process.env` before the integration code is
   executed. This file is not required should you configure the environment
   another way. `.gitignore` is configured to to avoid commiting the `.env`
   file.

### Running the integration

1. `yarn start` to collect data
2. `yarn graph` to show a visualization of the collected data
3. `yarn j1-integration -h` for additional commands

### Ingesting data as a custom integration

**In JupiterOne**

1. Create a custom integration in JupiterOne
   (apps.us.jupiterone.io/integrations/custom)
2. Generate an INTEGRATION API KEY for use with this custom integration

**In this project / CLI**

1. Clone this repo
   (`git clone git@github.com:JupiterOne/graph-aws-extender-scan-factory.git`)
   or download and unzip this project.
2. Run `yarn install` from a command line
3. Create a `.env` file at the root of this project with the following values:
   ```
   JUPITERONE_API_KEY=<jupiterone-api-key>
   JUPITERONE_ACCOUNT=<jupiterone-account-id>
   ```
4. Update the `src/config.ts` file with scan factory scans & pointers you would like to ingest.
5. Run
   `yarn j1-integration run --integrationInstanceId <integration-instance-id>`
   from a command line

### Making Contributions

Start by taking a look at the source code. The integration is basically a set of
functions called steps, each of which ingests a collection of resources and
relationships. The goal is to limit each step to as few resource types as
possible so that should the ingestion of one type of data fail, it does not
necessarily prevent the ingestion of other, unrelated data. That should be
enough information to allow you to get started coding!

See the
[SDK development documentation](https://github.com/JupiterOne/sdk/blob/master/docs/integrations/development.md)
for a deep dive into the mechanics of how integrations work.

See [docs/development.md](docs/development.md) for any additional details about
developing this integration.

### Changelog

The history of this integration's development can be viewed at
[CHANGELOG.md](CHANGELOG.md).
