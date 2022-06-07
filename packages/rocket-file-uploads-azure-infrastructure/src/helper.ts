import { ApplicationSynthStack } from '@boostercloud/framework-provider-azure-infrastructure'

export const getFunctionAppName = (applicationSynthStack: ApplicationSynthStack): string =>
  `${applicationSynthStack.resourceGroupName}filesfunc`
