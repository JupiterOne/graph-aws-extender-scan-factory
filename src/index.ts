import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { integrationStep } from './steps';
import { validateInvocation } from './validateInvocation';

export const invocationConfig: IntegrationInvocationConfig = {
  instanceConfigFields: {},
  validateInvocation,
  integrationSteps: [integrationStep],
};
